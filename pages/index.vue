<template>
  <section class="section">
    <section class="main-content columns">
      <aside class="column is-2 section">
        <p class="menu-label is-hidden-touch">
          Your Rooms
        </p>
        <ul class="menu-list">
          <li v-for="room of joined_rooms" :key="room.id">
            <a>
              {{ room.name }}
            </a>
          </li>
        </ul>
      </aside>

      <div class="column is-10">
        Hello
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
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
  }
};
</script>
