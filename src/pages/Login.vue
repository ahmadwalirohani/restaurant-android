<script setup>
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";

defineProps({
  canResetPassword: {
    type: Boolean,
  },
  status: {
    type: String,
  },
});

const errorMsg = ref(null);
const router = useRouter();
const $q = useQuasar();
const form = reactive({
  name: "",
  password: "",
  remember: false,
  loading: false,
});
const validate = reactive({
  name: false,
  password: false,
  nameMsg: "",
  passwordMsg: "",
  loading: false,
});

const submit = () => {
  form.loading = true;
  axios
    .post("http://dev.product-processing.com/api/auth/login", {
      name: form.name,
      password: form.password,
      remember: form.remember,
    })
    .then((res) => {
      form.loading = false;

      const { accessToken, userData, userAbilities, system_info } = res.data;
      localStorage.setItem("userAbilities", JSON.stringify(userAbilities));
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("system_info", JSON.stringify(system_info));

      router.replace("/");
    })
    .catch((error) => {
      form.loading = false;
      errorMsg.value = JSON.stringify(error);
    });
};
</script>

<template>
  <div
    class="fit row wrap justify-center items-start content-start"
    style="
      height: 100vh !important;

      background-size: cover;
    "
  >
    <q-card
      class="bg-grey-2"
      style="margin-top: 100px; height: fit-content; width: 350px"
    >
      <q-card-section>
        <center><img src="/logo.jpg" width="200" height="200" alt="" /></center>
        <h5
          align="center"
          class="text-weight-bold mb-0"
          style="margin-bottom: 10px; margin-top: 0px"
        >
          Restaurant Management System
        </h5>
      </q-card-section>
      <q-card-section>
        <form @submit.prevent="submit" class="q-gutter-md">
          <q-input
            ref="nameRef"
            :error="validate.name"
            filled
            v-model="form.name"
            label="name"
            color="dark"
          >
            <template v-slot:error>
              {{ validate.nameMsg }}
            </template>
          </q-input>
          <q-input
            ref="passRef"
            filled
            color="dark"
            v-model="form.password"
            label="Password"
            type="password"
          />
          <q-separator />
          <div>
            <q-checkbox
              color="secondary"
              label="Remember Me"
              v-model="form.remember"
            />
            <q-space></q-space>
            <q-btn
              :loading="form.loading"
              label="Login"
              type="submit"
              color="secondary"
            />
            <q-btn
              label="reset"
              type="reset"
              color="secondary"
              flat
              class="q-ml-sm"
            />
          </div>
        </form>
        <div contenteditable="true">
          {{ errorMsg }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
