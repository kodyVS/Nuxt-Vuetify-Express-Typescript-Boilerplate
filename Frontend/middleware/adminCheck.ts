import { useUserStore } from "@/stores/auth";
import { useSnackbarStore } from "@/stores/snackbar";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const snackbar = useSnackbarStore();
  if (!userStore.isAdmin) {
    snackbar.show({
      type: "error",
      message: "Not authorized",
    });
    return navigateTo("/");
  }
});
