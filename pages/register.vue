<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Register!</h2>

          <Notification :message="error" v-if="error" />

          <form method="post" @submit.prevent="register">
            <b-field label="Username">
              <b-input v-model="username" maxlength="30" required></b-input>
            </b-field>
            <b-field label="Email">
              <b-input type="email" v-model="email" maxlength="30"> </b-input>
            </b-field>
            <b-field label="Display">
              <b-input v-model="displayName" maxlength="30"> </b-input>
            </b-field>
            <b-field label="Password">
              <b-input type="password" v-model="password" password-reveal>
              </b-input>
            </b-field>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Register
              </button>
            </div>
          </form>

          <div class="has-text-centered" style="margin-top: 20px">
            Already got an account? <nuxt-link to="/login">Login</nuxt-link>
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
      username: "",
      email: "",
      password: "",
      displayName: "",
      error: null
    };
  },

  methods: {
    async register() {
      // To format data as HTML Form
      const formify = function(email, password) {
        const form = new FormData();
        form.append("username", email);
        form.append("password", password);
        return form;
      };

      try {
        // Signup new user
        await this.$axios.post("auth/signup", {
          username: this.username,
          email: this.email,
          password: this.password,
          display_name: this.displayName
        });
        // Proceed to login
        await this.$auth.loginWith("local", {
          data: formify(this.email, this.password)
        });
        // reroute to home page
        this.$router.push("/");
      } catch (e) {
        this.error = e.response.data.message || e.response.data.detail;
      }
    }
  }
};
</script>
