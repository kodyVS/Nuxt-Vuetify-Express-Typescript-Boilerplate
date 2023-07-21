<template>
  <div>This page is user authenicated</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    definePageMeta({
      middleware: ["auto-login", "auth-check"],
      // or middleware: 'auth'
    });
    return {};
  },
});
</script>

<style scoped></style>
