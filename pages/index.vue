<template>
  <section class="columns">
    <!-- SIDEBAR -->
    <aside class="menu column is-3 section has-background-warning-light">
      <p class="menu-label is-hidden-touch">
        Your Rooms
      </p>
      <ul class="menu-list">
        <li v-for="room of joinedRooms" :key="room.id">
          <a
            v-on:click="selectedRoomId = room.id"
            v-bind:class="{ 'is-active': room.id === selectedRoomId }"
          >
            {{ room.name }}
          </a>
        </li>
      </ul>
      <Modal :joined-rooms="joinedRooms" :refresh-callback="getJoinedRooms" />
    </aside>

    <!-- MAIN CHAT WINDOW -->
    <div class="column is-9 section">
      <ChatWindow
        :selected-room="selectedRoom"
        :data-loaded="dataLoaded"
        :members="members"
        :messages-with-users="messagesWithUsers"
      />
    </div>
  </section>
</template>

<script>
import Message from "~/components/Message";
import Modal from "~/components/Modal";
import LoadingMessage from "~/components/LoadingMessage";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import { api } from "@/api.js";

export default {
  components: { Message, LoadingMessage, Modal },
  middleware: "auth",

  created() {
    console.log("created called.");
    // this.test();
    this.getJoinedRooms();
    this.wsConnect();
  },

  data() {
    return {
      // msg: "",
      selectedRoomId: 0,
      joinedRooms: [],
      ws: null,
      messages: [],
      members: [],
      defaultUser: {
        username: "Unknown User"
      },
      dataLoaded: false
    };
  },

  methods: {
    test(num) {
      this.$store.dispatch("getMembers", 1);
    },
    wsConnect() {
      const token = this.$auth.strategy.token.get().split(" ")[1];
      console.log(token);
      this.ws = new WebSocket("ws://localhost:8000/api/v1/ws?token=" + token);
      this.ws.onmessage = event => {
        let data = JSON.parse(event.data);
        console.log(data);
        this.messages.push(data);
      };
      this.ws.onopen = function(event) {
        console.log(event);
        console.log("Successfully connected to the echo websocket server...");
      };
      this.ws.onclose = function(event) {
        console.log(event);
        console.log("WebSocket closed");
      };
      this.ws.onerror = function(event) {
        console.log(event);
        console.log("WebSocket Error!");
      };
      console.log(this.ws.url);
    },
    onSendMessage() {
      console.log("Entered");
      const input = this.$refs.chatbar;
      const data = {
        user_id: this.loggedInUser.id,
        room_id: this.selectedRoomId,
        timestamp: new Date().toISOString(),
        text: input.value
      };
      const msg = JSON.stringify(data);
      this.ws.send(msg);
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
      console.log(response);
      // this.selectedRoomId = this.joinedRooms[0];
      this.getJoinedRooms();
    },
    async getMembers() {
      // const response = await this.$axios.get(
      //   "members/room/" + this.selectedRoomId
      // );
      // console.log(response);
      this.members = await api.getMembers(this.$axios, this.selectedRoomId);
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
        // const response = await this.$axios.get(
        //   `messages/room/${roomId}/?skip=0&limit=100`
        // );
        // this.messages = response.data;
        this.messages = await api.getRooms(this.$axios, roomId);
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
    ...mapGetters(["loggedInUser", "myRooms"]),
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
    }
  }
};
</script>
