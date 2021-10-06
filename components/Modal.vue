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
            Rooms to join
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
      rooms: []
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
