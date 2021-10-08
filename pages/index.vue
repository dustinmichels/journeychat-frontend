<template>
  <section class="columns is-fullheight is-gapless">
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
            <span>
              {{ room.name }}
            </span>
          </a>
        </li>
      </ul>
      <p class="menu-label"></p>
      <Modal :joined-rooms="joinedRooms" :refresh-callback="getJoinedRooms" />
    </aside>

    <div class="column is-10 is-flex is-flex-direction-column">
      <ChatWindow :room-data="currRoomData" :key="selectedRoomId" />

      <!-- SEARCH -->
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
import ChatWindow from "../components/ChatWindow.vue";

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
      messages: [],
      members: [],
      defaultUser: {
        username: "Unknown User"
      },
      dataLoaded: false,
      chatData: {} // Data about each room, keyed by room_id
    };
  },

  methods: {
    /** Create new empty room */
    roomBuilder(room) {
      return {
        room: room,
        dataLoaded: false,
        messages: [],
        members: []
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
        console.log("recieved new message", data);
        this.messages.push(data);
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
          this.chatData[room.id] = this.roomBuilder(room);
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
      let user = this.members.find(x => x.id === userId);
      if (typeof user === "undefined") {
        return this.defaultUser;
      } else {
        return user;
      }
    },
    async onRoomSwitch(roomId) {
      let room = this.chatData[roomId];
      if (!room.dataLoaded) {
        try {
          console.log("Loading data...");
          room.messages = await api.getRoomMessages(this.$axios, roomId);
          room.members = await api.getRoomMembers(this.$axios, roomId);
          room.dataLoaded = true;
        } catch (e) {
          console.log("error!");
          console.log(e);
        }
      }
    }
  },
  watch: {
    selectedRoomId: async function(roomId) {
      this.onRoomSwitch(roomId);

      this.dataLoaded = false;
      if (roomId == undefined) {
        this.messages = [];
        this.dataLoaded = true;
      }
      try {
        this.messages = await api.getRoomMessages(this.$axios, roomId);
        this.members = await api.getRoomMembers(
          this.$axios,
          this.selectedRoomId
        );
        // this.messages = response.data;
        this.dataLoaded = true;
      } catch (e) {
        console.log("error!");
        console.log(e);
        this.messages = [];
      }
    }
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    selectedRoom: function() {
      const res = this.joinedRooms.find(x => x.id === this.selectedRoomId);
      if (res == undefined) {
        return { name: "" };
      } else {
        return res;
      }
    },
    currRoomData: function() {
      return this.chatData[this.selectedRoomId];
    },
    messagesWithUsers: function() {
      return this.messages.map(m => {
        m["user"] = this.getUser(m.user_id);
        return m;
      });
    }
  }
};
</script>
