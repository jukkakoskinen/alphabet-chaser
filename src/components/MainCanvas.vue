<template>
    <div>
        <div id="topDiv">
            <ion-input @focusout="calculateLetters" placeholder="Hello" :clear-input="true"
                label="Please Enter Words: "></ion-input>
            <ion-range @ionChange="changeSpeed" :pin="true" :ticks="true" :snaps="true" :min="1" :max="8"
                label="Speed! "></ion-range>
        </div>
        <div>
            <canvas id="mainCanvas"></canvas>
        </div>
        <div>
            <ion-button @mousedown="Left" @mouseup="stopMoving" @touchstart="Left" @touchend="stopMoving">Left</ion-button>
            <ion-button @mousedown="Right" @mouseup="stopMoving" @touchstart="Right"
                @touchend="stopMoving">Right</ion-button>
            <ion-button @mousedown="Up" @mouseup="stopMoving" @touchend="stopMoving">Up</ion-button>
            <ion-button @mousedown="Down" @mouseup="stopMoving" @touchstart="Down" @touchend="stopMoving">Down</ion-button>
        </div>
    </div>
</template>

<script setup>
import { App } from '@capacitor/app';
import { IonButton, IonInput, IonRange, useBackButton, useIonRouter } from '@ionic/vue';
import { ref, onMounted } from 'vue';

// Back button to exit the app.
const ionRouter = useIonRouter();
useBackButton(-1, () => {
    if (!ionRouter.canGoBack()) {
        App.exitApp();
    }
});

// Canvas
const mainCanvas = ref(null);
const canvasContext = ref(null)
//let bgImage = ref(null);
// Indexes
let i = -1;
let globalIndex = 0;
// Letters
let correctLetters = 'abc';
let wrongLetters = 'defghijklmnopqrstuvwxyz'.split('');
// Board size
const tileSize = 40;
const rows = 15;
const cols = 9;
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
    speed: 1, // * (tileSize/4),
    direction: direction.right,
    score: 0,
    level: 1,
    gameOver: false,
}

onMounted(() => {
    mainCanvas.value = document.getElementById('mainCanvas');
    mainCanvas.value.width = cols * tileSize;
    mainCanvas.value.height = rows * tileSize;
    canvasContext.value = mainCanvas.value.getContext('2d');

    wrongLetterGenerator();
    correctLetterGenerator();

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
    canvasContext.value.font = `${fontSize} Arial`
    const scorePadding = 7;
    canvasContext.value.textBaseline = "bottom"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText('Score: ' + gameState.score, scorePadding, (rows * tileSize) - scorePadding);

    //draw level
    canvasContext.value.fillStyle = 'black';
    canvasContext.value.font = `${fontSize} Arial`
    canvasContext.value.textBaseline = "bottom"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText('Level: ' + gameState.level, ((cols - 3) * tileSize - scorePadding), (rows * tileSize) - scorePadding);

    //draw sprite
    canvasContext.value.fillStyle = 'red';
    canvasContext.value.fillRect(spriteCoords.x, spriteCoords.y, tileSize, tileSize);

    const collisionDistance = 12;
    if ((Math.abs(spriteCoords.x - correctLetterCoords.x) < collisionDistance) && ((Math.abs(spriteCoords.y - correctLetterCoords.y)) < collisionDistance)) {
        gameState.score++;
        // create new coords for wrong letters
        wrongLetterGenerator();
        // create new coords for correct letter
        correctLetterGenerator();


        // TODO fix this loop bug, it shouldn't need minus 1.
        // I think it is just the order in which it's called.
        if (globalIndex < correctLetters.length - 1) {
            globalIndex++;
        } else {
            globalIndex = 0;
        }

    }
    wrongLettersCoords.forEach((wrongLetter) => {
        if ((Math.abs(spriteCoords.x - wrongLetter.x) < collisionDistance) && ((Math.abs(spriteCoords.y - wrongLetter.y)) < collisionDistance)) {
            gameState.score--;
            spriteCoords.x -= tileSize;
            spriteCoords.y -= tileSize;
        }
    })

    // if (wrongLettersCoords.some(element => Math.abs((element.x - spriteCoords.x) < 0) && Math.abs((element.y - spriteCoords.y) < 0))) {}




    wrongLetterDraw();
    correctLetterDraw();

    requestAnimationFrame(animationLoop)
}

function changeSpeed({ detail }) {
    gameState.speed = detail.value;
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
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function correctLetterGenerator() {
    // Note this always needs calling after the wrong letter have been generated.
    // Otherwise the comparison is pointless.
    let tempX = (randomInteger(1, (cols - 1)) * tileSize);
    let tempY = (randomInteger(1, (rows - 2)) * tileSize);
    while (wrongLettersCoords.some(element => element.x === tempX && element.y === tempY)) {
        tempX = (randomInteger(1, (cols - 1)) * tileSize);
        tempY = (randomInteger(1, (rows - 2)) * tileSize);
    }
    correctLetterCoords.x = tempX;
    correctLetterCoords.y = tempY;
}
function correctLetterDraw() {
    canvasContext.value.fillStyle = 'blue';
    canvasContext.value.font = `bold ${fontSize} Arial`;
    canvasContext.value.textBaseline = "top";
    canvasContext.value.fillText(correctLetters[globalIndex], correctLetterCoords.x, correctLetterCoords.y);
}

function wrongLetterGenerator() {
    for (let i = 0; i < wrongLettersCoords.length; i++) {
        let tempX = (randomInteger(1, (cols - 1)) * tileSize);
        let tempY = (randomInteger(1, (rows - 2)) * tileSize);
        while (wrongLettersCoords.some(element => element.x === tempX && element.y === tempY)) {
            tempX = (randomInteger(1, (cols - 1)) * tileSize);
            tempY = (randomInteger(1, (rows - 2)) * tileSize);
        }
        if (i < 10) {
            wrongLettersCoords[i].x = tempX;
            wrongLettersCoords[i].y = tempY;
        }
    }
}


// for (let i = 0; i < wrongLettersCoords.length; i++) {
//     // The minus brings them in from the edge.
//     wrongLettersCoords[i].x = (randomInteger(1, (cols - 1)) * tileSize);
//     wrongLettersCoords[i].y = (randomInteger(1, (rows - 2)) * tileSize);
//}


function wrongLetterDraw() {
    canvasContext.value.fillStyle = 'orange';
    canvasContext.value.font = `bold ${fontSize} Arial`
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
}

</script>

<style>
#mainCanvas {
    border: 2px solid gray;
}

#topDiv {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 70%;
}
</style>