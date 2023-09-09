<template>
    <div>
        <div id="mainInput">
            <ion-input @focusout="calculateLetters" :clear-input="true" label="Please Enter Words: "></ion-input>
            <ion-range @ionChange="onIonChange" label="Speed! "></ion-range>
        </div>
        <div>
            <canvas id="mainCanvas"></canvas>
        </div>
        <div>
            <ion-button @mousedown="Left" @mouseup="stopMoving">Left</ion-button>
            <ion-button @mousedown="Right" @mouseup="stopMoving">Right</ion-button>
            <ion-button @mousedown="Up" @mouseup="stopMoving">Up</ion-button>
            <ion-button @mousedown="Down" @mouseup="stopMoving">Down</ion-button>
        </div>
    </div>
</template>

<script setup>
import { IonButton, IonInput, IonRange } from '@ionic/vue';
import { ref, onMounted } from 'vue';

// Canvas
const mainCanvas = ref(null);
const canvasContext = ref(null)
//let bgImage = ref(null);
// Indexes
let i = -1;
let globalIndex = 0;
// Letters
let correctLetters = 'abc';
let wrongLetters = [] = 'defghijklmnopqrstuvwxyz'.split('');
// Board size
const tileSize = 20;
const rows = 25;
const cols = 15;
const fontSize = '30px'
// Directions and movement
let isMoving = true;
let direction = {
    left: 0,
    right: 1,
    up: 2,
    down: 3,
}
let currentDirection = null;
// Coordinates
let spriteCoords = { x: 0, y: 0 };
let correctLetterCoords = { x: 100, y: 100 };
let wrongLettersCoords = [
    { x: 20, y: 20 },
    { x: 40, y: 40 },
    { x: 60, y: 60 },
    { x: 80, y: 80 },
    { x: 100, y: 100 },
    { x: 120, y: 120 },
    { x: 140, y: 140 },
    { x: 160, y: 160 },
    { x: 180, y: 180 },
    { x: 200, y: 200 }
];

const gameState = {
    speed: 5, // * (tileSize/4),
    direction: direction.right,
    score: 0,
    gameOver: false,
}

onMounted(() => {
    mainCanvas.value = document.getElementById('mainCanvas');
    mainCanvas.value.width = cols * tileSize;
    mainCanvas.value.height = rows * tileSize;
    canvasContext.value = mainCanvas.value.getContext('2d');

    correctLetterGenerator();
    wrongLetterGenerator();

    animationLoop();
});

function animationLoop() {
    if (isMoving) {
        if (currentDirection === direction.up && spriteCoords.y > 0) {
            spriteCoords.y -= gameState.speed;
        }
        else if (currentDirection === direction.down && spriteCoords.y < tileSize * (rows - 3)) {
            spriteCoords.y += gameState.speed;
        }
        else if (currentDirection === direction.left && spriteCoords.x > 0) {
            spriteCoords.x -= gameState.speed;
        }
        else if (currentDirection === direction.right && spriteCoords.x < tileSize * (cols - 1)) {
            spriteCoords.x += gameState.speed;
        }
    }

    //draw the background
    canvasContext.value.fillStyle = 'green';
    canvasContext.value.fillRect(0, 0, cols * tileSize, rows * tileSize);
    //canvasContext.value.drawImage(bgImage.value, 0, 0, 300, 500);

    //draw score
    canvasContext.value.fillStyle = 'black';
    canvasContext.value.font = `${fontSize } Arial`
    const scorePadding = 7;
    canvasContext.value.textBaseline = "bottom"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText('Score: ' + gameState.score, scorePadding, (rows * tileSize) - scorePadding);

    //draw sprite
    canvasContext.value.fillStyle = 'red';
    canvasContext.value.fillRect(spriteCoords.x, spriteCoords.y, tileSize, tileSize);

    const collisionDistance = 12;
    console.log('x ' + Math.abs(spriteCoords.x - correctLetterCoords.x))
    console.log('y' + Math.abs(spriteCoords.y - correctLetterCoords.y))
    if ((Math.abs(spriteCoords.x - correctLetterCoords.x) < collisionDistance) && ((Math.abs(spriteCoords.y - correctLetterCoords.y)) < collisionDistance)) {
        gameState.score++;
        //draw correct letter
        correctLetterGenerator();

        //draw wrong letter
        wrongLetterGenerator();

        //TODO fix this loop bug
        //I think it is just the order in which it's called.
        if (globalIndex <= correctLetters.length - 2) {
            globalIndex++;
        } else {
            globalIndex = 0;
        }

    }
    correctLetterDraw();
    wrongLetterDraw();

    requestAnimationFrame(animationLoop)

    //console.log('speed test')
    /*  let fps = 32;
     setTimeout(() => {
         requestAnimationFrame(animationLoop);
     }, 1000 / fps); */

}

function calculateLetters(event) {
    let wordToLearn = event.target.value;
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let tempAlphabet = "";
    correctLetters = wordToLearn.split('');

    for (let i = 0; i < correctLetters.length; i++) {
        tempAlphabet = alphabet.replace(correctLetters[i], '');
        alphabet = tempAlphabet;
    }

    wrongLetters = alphabet.split('');
}

function randomInteger(min, max) {
    console.log('randomInt ' + ((Math.floor(Math.random() * (max - min + 1)) + min)) * tileSize) * tileSize;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function correctLetterGenerator() {
    //TODO check this logic
    for (let i = 0; i < wrongLettersCoords.length - 1; i++) {
        correctLetterCoords.x = (randomInteger(3, (cols - 3)) * tileSize); //the minus brings them in from the edge.
        correctLetterCoords.y = (randomInteger(3, (rows - 4)) * tileSize); //the minus is for space for the score board.
    }
}
function correctLetterDraw() {
    canvasContext.value.fillStyle = 'blue';
    canvasContext.value.font = `bold ${fontSize } Arial`;
    canvasContext.value.textBaseline = "top";
    canvasContext.value.fillText(correctLetters[globalIndex], correctLetterCoords.x, correctLetterCoords.y);
}
function wrongLetterGenerator() {
    for (let i = 0; i <= wrongLettersCoords.length - 1; i++) {
        wrongLettersCoords[i].x = (randomInteger(3, (cols - 3)) * tileSize); //the minus brings them in from the edge.
        wrongLettersCoords[i].y = (randomInteger(3, (rows - 4)) * tileSize); //the minus is for space for the score board.
    }

}
function wrongLetterDraw() {
    canvasContext.value.fillStyle = 'orange';
    canvasContext.value.font = `bold ${fontSize } Arial`
    canvasContext.value.textBaseline = "top";
    for (let i = 0; i <= 10 - 1; i++) {
        canvasContext.value.fillText(wrongLetters[i], wrongLettersCoords[i].x, wrongLettersCoords[i].y);
    }
}

function Left() {
    isMoving = true
    currentDirection = direction.left
    //animationLoop();
}
function Right() {
    isMoving = true
    currentDirection = direction.right
    //animationLoop();
}
function Up() {
    isMoving = true
    currentDirection = direction.up
    //animationLoop();
}
function Down() {
    isMoving = true
    currentDirection = direction.down
    //animationLoop();
}

function stopMoving() {
    isMoving = false;
    //console.log('spite coords ')
    //console.dir(spriteCoords)
}

</script>

<style>
#mainCanvas {
    border: 2px solid gray;
}

#mainInput {
    width: 300px;
    margin-left: 400px;
}

</style>