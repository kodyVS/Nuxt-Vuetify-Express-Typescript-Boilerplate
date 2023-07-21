import { useSnackbarStore } from "@/stores/snackbar";
import { useUserStore } from "@/stores/auth";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const snackbar = useSnackbarStore();
  if (!userStore.isAuthenticated) {
    snackbar.show({
      type: "error",
      message: "Not authorized to view this page",
    });
    return navigateTo("/");
  }
});
