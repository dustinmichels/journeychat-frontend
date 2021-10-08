<template>
  <!-- <div style="height:100vh; overflow:hidden;"> -->
  <div>
    <Navbar />
    <Nuxt />
  </div>
</template>

<script>
import Navbar from "~/components/Navbar";

export default {
  components: {
    Navbar
  }
};
</script>
