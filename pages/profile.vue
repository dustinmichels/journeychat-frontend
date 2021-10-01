<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Profile</h2>

      <div class="columns">
        <div class="column is-one-quarter">
          <b-image
            is-128x128
            :src="loggedInUser.avatar"
            alt="Profile Pic"
            rounded="rounded"
          >
          </b-image>
        </div>
        <div class="column">
          <p>
            <strong>Username:</strong>
            {{ loggedInUser.username }}
          </p>
          <p>
            <strong>Email:</strong>
            {{ loggedInUser.email }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  middleware: "auth",
  computed: {
    ...mapGetters(["loggedInUser"])
  }
};
</script>
