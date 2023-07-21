import { useUserStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  if (!userStore.isAuthenticated) {
    await userStore.autoLogin();
  }
});
