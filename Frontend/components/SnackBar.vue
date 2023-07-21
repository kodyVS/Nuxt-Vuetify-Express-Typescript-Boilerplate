<template>
  <div>
    <v-snackbar
      v-model="snackBarStore.snackObject.show"
      :class="snackbarStyle.snackbarClass"
      location="top"
      ><template v-slot:actions>
        <v-btn
          :color="snackbarStyle.buttonColor"
          variant="text"
          @click="snackBarStore.closeSnackbar"
        >
          Close
        </v-btn>
      </template>
      <v-icon class="mr-4" :color="snackbarStyle.iconColor">{{
        snackbarStyle.icon
      }}</v-icon>
      <span> {{ snackBarStore.snackObject.message }}</span>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { useSnackbarStore } from "@/stores/snackbar";
import { computed } from "vue";
type SnackbarType = "success" | "error";
export default defineComponent({
  setup() {
    const snackBarStore = useSnackbarStore();
    const snackbarOptions: Record<
      SnackbarType,
      {
        snackbarClass: string;
        buttonColor: string;
        icon: string;
        iconColor: string;
      }
    > = {
      success: {
        snackbarClass: "",
        buttonColor: "success",
        icon: "mdi-check",
        iconColor: "green",
      },
      error: {
        snackbarClass: "",
        buttonColor: "success",
        icon: "mdi-alert-circle-outline",
        iconColor: "red",
      },
    };
    const snackbarStyle = computed(() => {
      return snackbarOptions[snackBarStore.snackObject.type as SnackbarType];
    });
    return { snackBarStore, snackbarStyle };
  },
});
</script>
