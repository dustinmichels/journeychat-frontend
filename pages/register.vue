<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Register!</h2>

          <Notification :message="error" v-if="error" />

          <form method="post" @submit.prevent="register">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="username"
                  v-model="username"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  type="email"
                  class="input"
                  name="email"
                  v-model="email"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                  required
                />
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Register
              </button>
            </div>
          </form>

          <div class="has-text-centered" style="margin-top: 20px">
            Already got an account? <nuxt-link to="/login">Login</nuxt-link>
          </div>

          <!-- <div id="example-2">
            <button v-on:click="greet">Greet</button>
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from "~/components/Notification";

export default {
  components: {
    Notification
  },

  data() {
    return {
      username: "",
      email: "",
      password: "",
      error: null
    };
  },

  methods: {
    async register() {
      //  MORE ERROR CATCHING
      // this.$axios
      //   .post("auth/signup", {
      //     username: this.username,
      //     email: this.email,
      //     password: this.password
      //   })
      //   .catch(function(error) {
      //     if (error.response) {
      //       // The request was made and the server responded with a status code
      //       // that falls out of the range of 2xx
      //       console.log(error.response.data);
      //       console.log(error.response.status);
      //       console.log(error.response.headers);
      //     } else if (error.request) {
      //       // The request was made but no response was received
      //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //       // http.ClientRequest in node.js
      //       console.log(error.request);
      //     } else {
      //       // Something happened in setting up the request that triggered an Error
      //       console.log("Error", error.message);
      //     }
      //     console.log(error.config);
      //   });

      try {
        await this.$axios.post("auth/signup", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      } catch (e) {
        this.error = e.response.data.message;
      }

      // OG WAY
      // try {
      // await this.$axios.post("auth/signup", {
      //   username: this.username,
      //   email: this.email,
      //   password: this.password
      // });
      // const form = new FormData();
      // form.append("username", this.email);
      // form.append("password", this.password);
      //   await this.$auth.loginWith("local", {
      //     data: form
      //   });
      //   this.$router.push("/");
      // } catch (e) {
      //   this.error = e.response.data.message;
      // }
    }

    // greet: function(event) {
    //   this.$router.push("/");
    // }
  }
};
</script>
