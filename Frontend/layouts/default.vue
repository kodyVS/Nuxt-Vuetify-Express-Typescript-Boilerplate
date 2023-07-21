<template>
  <v-app>
    <SnackBar></SnackBar>
    <v-app-bar density="compact" app color="black white--text" class="app-bar">
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="!loggedIn"
        @click="signIn = !signIn"
        color="blue darken-2 white--text"
      >
        <span>Sign in</span>
        <v-icon right>mdi-login-variant</v-icon>
      </v-btn>
      <v-btn v-if="loggedIn" @click="logOut()" color="blue darken-2 white--text"
        >Sign out
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title v-text="item.title" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-dialog v-model="signIn" max-width="600px" min-width="360px">
        <Login @signedIn="signIn = !signIn"></Login>
      </v-dialog>
      <slot />
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/auth";
import { ref, computed } from "vue";
interface Items {
  icon: string;
  title: string;
  to: string;
}
export default {
  name: "NavigationComponent",
  setup() {
    const drawer = ref(false);
    const signIn = ref(false);
    const title = ref("Base App");
    const userStore = useUserStore();
    const loggedIn = computed(() => {
      return userStore.loggedIn;
    });
    const items = ref<Items[]>([
      {
        icon: "mdi-apps",
        title: "Welcome",
        to: "/",
      },
      {
        icon: "mdi-chart-bubble",
        title: "Authenticated",
        to: "/authenticated",
      },
      {
        icon: "mdi-lock",
        title: "admin",
        to: "/admin/",
      },
    ]);

    const currentYear = computed(() => new Date().getFullYear());

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    return {
      drawer,
      signIn,
      items,
      title,
      currentYear,
      toggleDrawer,
      loggedIn,
      userStore,
    };
  },
  methods: {
    async logOut() {
      this.userStore.logOut();
    },
  },
};
</script>
<style lang="scss">
.app-bar {
  border-radius: 0 0 3px 3px;
}
</style>
