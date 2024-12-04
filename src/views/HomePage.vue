<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="header">
          <strong>Sound Tuition's<br>Alphabet Chaser</strong>
          <ion-button @click="toggleSettings">
            <ion-icon :icon="Cog"></ion-icon>
          </ion-button>
        </div>
        <div id="components">
          <div v-if="!mainStore.showSettings" id="game">
            <speed-controller></speed-controller>
            <score-and-level></score-and-level>
            <main-word></main-word>
            <main-canvas></main-canvas>
            <controls></controls>
          </div>
          <div v-else id="settings">
            <settings  @back-button="handleBackButton"></settings>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';

import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/vue';
import { settingsSharp as Cog } from 'ionicons/icons';

import speedController from '@/components/SpeedController.vue';
import scoreAndLevel from '@/components/ScoreAndLevel.vue';
import mainWord from '@/components/MainWord.vue';
import mainCanvas from '@/components/MainCanvas.vue';
import settings from '@/components/Settings.vue';
import controls from '@/components/Controls.vue';

import { useMainStore } from '@/stores/mainStore';

const mainStore = useMainStore();

function handleBackButton(){
  toggleSettings();
}

function toggleSettings() {
  mainStore.showSettings = !mainStore.showSettings;
}


</script>

<style scoped>
#container {
  position: absolute;
  display: grid;
  justify-content: center;
  text-align: center;
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
  display: inline-block;

}
</style>
