<template>
  <section class="columns">
    <aside class="menu column is-2 section has-background-warning-light">
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

      <p class="menu-label"></p>

      <b-button rounded icon-left="plus">
        Add
      </b-button>
    </aside>

    <div class="column is-10 section">
      <span class="is-size-3">{{ selectedRoom.name }}</span>
      <div style="height:500px; overflow: scroll;">
        <li v-for="(msg, index) in messages" :key="index">
          {{ msg }}
        </li>
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
import LoadingMessage from "~/components/LoadingMessage";
import { mapGetters } from "vuex";

export default {
  components: { Message, LoadingMessage },
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
      messages: ["Example msg 1. -- User1", "Example msg 2. -- User2"]
    };
  },

  methods: {
    wsConnect() {
      const token = this.$auth.strategy.token.get().split(" ")[1];
      console.log(token);
      this.ws = new WebSocket("ws://localhost:8000/api/v1/ws?token=" + token);
      this.ws.onmessage = event => {
        console.log(event.data);
        this.messages.push(event.data);
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
    }
  }
};
</script>
