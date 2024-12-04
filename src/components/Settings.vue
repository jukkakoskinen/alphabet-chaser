<template>
    <div id="divMainSettings">
        <div id="divTopSettings">
            <ion-item class="ion-text-center" v-for="(word, index) in words" :key="index">
                <ion-label>{{ word }}</ion-label>
            </ion-item>
        </div>
        <div id="divMiddleSettings">
            <ion-input @focusout="calculateLetters" type="text" :clear-input="true"
            label="Enter Your Own Words or Sentences" label-placement="floating" fill="outline"></ion-input>
        </div>
    </div>
</template>

<script setup>
import { IonButton, IonInput, IonItem, IonLabel, useBackButton, useIonRouter } from '@ionic/vue';
import { contractOutline } from 'ionicons/icons';
import { ref, reactive, onMounted, } from 'vue';

const emit = defineEmits(['backButton']);

// Back button to exit the app.
const ionRouter = useIonRouter();
useBackButton(-1, () => {
    emit('backButton');
});


onMounted(() => {
});

let wordToLearn = ref('test');
let words = reactive(['hi', 'bye', 'hot', 'cold', 'I am', 'eat', 'drink']);
let correctLetters = '';
let wrongLetters = '';

function calculateLetters(event) {
    //TODO fix this. what is the event target valiue?
    console.log(event)
    console.log(event.target.value)
    if (event.target.value === '') {
        wordToLearn = 'hi'
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
    // globalIndex = 0;
    words.push(wordToLearn);
    console.log(wordToLearn);
}

</script>

<style scoped>


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
    width: 85%;
    /* border: 2px solid green; */
}
</style>