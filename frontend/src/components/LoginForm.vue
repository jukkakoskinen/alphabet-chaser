<template>
  <form>
    <ion-item>
      <ion-input
        label="Username"
        label-placement="floating"
        type="text"
      ></ion-input>
    </ion-item>
    <ion-item>
      <ion-input
        label="Password"
        label-placement="floating"
        :type="showPassword ? 'text' : 'password'"
      ></ion-input>
      <ion-icon
        :icon="showPassword ? eyeOff : eye"
        @click="showPassword = !showPassword"
      ></ion-icon>
    </ion-item>
    <ion-button id="login-btn" type="button" @click="backToHome"
      >Login</ion-button
    >
  </form>
</template>

<script setup>
import { ref } from "vue";

import { IonItem, IonInput, IonButton } from "@ionic/vue";
import { eyeOutline as eye, eyeOffOutline as eyeOff } from "ionicons/icons";
import { useMainStore } from "@/stores/mainStore";

const mainStore = useMainStore();

const showPassword = ref(false);

function backToHome() {
  mainStore.showLogin = false;
}
</script>

<style scoped>
label {
  font-weight: 600;
}

#login-btn {
  margin-top: 1rem;
  font-weight: 600;
}
</style>
