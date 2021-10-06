<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <img :src="msg.user.avatar" v-bind:style="styleObj" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <span v-bind:class="{ 'has-background-info-light': isOwnMessage }">
            <strong>{{ msg.user.display_name }}</strong>
          </span>
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
        border: "1px solid #ffe08a;"
      };
    }
  }
};
</script>
