<template>
  <section>
    <div class="buttons p-4">
      <b-button rounded icon-left="plus" type="is-link" @click="launchModal">
        Add More
      </b-button>
    </div>

    <b-modal v-model="isJoinModalActive" :width="640" scroll="keep">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Join public rooms
          </p>
        </header>
        <div class="card-content">
          <div
            v-for="(room, index) in joinableRooms"
            :key="index"
            class="media"
          >
            <div class="media-content">
              <div class="content">
                {{ room.name }}
              </div>
            </div>
            <div class="media-right">
              <b-button
                @click="joinRoom(room.id)"
                type="is-success is-light"
                icon-right="plus"
              >
                Join
              </b-button>
            </div>
          </div>
        </div>
        <footer class="card-footer">
          <a
            @click="
              isJoinModalActive = false;
              isCreateModalActive = true;
            "
            class="card-footer-item"
            >Create new</a
          >
        </footer>
      </div>
    </b-modal>

    <b-modal v-model="isCreateModalActive" :width="640" scroll="keep">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Create New Room
          </p>
        </header>
        <div class="card-content">
          <form method="post" @submit.prevent="createRoom">
            <b-field label="Room Name">
              <b-input v-model="createRoomForm.roomName"></b-input>
            </b-field>
            <div class="block">
              <b-radio
                v-model="createRoomForm.isPrivate"
                name="name"
                native-value="false"
              >
                Public
              </b-radio>
              <b-radio
                v-model="createRoomForm.isPrivate"
                name="name"
                native-value="true"
              >
                Private
              </b-radio>
            </div>

            <div class="control">
              <b-button type="is-primary" native-type="submit">Submit</b-button>
            </div>
          </form>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<style lang="scss">
// @import "~/bulma/sass/utilities/_all.sass";

// @import "~bulma/sass/utilities/_all";

// @include mobile {
//   background-color: red;
// }
</style>

<script>
import api from "@/api.js";

export default {
  props: ["joinedRoomIds"],
  data() {
    return {
      isJoinModalActive: false,
      isCreateModalActive: false,
      joinableRooms: [],
      createRoomForm: {
        roomName: "",
        isPrivate: "false"
      }
    };
  },
  methods: {
    async launchModal() {
      this.isJoinModalActive = true;
      this.updateJoinableRooms();
    },
    async updateJoinableRooms() {
      const publicRooms = await api.getPublicRooms(this.$axios);
      console.log(publicRooms);
      this.joinableRooms = publicRooms.filter(
        room => this.joinedRoomIds.indexOf(String(room.id)) == -1
      );
    },
    async joinRoom(roomId) {
      const room = await api.joinRoom(this.$axios, roomId);
      this.$emit("joined-room", room);
      this.isJoinModalActive = false;
    },
    async createRoom() {
      const room = await api.createRoom(
        this.$axios,
        this.createRoomForm.roomName,
        this.createRoomForm.isPrivate
      );
      this.$emit("created-room", room);
      this.createRoomForm.roomName = ""; // clear form
      this.isCreateModalActive = false; // close modal
    }
  }
};
</script>
