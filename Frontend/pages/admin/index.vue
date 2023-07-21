<template>
  <div>Admin</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    definePageMeta({
      middleware: ["auto-login", "admin-check"],
      // or middleware: 'auth'
    });
    return {};
  },
});
</script>

<style scoped></style>
