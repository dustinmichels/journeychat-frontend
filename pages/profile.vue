<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Profile</h2>

      <!-- <card title="You" icon="account">
        <div class="columns">
          <div class="column">
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
      </card> -->

      <div class="card">
        <!-- <div class="card-image">
          <figure class="image is-4by3">
            <img
              src="https://bulma.io/images/placeholders/1280x960.png"
              alt="Placeholder image"
            />
          </figure>
        </div> -->
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-128x128">
                <img :src="loggedInUser.avatar" alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ loggedInUser.username }}</p>
              <p class="subtitle is-6">{{ loggedInUser.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  middleware: "auth",
  computed: {
    ...mapGetters(["loggedInUser"])
  }
};
</script>
