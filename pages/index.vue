<template>
  <section class="columns is-fullheight is-gapless is-mobile">
    <!-- SIDE MENU -->
    <aside class="menu column is-2 has-background-dark">
      <p class="menu-label is-hidden-touch p-4 has-text-light">
        Your Rooms
      </p>
      <ul class="menu-list">
        <li v-for="room of joinedRooms" :key="room.id">
          <a
            v-on:click="selectedRoomId = room.id"
            v-bind:class="{ 'is-active': room.id === selectedRoomId }"
            class="px-4 has-text-light  "
          >
            {{ room.name }}
            <b-tag type="is-danger" v-if="chatData[room.id].unread">{{
              chatData[room.id].unread
            }}</b-tag>
          </a>
        </li>
        <Modal :joined-rooms="joinedRooms" :refresh-callback="getJoinedRooms" />
      </ul>
      <p class="menu-label"></p>
    </aside>

    <!-- CHAT WINDOW -->
    <div class="column is-10 is-flex is-flex-direction-column">
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
            autofocus
          />
        </div>
        <div class="control">
          <button class="button is-info" @click="onSendMessage">
            <b-icon icon="send" size="is-small"> </b-icon>
          </button>
        </div>
      </div>

      <!-- END -->
    </div>
  </section>
</template>

<script>
import io from "socket.io-client";
import { mapGetters } from "vuex";
import { api } from "@/api.js";

export default {
  middleware: "auth",

  created() {
    this.getJoinedRooms();
    this.socketConnect();
  },

  data() {
    return {
      selectedRoomId: 0,
      joinedRooms: [],
      socket: null,
      dataLoaded: false,
      defaultUser: {
        username: "Unknown User"
      },
      chatData: {} // Data about each room, keyed by room_id
    };
  },

  methods: {
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
      });
      this.socket.on("connect_error", e => {
        console.error(e.toString());
      });
      this.socket.on("disconnect", () => {
        console.log("disconnected:", this.socket.id);
      });
      this.socket.on("new-message", data => {
        this.chatData[data.room_id].messages.push(data);
        if (this.selectedRoomId != data.room_id) {
          this.chatData[data.room_id].unread++;
        }
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
    async getJoinedRooms() {
      try {
        const response = await this.$axios.get("rooms/joined/");
        this.joinedRooms = response.data;
        this.selectedRoomId = this.joinedRooms[0].id;
        // Init chat data
        this.joinedRooms.forEach(room => {
          this.$set(this.chatData, room.id, this.roomBuilder(room));
          // this.chatData[room.id] = this.roomBuilder(room);
        });
      } catch (e) {
        this.joinedRooms = [];
        this.selectedRoomId = 0;
      }
    },
    async leaveRoom() {
      const response = await this.$axios.put(
        "actions/leave/" + this.selectedRoomId
      );
      this.getJoinedRooms();
    },
    getUser(userId) {
      let user = this.currRoom.members.find(x => x.id === userId);
      if (typeof user === "undefined") {
        return this.defaultUser;
      } else {
        return user;
      }
    },
    async onRoomSwitch(roomId) {
      let room = this.chatData[roomId];
      // load data if missing
      if (!room.dataLoaded) {
        try {
          room.messages = await api.getRoomMessages(this.$axios, roomId);
          room.members = await api.getRoomMembers(this.$axios, roomId);
          room.dataLoaded = true;
        } catch (e) {
          console.log("error!");
          console.log(e);
        }
      }
      // reset unread count
      this.chatData[roomId].unread = 0;
    }
  },
  watch: {
    selectedRoomId: async function(roomId) {
      this.dataLoaded = false;
      await this.onRoomSwitch(roomId);
      this.dataLoaded = this.currRoom.dataLoaded;
    }
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    /** Retrieve joined room from list */
    joinedRoom: function() {
      const res = this.joinedRooms.find(x => x.id === this.selectedRoomId);
      if (res == undefined) {
        return { name: "" };
      } else {
        return res;
      }
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
