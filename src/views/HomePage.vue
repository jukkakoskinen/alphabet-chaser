<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="header">
          <strong>Sound Tuition's<br>Alphabet Chaser</strong>
          <ion-button @click="toggleSettings()">
            <ion-icon :icon="Cog"></ion-icon>
          </ion-button>
        </div>
        <div id="components">
          <main-canvas v-if="!showSettings"></main-canvas>
          <settings v-else></settings>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/vue';
import { settingsSharp as Cog } from 'ionicons/icons';
import mainCanvas from '@/components/MainCanvas.vue';
import settings from '@/components/Settings.vue';

let showSettings = ref(false);

function toggleSettings() {
  showSettings.value = !showSettings.value;
  console.log(showSettings);
}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  float: left;
  font-size: 20px;
  line-height: 26px;
}

#header {
  display: inline-block;
}

ion-button {
  float: right;
  margin-left: 10px;
}

#components {
  height: 700px;

}
</style>
