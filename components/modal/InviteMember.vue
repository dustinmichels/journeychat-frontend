<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        Invite Member
      </p>
      <button type="button" class="delete" @click="$parent.close()" />
    </header>
    <div class="card-content">
      <div v-if="errorMsg" class="has-text-danger">
        {{ errorMsg }}
      </div>
      <div v-if="successMsg" class="has-text-success">
        {{ successMsg }}
      </div>
      <form method="post" @submit.prevent="inviteMember">
        <b-field label="Username">
          <b-input v-model="form.username" autofocus></b-input>
        </b-field>
        <div class="control">
          <b-button type="is-primary" native-type="submit">Submit</b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/api.js";

export default {
  props: ["selectedRoomId"],
  data() {
    return {
      errorMsg: null,
      successMsg: null,
      form: {
        username: ""
      }
    };
  },
  methods: {
    async inviteMember() {
      try {
        const res = await api.inviteMemberToRoom(this.$axios, {
          roomId: this.selectedRoomId,
          username: this.form.username
        });
        this.errorMsg = "";
        this.successMsg = `Success! Added ${this.form.username} to ${res.name}`;
      } catch (e) {
        this.successMsg = "";
        this.errorMsg = "Error! " + e.response?.data?.detail || null;
      }
    }
  }
};
</script>
