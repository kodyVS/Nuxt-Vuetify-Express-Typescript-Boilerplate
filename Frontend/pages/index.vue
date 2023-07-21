<template>
  <div class="homepage">Homepage</div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/auth";
import { defineComponent } from "vue";
export default defineComponent({
  async setup() {
    let auth = useUserStore();
    let res = await auth.autoLogin();
    return {};
  },
});
</script>

<style lang="scss" scoped>
.homepage {
  font-size: 60px;
  width: 100%;
  text-align: center;
}
</style>
