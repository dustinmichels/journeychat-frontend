<template>
  <article class="media" v-bind:style="styleObj">
    <figure v-bind:class="isOwnMessage ? 'media-right' : 'media-left'">
      <p class="image is-64x64">
        <img :src="msg.user.avatar" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p
          v-bind:class="{
            'has-text-primary': msg.user_id == loggedInUser.id
          }"
        >
          <strong>{{ msg.user.display_name }}</strong>
          <small>{{ msg.user.username }}</small>
          <small>31m</small>
          <br />
          {{ msg.text }}
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    isOwnMessage: function() {
      return this.msg.user_id === this.loggedInUser.id;
    },
    styleObj: function() {
      return {
        "text-align": this.isOwnMessage ? "right" : "left"
      };
    }
  }
};
</script>
