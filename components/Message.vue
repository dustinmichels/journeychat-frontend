<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <img
          width="64px"
          height="64px"
          :src="msg.user.avatar"
          :style="styleObj"
        />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ msg.user.display_name }}</strong>
          <small>@{{ msg.user.username }}</small>
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
        borderRadius: "20%",
        border: this.isOwnMessage ? "2px solid #7957d5" : "1px solid grey"
      };
    }
  }
};
</script>
