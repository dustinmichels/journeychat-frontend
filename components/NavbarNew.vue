<template>
  <b-navbar type="is-dark">
    <template #brand>
      <b-navbar-item tag="nuxt-link" to="/">
        <icons-journey-logo :height="30" />
        <em>CHAT</em>
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="nuxt-link" to="/about">
        About
      </b-navbar-item>
    </template>

    <template #end>
      <template v-if="isAuthenticated">
        <b-navbar-dropdown :label="loggedInUser.display_name">
          <b-navbar-item tag="nuxt-link" to="/profile">
            My Profile
          </b-navbar-item>
          <b-navbar-item @click="logout">
            Logout
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>
      <template v-else>
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button tag="nuxt-link" to="/register" type="is-link">
              <strong>Sign up</strong>
            </b-button>
            <b-button tag="nuxt-link" to="/login" type="is-light">
              Log in
            </b-button>
          </div>
        </b-navbar-item>
      </template>
    </template>
  </b-navbar>
</template>

<style lang="scss">
nav {
  box-shadow: 0px 0px 0px 1px #eee;
}
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
