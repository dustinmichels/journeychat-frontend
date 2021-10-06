<template>
  <section class="columns">
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
            <!-- <b-field>
              <b-tag rounded>Private</b-tag>
            </b-field> -->
          </a>
        </li>
      </ul>

      <p class="menu-label"></p>

      <Modal :joined-rooms="joinedRooms" :refresh-callback="getJoinedRooms" />
    </aside>

    <div class="column is-9 section">
      <div class="">
        <span class="is-size-3">{{ selectedRoom.name }} </span>
        <!-- <b-button type="is-danger" size="is-small" icon-right="delete" /> -->

        <MembersModal :members="members" />

        <button v-on:click="leaveRoom">
          <b-icon icon="exit-run" class="buttons"> </b-icon>
        </button>
      </div>

      <div style="height:500px; overflow: scroll;">
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

      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            class="input "
            type="text"
            ref="chatbar"
            placeholder="Your message..."
            v-on:keyup.enter="onSendMessage"
          />
        </div>
        <div class="control">
          <a class="button is-info">
            <b-icon icon="send" size="is-small"> </b-icon>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Message from "~/components/Message";
import Modal from "~/components/Modal";
import LoadingMessage from "~/components/LoadingMessage";
import { mapGetters } from "vuex";

import { getRooms } from "@/api.js";

export default {
  components: { Message, LoadingMessage, Modal },
  middleware: "auth",

  created() {
    console.log("created called.");
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
      const response = await this.$axios.get(
        "members/room/" + this.selectedRoomId
      );
      console.log(response);
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
    }
  }
};
</script>
