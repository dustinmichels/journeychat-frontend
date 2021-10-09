<template>
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
      <a @click="$parent.close()" class="card-footer-item">Done</a>
    </footer>
  </div>
</template>

<script>
/**
 * Display members for a given room.
 * Intended to be launched within a modal.
 */
export default {
  props: ["members"]
};
</script>
