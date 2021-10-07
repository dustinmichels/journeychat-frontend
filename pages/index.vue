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
      <!-- HEADER -->
      <div class="px-4">
        <span class="is-size-3">{{ selectedRoom.name }} </span>
        <MembersModal :members="members" />
        <button v-on:click="leaveRoom">
          <b-icon icon="exit-run" class="buttons"> </b-icon>
        </button>
      </div>
      <hr style="margin: 0.5rem 0;" />
      <!-- MESSAGES -->
      <div class="p-4" style="flex: 1; overflow: scroll;">
        <section v-if="dataLoaded">
          <template v-if="!messages.length">
            No messages!
          </template>
          <template v-else>
            <Message
              v-for="(msg, index) in messagesWithUsers"
              :key="index"
              :msg="msg"
            />
          </template>
        </section>
        <template v-else>
          <LoadingMessage />
        </template>
      </div>

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
import Message from "~/components/Message";
import Modal from "~/components/Modal";
import LoadingMessage from "~/components/LoadingMessage";
import { mapGetters } from "vuex";

import io from "socket.io-client";

// import { getRooms } from "@/api.js";

export default {
  components: { Message, LoadingMessage, Modal },
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
      dataLoaded: false
    };
  },

  methods: {
    socketConnect() {
      if (!this.socket) {
        this.createSocketConnection();
      } else {
        console.log("Already connected!");
      }
    },
    createSocketConnection() {
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
        console.log("recieving something in the chat!");
        console.log(data);
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
        // const headers = { Authorization: this.$auth.strategy.token.get() };
        // const response = await this.$axios.get("rooms/joined/", { headers });
        const response = await this.$axios.get("rooms/joined/");
        this.joinedRooms = response.data;
        this.selectedRoomId = this.joinedRooms[0].id;
      } catch (e) {
        this.joinedRooms = [];
        this.selectedRoomId = 0;
      }
    },
    async leaveRoom() {
      const response = await this.$axios.put(
        "actions/leave/" + this.selectedRoomId
      );
      // console.log(response);
      // this.selectedRoomId = this.joinedRooms[0];
      this.getJoinedRooms();
    },
    async getMembers() {
      const response = await this.$axios.get(
        "members/room/" + this.selectedRoomId
      );
      // console.log(response);
      this.members = response.data;
    },
    getUser(userId) {
      let user = this.members.find(x => x.id === userId);
      if (typeof user === "undefined") {
        return this.defaultUser;
      } else {
        return user;
      }
    }
  },
  watch: {
    selectedRoomId: async function(roomId) {
      this.dataLoaded = false;
      if (roomId == undefined) {
        this.messages = [];
        this.dataLoaded = true;
      }
      try {
        const response = await this.$axios.get(
          `messages/room/${roomId}/?skip=0&limit=100`
        );
        this.messages = response.data;
        await this.getMembers();
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
    messagesWithUsers: function() {
      return this.messages.map(m => {
        m["user"] = this.getUser(m.user_id);
        return m;
      });
    },
    windowHeight() {
      try {
        let windowHeight = window.innerHeight;
        let navbarHeight = document.getElementById("navbar").offsetHeight;
        return `${windowHeight - navbarHeight}px`;
      } catch {
        return "500px";
      }
    }
  }
};
</script>
