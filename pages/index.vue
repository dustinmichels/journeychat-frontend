<template>
  <section class="columns is-fullheight is-gapless is-mobile">
    <!-- SIDE MENU -->
    <aside class="menu column is-3 has-background-dark">
      <p class="menu-label is-hidden-touch p-4 has-text-light">
        Your Rooms
      </p>
      <ul class="menu-list">
        <li v-for="(chatRoom, roomId) in chatData" :key="roomId">
          <a
            @click="selectedRoomId = roomId"
            :class="{ 'is-active': roomId === selectedRoomId }"
            class="px-4 has-text-light  "
          >
            {{ chatRoom.name }}
            <b-tag type="is-danger" v-if="chatRoom.unread">{{
              chatRoom.unread
            }}</b-tag>
          </a>
        </li>
        <AddRoomModal
          v-bind:joined-room-ids="joinedRoomIds"
          v-on:joined-room="onJoinRoom($event)"
          v-on:created-room="onJoinRoom($event)"
        />
      </ul>
      <p class="menu-label"></p>
    </aside>

    <!-- CHAT WINDOW -->
    <div class="column is-9 is-flex is-flex-direction-column">
      <!-- CHAT:HEADER -->
      <div class="px-4">
        <span class="is-size-3">{{ currRoom.name }} </span>
        <MembersModalButton :members="currRoom.members" v-if="dataLoaded" />
        <button v-else>
          <b-icon icon="account-multiple" class="buttons"> </b-icon>
        </button>
        <button v-on:click="leaveRoom">
          <b-icon icon="exit-run" class="buttons"> </b-icon>
        </button>
      </div>
      <hr style="margin: 0.5rem 0;" />
      <!-- CHAT:MESSAGES -->
      <div class="p-4" style="flex: 1; overflow: scroll;">
        <section v-if="dataLoaded">
          <template v-if="!currRoom.messages.length">
            No messages!
          </template>
          <div v-else>
            <Message
              v-for="(msg, index) in chatData[selectedRoomId].messages"
              :key="index"
              :msg="msg"
              :user="getUser(msg.user_id)"
            />
          </div>
        </section>
        <template v-else>
          <LoadingMessage />
        </template>
      </div>
      <!-- CHAT:SEND -->
      <div class="field has-addons p-4">
        <div class="control is-expanded">
          <input
            class="input "
            type="text"
            ref="chatbar"
            placeholder="Your message..."
            @keyup.enter="onSendMessage"
          />
        </div>
        <div class="control">
          <button class="button is-info send-btn" @click="onSendMessage">
            <b-icon icon="send" size="is-small"> </b-icon>
          </button>
        </div>
      </div>

      <!-- END -->
    </div>
  </section>
</template>

<style lang="scss">
.send-btn {
  width: 60px;
}
</style>

<script>
import io from "socket.io-client";
import { mapGetters } from "vuex";
import api from "@/api.js";
import AddRoomModal from "../components/AddRoomModal.vue";

export default {
  components: { AddRoomModal },
  middleware: "auth",

  beforeMount() {},

  created() {
    this.getJoinedRoomsInitial();
    this.socketConnect();
  },

  data() {
    return {
      selectedRoomId: 0,
      socket: null,
      dataLoaded: false,
      defaultUser: {
        username: "Unknown User"
      },
      chatData: {}
    };
  },

  methods: {
    snackbar(msg) {
      this.$buefy.snackbar.open(msg);
    },

    /** Create new empty room */
    roomBuilder(room) {
      return {
        name: room.name,
        isPrivate: room.is_private,
        dataLoaded: false,
        messages: [],
        members: [],
        unread: 0
      };
    },

    socketConnect() {
      const token = this.$auth.strategy.token.get().split(" ")[1];
      this.socket = io("ws://127.0.0.1:8000", {
        path: "/ws/socket.io",
        autoConnect: true,
        transports: ["websocket", "polling", "flashsocket"],
        auth: { token: token }
      });
      this.socket.on("connect", () => {
        console.log("connected:", this.socket.id);
        this.snackbar("Websocket connection established");
      });
      this.socket.on("connect_error", e => {
        console.error(e.toString());
        this.snackbar({
          message: "Websocket connection error",
          type: "is-danger"
        });
      });
      this.socket.on("disconnect", () => {
        console.log("disconnected:", this.socket.id);
        this.snackbar({
          message: "Websocket connection lost!",
          type: "is-danger"
        });
      });
      this.socket.on("reconnect", () => {
        this.snackbar("Websocket reconnected");
      });
      this.socket.on("new-message", data => {
        this.chatData[data.room_id].messages.push(data);
        if (this.selectedRoomId != data.room_id) {
          this.chatData[data.room_id].unread++;
        }
      });
      this.socket.on("online-ping", data => {
        console.log(data);
        this.snackbar(`${data} is online!`);
      });
    },

    onSendMessage() {
      console.log("Entered");
      const input = this.$refs.chatbar;
      const msgData = {
        user_id: this.loggedInUser.id,
        room_id: this.selectedRoomId,
        timestamp: new Date().toISOString(),
        text: input.value
      };
      this.socket.emit("new-message", msgData);
      input.value = "";
    },
    async getJoinedRoomsInitial() {
      console.log("Loading joined rooms");
      try {
        const rooms = await api.getJoinedRooms(this.$axios);
        // Add new room to chatData, in reactive way
        rooms.forEach(room => this.initChatRoom(room));
        // Init selected room to first value
        this.selectedRoomId = this.joinedRoomIds[0];
        console.log("set selectedRoomId", this.selectedRoomId);
      } catch (e) {
        console.error("Could not fetch joined rooms");
        console.log(e);
      }
    },
    onJoinRoom(room) {
      this.initChatRoom(room);
      this.selectedRoomId = String(room.id);
    },
    initChatRoom(room) {
      this.$set(this.chatData, String(room.id), this.roomBuilder(room));
    },
    async leaveRoom() {
      console.log("leaving room");
      const room = await api.leaveRoom(this.$axios, this.selectedRoomId);
      console.log(room);
      this.$delete(this.chatData, room.id);
      this.selectedRoomId = this.joinedRoomIds[0];
    },
    getUser(userId) {
      let user = this.currRoom.members.find(x => x.id === userId);
      if (typeof user === "undefined") {
        return this.defaultUser;
      } else {
        return user;
      }
    },
    async onSwitchRoom(roomId) {
      console.log("switch room", roomId);
      let room = this.chatData[roomId];
      // load data if missing
      if (!room.dataLoaded) {
        console.log("loading data for", roomId);
        try {
          room.messages = await api.getRoomMessages(this.$axios, roomId);
          room.members = await api.getRoomMembers(this.$axios, roomId);
          room.dataLoaded = true;
        } catch (e) {
          console.log("error!");
          console.log(e);
        }
      } else {
        console.log("already have data", roomId);
      }
      // reset unread count
      this.chatData[roomId].unread = 0;
    }
  },
  watch: {
    selectedRoomId: async function(roomId) {
      // roomId = String(roomId);
      this.dataLoaded = false;
      await this.onSwitchRoom(roomId);
      this.dataLoaded = this.currRoom.dataLoaded;
    }
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    joinedRoomIds() {
      return Object.keys(this.chatData);
    },
    /** Retrieve all current room data from chatData */
    currRoom: function() {
      const data = this.chatData[this.selectedRoomId];
      if (!data) {
        return this.roomBuilder({});
      }
      return data;
    }
  }
};
</script>
