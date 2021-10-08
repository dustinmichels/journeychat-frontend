<template>
  <section>
    <div class="buttons p-4">
      <b-button rounded icon-left="plus" type="is-link" @click="launchModal">
        <span class="is-hidden-touch">Add More</span>
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
          <div v-for="(room, index) in displayRooms" :key="index" class="media">
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
export default {
  props: ["refreshCallback", "joinedRooms"],
  data() {
    return {
      isJoinModalActive: false,
      isCreateModalActive: false,
      activeTab: 0,
      rooms: [],
      isSwitchedCustom: "Public",
      createRoomForm: {
        roomName: "",
        isPrivate: "false"
      }
    };
  },
  methods: {
    launchModal() {
      this.isJoinModalActive = true;
      this.getRooms();
    },
    async getRooms() {
      const response = await this.$axios.get("rooms/");
      this.rooms = response.data;
    },
    async joinRoom(roomId) {
      const response = await this.$axios.put("actions/join/" + roomId);
      this.isJoinModalActive = false;
      this.refreshCallback();
    },
    async createRoom() {
      await this.$axios.post("rooms/", {
        name: this.createRoomForm.roomName,
        is_private: this.createRoomForm.isPrivate
      });
      this.createRoomForm.roomName = "";
      this.isCreateModalActive = false;
      this.refreshCallback();
    }
  },
  computed: {
    displayRooms() {
      let joinedRoomIds = this.joinedRooms.map(x => x.id);
      return this.rooms.filter(room => joinedRoomIds.indexOf(room.id) == -1);
    }
  }
};
</script>
