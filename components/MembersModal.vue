<template>
  <span>
    <!-- <div class="buttons">
      <b-button
        rounded
        icon-left="plus"
        label="Add"
        @click="isCardModalActive = true"
      />
    </div> -->
    <button v-on:click="isCardModalActive = true">
      <b-icon icon="account-multiple" class="buttons"> </b-icon>
    </button>

    <b-modal v-model="isCardModalActive" :width="640" scroll="keep">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Members
          </p>
        </header>
        <div class="card-content">
          <div v-for="(member, index) in members" :key="index" class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img :src="member.avatar" alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                {{ member.username }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </span>
</template>

<script>
export default {
  props: ["members"],
  data() {
    return {
      isCardModalActive: false
    };
  },
  methods: {},
  computed: {}
};
</script>
