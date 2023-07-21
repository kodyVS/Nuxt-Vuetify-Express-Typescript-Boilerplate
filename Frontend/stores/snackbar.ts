import { defineStore } from "pinia";

interface SnackObject {
  type: "success" | "error" | "";
  message: string;
  show: boolean;
}
export type SnackInput = Omit<SnackObject, "show">;

export const useSnackbarStore = defineStore("snackbar", {
  state: (): { snackObject: SnackObject } => ({
    snackObject: {
      type: "success",
      message: "",
      show: false,
    },
  }),
  actions: {
    show(snackInput: SnackInput) {
      this.snackObject = {
        ...snackInput,
        show: true,
      };
    },
    closeSnackbar() {
      this.snackObject.show = false;
    },
  },
});
