<template>
    <div id="divMain">
        <ion-label>
            <h1>{{ mainWord }}</h1>
        </ion-label>
    </div>
</template>

<script setup>
import { IonLabel } from '@ionic/vue';
import { ref, onMounted } from 'vue';

const mainWord = 'hi';

onMounted(() => {
});


</script>

<style scoped>
#divMain {
    display: grid;
}

#divTop {
    margin-left: auto;
    margin-right: auto;
    height: 10%;
    width: 80%;
    /* border: 2px solid green; */
}

ion-range {
    padding: 0px;
}

#mainCanvas {
    border: 2px solid gray;
}
</style>