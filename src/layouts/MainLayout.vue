<template>
  <q-layout view="lHh lpr lFf">
    <q-header elevated class="bg-secondary">
      <q-toolbar>
        <q-toolbar-title>Restaurant App</q-toolbar-title>
        <q-btn round dense flat icon="logout" @click="LogoutUserFn"> </q-btn>
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
      <q-tabs narrow-indicator v-model="tab" inline-label="">
        <q-route-tab
          icon="shopping_cart_checkout"
          label="Order Taking"
          to="/order-taking"
          exact
        />
        <q-route-tab icon="grading" label="Orders" to="/" exact />
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const tab = ref("order-taking");
const router = useRouter();

const LogoutUserFn = () => {
  api.get("logout").then((Response) => {
    localStorage.removeItem("userAbilities");
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("system_info");
    router.replace("/login");
  });
};
</script>
