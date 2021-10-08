<template>
  <span>
    <b-button
      title="View members"
      type="is-link"
      outlined
      icon-left="account-multiple"
      @click="isActive = true"
    />

    <b-modal v-model="isActive" :width="640" scroll="keep">
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
        <footer class="card-footer">
          <a @click="isActive = false" class="card-footer-item">Done</a>
        </footer>
      </div>
    </b-modal>
  </span>
</template>

<script>
export default {
  props: ["members"],
  data() {
    return {
      isActive: false
    };
  },
  methods: {},
  computed: {}
};
</script>
