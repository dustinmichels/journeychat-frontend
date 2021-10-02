<template>
  <section class="section">
    <section class="main-content columns">
      <aside class="menu column is-2 section">
        <p class="menu-label is-hidden-touch">
          Your Rooms
        </p>
        <ul class="menu-list">
          <li v-for="room of joined_rooms" :key="room.id">
            <a
              v-on:click="selected_room_id = room.id"
              v-bind:class="{ 'is-active': room.id === selected_room_id }"
            >
              {{ room.name }}
            </a>
          </li>
        </ul>
      </aside>

      <div class="column is-10">
        {{ selected_room.name }}
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      selected_room_id: 1,
      joined_rooms: [
        {
          name: "General",
          is_private: false,
          id: 1
        },
        {
          name: "Sci-Fi Lovers",
          is_private: false,
          id: 2
        },
        {
          name: "Python Fans",
          is_private: false,
          id: 3
        }
      ]
    };
  },
  computed: {
    selected_room: function() {
      return this.joined_rooms.find(x => x.id === this.selected_room_id);
    }
  }
};
</script>
