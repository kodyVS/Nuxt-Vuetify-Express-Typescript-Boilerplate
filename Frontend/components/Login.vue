<template>
  <div>
    <div>
      <v-card>
        <v-tabs
          v-model="tab"
          bg-color="deep-purple accent-4"
          icons-and-text
          centered
          stacked
          grow
        >
          <v-tab
            v-for="(i, index) in tabs"
            :key="index"
            :value="index"
            class="login-tab"
          >
            <v-icon large>{{ i.icon }}</v-icon>
            {{ i.name }}
          </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item :value="0">
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-row class="pa-8">
                <v-col cols="12">
                  <v-text-field
                    v-model="loginEmail"
                    :rules="loginEmailRules"
                    label="E-mail"
                    required
                    variant="underlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="loginPassword"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="show1 = !show1"
                    variant="underlined"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6"> </v-col>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                  <v-btn
                    x-large
                    block
                    :disabled="!valid"
                    color="success"
                    @click="login()"
                  >
                    Login
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>

          <v-window-item :value="1">
            <v-form
              class="pa-5"
              ref="registerForm"
              v-model="rvalid"
              lazy-validation
            >
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="firstName"
                    :rules="[rules.required]"
                    label="First Name"
                    maxlength="20"
                    required
                    variant="underlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="lastName"
                    :rules="[rules.required]"
                    label="Last Name"
                    maxlength="20"
                    required
                    variant="underlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                    variant="underlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    variant="underlined"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="passwordConfirm"
                    block
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, passwordMatch]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Confirm Password"
                    counter
                    variant="underlined"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="userRole"
                    label="User Role"
                    :items="['user', 'admin']"
                    required
                    variant="underlined"
                  ></v-select>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                  <v-btn x-large block color="success" @click="signUp()"
                    >Register</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useSnackbarStore } from "@/stores/snackbar";
import { useUserStore } from "@/stores/auth";
import { ref, computed, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup(props, { emit }) {
    const isLoading = ref(false);
    const dialog = ref(true);
    const tab = ref(0);
    const tabs = ref([
      { name: "Login", icon: "mdi-account" },
      { name: "Register", icon: "mdi-account-outline" },
    ]);
    const valid = ref(true);
    const rvalid = ref(true);
    const firstName = ref("kody");
    const lastName = ref("van sloten");
    const email = ref("test@test.com");
    const password = ref("test1234");
    const passwordConfirm = ref("test1234");
    const userRole = ref("user");
    const loginPassword = ref("test1234");
    const loginEmail = ref("test@test.com");
    const loginEmailRules = ref([
      (v: string) => !!v || "Required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ]);
    const emailRules = ref([
      (v: string) => !!v || "Required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ]);

    const show1 = ref(false);
    const rules = ref({
      required: (value: string) => !!value || "Required.",
      min: (v: string) => (v && v.length >= 8) || "Min 8 characters",
    });

    const passwordMatch = computed(() => {
      return password.value === passwordConfirm.value || "Password must match";
    });
    const loginForm = ref<HTMLFormElement | null>(null);
    const registerForm = ref<HTMLFormElement | null>(null);
    const snackbarStore = useSnackbarStore();
    const userStore = useUserStore();
    return {
      isLoading,
      dialog,
      tab,
      tabs,
      valid,
      rvalid,
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      userRole,
      loginPassword,
      loginEmail,
      loginEmailRules,
      emailRules,
      show1,
      rules,
      passwordMatch,
      loginForm,
      registerForm,
      snackbarStore,
      userStore,
    };
  },
  methods: {
    async login() {
      if (this.loginForm?.validate()) {
        this.isLoading = true;
        const loginData = {
          email: this.loginEmail,
          password: this.loginPassword,
        };
        // await store.dispatch("auth/login", loginData);
        await this.userStore.login(loginData);
        this.isLoading = false;
        this.$router.push("/");
        this.$emit("signedIn");
        this.loginPassword = "";
        //store.commit("snackBar", snackBarData);
        this.snackbarStore.show({
          message: "Logged in!",
          type: "success",
        });
      }
    },
    async signUp() {
      if (!this.registerForm?.validate()) {
        return;
      }
      this.isLoading = true;
      const signUpData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        passwordConfirm: this.passwordConfirm,
        userRole: this.userRole,
      };
      await this.userStore.signUp(signUpData);
      this.isLoading = false;

      this.snackbarStore.show({
        message: "Successfully signed up. Welcome!",
        type: "success",
      });
      this.$emit("signedIn");
    },
  },
});
</script>
<style lang="scss">
.login-tab {
  display: flex;
}
</style>
