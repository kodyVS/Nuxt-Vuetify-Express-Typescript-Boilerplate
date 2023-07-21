import { SnackBar } from "./../.nuxt/components.d";
import { defineStore } from "pinia";
import { useSnackbarStore, SnackInput } from "@/stores/snackbar";

// const { apiBase } = useRuntimeConfig();
interface State {
  loggedIn: boolean;
  userId: string;
  userRole: string;
  userName: string;
  apiBase: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userRole: string;
  loggedIn: boolean;
}

interface Response {
  status: string;
  data: {
    email: string;
    firstName: string;
    lastName: string;
    userRole: string;
    _id: string;
  };
}
export const useUserStore = defineStore("user", {
  state: (): State => {
    const apiBase = useRuntimeConfig().public.apiBase;
    return {
      loggedIn: false,
      userId: "",
      userRole: "",
      userName: "",
      apiBase,
    };
  },
  getters: {
    isAuthenticated: (state) => {
      return state.loggedIn !== false;
    },
    isAdmin: (state) => state.userRole === "admin",

    user: (state) => {
      return {
        name: state.userName,
        role: state.userRole,
        id: state.userId,
      };
    },
  },
  actions: {
    setLoggedIn(data: User) {
      this.loggedIn = data.loggedIn;
      this.userRole = data.userRole;
      this.userId = data._id;
      this.userName = `${data.firstName} ${data.lastName}`;
    },
    async logOut() {
      try {
        let res: Response = await $fetch(`${this.apiBase}/auth/logout`, {
          method: "GET",
          credentials: "include",
        });
        this.setLoggedIn({
          userRole: "",
          _id: "",
          firstName: "",
          lastName: "",
          loggedIn: false,
        });
        const snackbarStore = useSnackbarStore();
        snackbarStore.show({ type: "success", message: "Logged out!" });
      } catch (error: any) {
        this.returnError(error, "Error in connecting the server");
        throw new Error(error);
      }
    },
    async login(loginData: { email: string; password: string }) {
      try {
        let res: any = await $fetch(`${this.apiBase}/auth/login`, {
          method: "POST",
          body: JSON.stringify(loginData),
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if (res.data._id) {
          const data = { ...res.data, loggedIn: true };
          this.setLoggedIn(data);
          return "success";
        }
      } catch (error: any) {
        this.returnError(
          error,
          "Error in connecting the server, make sure you have service and hit refresh"
        );
        throw new Error(error);
      }
    },
    async signUp(signUpData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      userRole: string;
    }) {
      try {
        let res = await $fetch(`${this.apiBase}/auth/signup`, {
          method: "POST",
          body: JSON.stringify(signUpData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        return "User created";
      } catch (error: any) {
        this.returnError(error, "Error in connecting the server");
        throw new Error(error);
      }
    },
    returnError(error: any, snackbarDefaultMessage: string) {
      const snackBarData: SnackInput = {
        type: "error",
        message: snackbarDefaultMessage,
      };
      if (error.response) {
        snackBarData.message = error.response.data.message;
      } else if (error) {
        snackBarData.message = snackbarDefaultMessage;
      }
      const snackbarStore = useSnackbarStore();
      snackbarStore.show(snackBarData);
      return snackBarData;
    },
    async autoLogin() {
      console.log(this.apiBase);
      if (!this.isAuthenticated) {
        try {
          let res: Response = await $fetch(`${this.apiBase}/auth/autoLogin`, {
            method: "GET",
            credentials: "include",
          });
          if (res.data._id) {
            const data: User = { ...res.data, loggedIn: true };
            this.setLoggedIn(data);
          }
          return res;
        } catch (error) {}
      }
    },
  },
});
