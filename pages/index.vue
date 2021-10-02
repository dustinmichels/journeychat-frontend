<template>
  <section class="columns">
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

    <div class="column is-10 section">
      {{ selected_room.name }}
      <div style="height:500px; overflow: scroll;">
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
      </div>

      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            class="input "
            type="text"
            ref="chatbar"
            placeholder="Your message..."
            v-on:keyup.enter="onEnter"
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

export default {
  components: { Message, LoadingMessage },

  data() {
    return {
      // msg: "",
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
  methods: {
    onEnter() {
      console.log("Entered");
      this.$refs.chatbar.value = "";
    }
  },
  computed: {
    selected_room: function() {
      return this.joined_rooms.find(x => x.id === this.selected_room_id);
    }
  }
};
</script>
