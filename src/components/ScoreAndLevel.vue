<template>
    <div id="divMain">
        <ion-label>
            <h1>Score: {{ score }}</h1>
        </ion-label>
        <ion-label id="level">
            <h1>Level: {{ level }}</h1>
        </ion-label>
    </div>
</template>

<script setup>
import { App } from '@capacitor/app';
import { IonLabel, } from '@ionic/vue';
import { ref, onMounted } from 'vue';

let score = 1;
let level = 1;



</script>

<style scoped>
#divMain {
    display: flex;
}

#level {
    margin-left: auto;
    margin-right: 0;
}
</style>