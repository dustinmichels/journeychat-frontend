<template>
  <section class="columns is-fullheight is-gapless is-mobile">
    <b-modal v-model="isModalActive.displayMembers" :width="640" scroll="keep">
      <ModalDisplayMembers :members="currRoom.members" />
    </b-modal>

    <b-modal v-model="isModalActive.inviteMember" :width="640" scroll="keep">
      <ModalInviteMember :selectedRoomId="selectedRoomId" />
    </b-modal>

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
      <div class="px-4 py-2">
        <div class="level is-mobile">
          <div class="level-left">
            <p class="level-item">
              <span class="is-size-3">{{ currRoom.name }}</span>
            </p>
            <p class="level-item">
              <b-tag v-if="currRoom.isPrivate" type="is-warning" rounded
                >Private</b-tag
              >
              <b-tag v-else type="is-primary" rounded>Public</b-tag>
            </p>
          </div>
          <!-- CHAT:HEADER CONTROL BUTTONS -->
          <div class="level-right">
            <p class="level-item">
              <b-button
                title="View members"
                type="is-link"
                outlined
                icon-left="account-multiple"
                @click="isModalActive.displayMembers = true"
              />
            </p>
            <p class="level-item">
              <b-button
                title="Invite"
                type="is-link"
                outlined
                icon-left="plus"
                @click="isModalActive.inviteMember = true"
              />
            </p>
            <p class="level-item">
              <b-button
                title="Leave room"
                type="is-danger"
                outlined
                icon-left="exit-run"
                @click="onLeaveRoom"
              />
            </p>
          </div>
        </div>
      </div>
      <hr style="margin: 0rem 0;" />
      <!-- CHAT:MESSAGES -->
      <div class="p-4" style="flex: 1; overflow: scroll;">
        <section v-if="currRoom.dataLoaded">
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
          <MessagePlaceholder />
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

/**
 * chatData is populated by room objects
 * Can generate from api-formatted room objects like this.
 **/
function createRoomObject(room) {
  return {
    name: room.name,
    isPrivate: room.is_private,
    dataLoaded: false,
    messages: [],
    members: [],
    unread: 0
  };
}

export default {
  middleware: "auth",

  beforeMount() {
    this.socketConnect();
    this.fetchInitialChatData();
  },

  data() {
    return {
      isModalActive: {
        inviteMember: false,
        displayMembers: false
      },
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
    handleClose(e) {
      console.log("clsoing");
      console.log(e);
    },
    // ===== HELPER METHODS =====
    snackbar(msg) {
      this.$buefy.snackbar.open(msg);
    },
    chatDataAddRoom(room) {
      this.$set(this.chatData, String(room.id), createRoomObject(room));
    },
    chatDataRemoveRoom(room) {
      this.$delete(this.chatData, String(room.id));
    },
    getUser(userId) {
      let user = this.currRoom.members.find(x => x.id === userId);
      if (typeof user === "undefined") {
        return this.defaultUser;
      } else {
        return user;
      }
    },

    // ===== LAUNCHING MODALS =====
    launchMembersModal() {
      this.$buefy.modal.open({
        parent: this,
        component: MembersModalVue,
        props: { members: this.currRoom.members }
        //
      });
    },

    // ===== INIT METHODS =====
    socketConnect() {
      const token = this.$auth.strategy.token.get().split(" ")[1];
      this.socket = io("ws://127.0.0.1:8000", {
        path: "/ws/socket.io",
        autoConnect: true,
        transports: ["websocket", "polling", "flashsocket"],
        auth: { token: token }
      });
      this.socket.on("disconnect", () => {
        console.log("disconnected:", this.socket.id);
        this.snackbar({
          message: "Websocket connection lost!",
          type: "is-danger"
        });
      });
      /**
       * on new-message:
       * Push new message to chatData, for correct room
       * Also increment unread count if that room is not selected
       *
       */
      this.socket.on("new-message", data => {
        this.chatData[data.room_id].messages.push(data);
        if (this.selectedRoomId != data.room_id) {
          this.chatData[data.room_id].unread++;
        }
      });
    },
    async fetchInitialChatData() {
      try {
        const rooms = await api.getJoinedRooms(this.$axios);
        rooms.forEach(room => this.chatDataAddRoom(room)); // add to this.chatData (properly)
        this.selectedRoomId = this.joinedRoomIds[0]; // reset selected
        console.log("set selectedRoomId", this.selectedRoomId);
      } catch (e) {
        console.error("Could not fetch joined rooms");
        console.log(e);
      }
    },

    // ===== EVENTS =====
    onSendMessage() {
      const input = this.$refs.chatbar;
      this.socket.emit("new-message", {
        user_id: this.loggedInUser.id,
        room_id: this.selectedRoomId,
        timestamp: new Date().toISOString(),
        text: input.value
      });
      input.value = "";
    },
    onJoinRoom(room) {
      this.chatDataAddRoom(room);
      this.selectedRoomId = String(room.id);
    },
    /**
     * When room is switched:
     *  loaded data from backend, if missing
     *  reset unread count
     */
    async onSwitchRoom(roomId) {
      let room = this.chatData[roomId];
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
      this.chatData[roomId].unread = 0;
    },
    onLeaveRoom() {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to leave the room ${this.currRoom.name}?`,
        onConfirm: this.leaveRoom
      });
    },
    async leaveRoom() {
      const room = await api.leaveRoom(this.$axios, this.selectedRoomId);
      this.$buefy.toast.open({
        message: `You have left ${this.currRoom.name}`,
        type: "is-success"
      });
      this.chatDataRemoveRoom(room); // remove from chatData, properly
      this.selectedRoomId = this.joinedRoomIds[0];
    }
  },
  watch: {
    selectedRoomId: async function(roomId) {
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
        return createRoomObject({});
      }
      return data;
    }
  }
};
</script>
