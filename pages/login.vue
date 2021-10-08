<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>

          <Notification :message="error" v-if="error" />

          <form method="post" @submit.prevent="login">
            <b-field label="Email">
              <b-input type="email" v-model="email" maxlength="30"> </b-input>
            </b-field>
            <b-field label="Password">
              <b-input type="password" v-model="password" password-reveal>
              </b-input>
            </b-field>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Log In
              </button>
            </div>
          </form>
          <div class="has-text-centered" style="margin-top: 20px">
            <p>
              Don't have an account?
              <nuxt-link to="/register">Register</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from "~/components/Notification";

export default {
  // if user is already signed in, redirect to homepage using custom middleware
  middleware: "guest",

  components: {
    Notification
  },

  data() {
    return {
      email: "",
      password: "",
      error: null
    };
  },

  methods: {
    async login() {
      const formify = function(email, password) {
        const form = new FormData();
        form.append("username", email);
        form.append("password", password);
        return form;
      };
      try {
        await this.$auth.loginWith("local", {
          data: formify(this.email, this.password)
        });
        // this.$axios.setToken(this.$auth.strategy.token.get());
        this.$router.push("/");
      } catch (e) {
        this.error = e.response.data.message || e.response.data.detail;
        console.log(e.response); // for DEBUG
      }
    }
  }
};
</script>
