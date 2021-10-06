<template>
  <section>
    <div class="buttons">
      <b-button
        rounded
        icon-left="plus"
        label="Add"
        @click="isCardModalActive = true"
      />
    </div>

    <b-modal v-model="isCardModalActive" :width="640" scroll="keep">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Join/Create
          </p>
        </header>
        <div class="card-content">
          <p v-if="$fetchState.pending">Loading....</p>
          <p v-else-if="$fetchState.error">Error while fetching mountains</p>
          <div v-else>
            <div
              v-for="(room, index) in displayRooms"
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
        </div>
        <footer class="card-footer">
          <a
            @click="
              isCardModalActive = false;
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

            <!-- <b-field>
              <b-radio-button
                native-value="Public"
                type="is-danger is-light is-outlined"
                v-model="createRoomForm.radio"
              >
                <span>Public</span>
              </b-radio-button>
              <b-radio-button
                native-value="Private"
                type="is-success is-light is-outlined"
                v-model="createRoomForm.radio"
              >
                <span>Private</span>
              </b-radio-button>
            </b-field> -->

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

<script>
export default {
  props: ["refreshCallback", "joinedRooms"],
  data() {
    return {
      isCardModalActive: false,
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
  async fetch() {
    this.rooms = await fetch("http://127.0.0.1:8000/api/v1/rooms/").then(res =>
      res.json()
    );
  },
  methods: {
    async joinRoom(roomId) {
      console.log(roomId);
      const response = await this.$axios.put("actions/join/" + roomId);
      console.log(response);
      this.isCardModalActive = false;
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
