<template>
    <div id="divMainSettings">
        <div id="divTopSettings">
            <ion-input @focusout="calculateLetters" placeholder="hello" :clear-input="true"
                label="Please Enter Words: "></ion-input>
        </div>
        <div id="divMiddleSettings">
            <ion-item v-for="word in words">
                <ion-label>{{ word }}</ion-label>
            </ion-item>
        </div>
    </div>
</template>

<script setup>
import { App } from '@capacitor/app';
import { IonButton, IonInput, IonItem, IonLabel, useBackButton, useIonRouter } from '@ionic/vue';
import { ref, onMounted } from 'vue';

// Back button to exit the app.
const ionRouter = useIonRouter();
useBackButton(-1, () => {
    if (!ionRouter.canGoBack()) {
        App.exitApp();
    }
});


onMounted(() => {

});

let words = ['hi', 'bye', 'hot', 'cold']


function calculateLetters(event) {
    //TODO fix this. what is the event target valiue?
    let wordToLearn = undefined;
    console.log(event)
    console.log(event.target.value)
    if (event.target.value === '') {
        wordToLearn = 'hello'
    }
    wordToLearn = event.target.value;
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let tempAlphabet = "";
    correctLetters = wordToLearn.split('').join('');

    for (let i = 0; i < correctLetters.length; i++) {
        tempAlphabet = alphabet.replace(correctLetters[i], '');
        alphabet = tempAlphabet;
    }

    wrongLetters = alphabet.split('').join('');
    //reset so that the word to find starts from the beginning.
    globalIndex = 0;
}





</script>

<style>
#divMainSettings {
    display: grid;
}

#divTopSettings {
    margin-left: auto;
    margin-right: auto;
    height: 10%;
    width: 35%;
    /* border: 2px solid green; */
}

#divMiddleSettings {
    margin-left: auto;
    margin-right: auto;
    height: 10%;
    width: 35%;
    /* border: 2px solid green; */
}
</style>