<template>
  <nav class="navbar is-dark">
    <div class="container">
      <div class="navbar-brand">
        <!-- <JourneyLogo /> -->
        <nuxt-link class="navbar-item" to="/">JourneyChat</nuxt-link>
        <button class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div
            class="navbar-item has-dropdown is-hoverable"
            v-if="isAuthenticated"
          >
            <a class="navbar-link">
              {{ loggedInUser.username }}
            </a>
            <div class="navbar-dropdown">
              <nuxt-link class="navbar-item" to="/profile"
                >My Profile</nuxt-link
              >
              <hr class="navbar-divider" />
              <a class="navbar-item" @click="logout">Logout</a>
            </div>
          </div>
          <template v-else>
            <nuxt-link class="navbar-item" to="/register">Register</nuxt-link>
            <nuxt-link class="navbar-item" to="/login">Log In</nuxt-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
// nav {
// border-bottom: 1px solid gray;
// box-shadow: 0px 0px 0px 1px #eee;
// }
</style>

<script>
import { mapGetters } from "vuex";

export default {
  methods: {
    async logout() {
      await this.$auth.logout();
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  }
};
</script>
