<template>
  <section>
    <article class="media" v-for="i in media" :key="i">
      <figure class="media-left">
        <p class="image is-64x64">
          <b-skeleton width="64px" height="64px"></b-skeleton>
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <b-skeleton width="20%"></b-skeleton>
            <b-skeleton width="60%" height="50px"></b-skeleton>
          </p>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  data() {
    return {
      media: 4
    };
  }
};
</script>
