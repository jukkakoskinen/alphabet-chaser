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
            <ion-button @mousedown="left" @mouseup="stopMoving" @touchstart="left" @touchend="stopMoving">Left</ion-button>
            <ion-button @mousedown="right" @mouseup="stopMoving" @touchstart="right"
                @touchend="stopMoving">Right</ion-button>
            <ion-button @mousedown="up" @mouseup="stopMoving" @touchstart="up" @touchend="stopMoving">Up</ion-button>
            <ion-button @mousedown="down" @mouseup="stopMoving" @touchstart="down" @touchend="stopMoving">Down</ion-button>
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

//TODO 
// refactor loops using cleaner loops foreach for in for of etc
// refactor using spread ... for array assignments. 

// Canvas
const mainCanvas = ref(null);
const canvasContext = ref(null)
//let bgImage = ref(null);
// Indexes
let globalIndex = 0;
// Letters
let correctLetters = 'hello';
let wrongLetters = 'abcdfgijkmnpqrstuvwxyz'.split('');
// Board size
const tileSize = 40;
const rows = 15;
const cols = 9;
const fontSize = '30px'
const largeFontSize = '60px'
// Directions and movement
let speed = 1;
let isMoving = true;
let currentDirection = undefined;
let direction = {
    left: 0,
    right: 1,
    up: 2,
    down: 3,
}
// Game State
let score = 0;
let level = 1;
let gameOver = false;
// Coordinates
let spriteCoords = {
    x: 0,
    y: 0,
    get row() { return Math.floor((this.x + (tileSize / 2)) / tileSize) },
    get col() { return Math.floor((this.y + (tileSize / 2)) / tileSize) }
};
let correctLetterCoords = {
    x: 100,
    y: 100,
    get row() { return Math.floor((this.x + (tileSize / 2)) / tileSize) },
    get col() { return Math.floor((this.y + (tileSize / 2)) / tileSize) }
};
let wrongLettersCoords = [
    { x: tileSize, y: tileSize, get row() { return Math.floor(this.x / tileSize) }, get col() { return Math.floor(this.y / tileSize) } },
];

onMounted(() => {
    mainCanvas.value = document.getElementById('mainCanvas');
    mainCanvas.value.width = cols * tileSize;
    mainCanvas.value.height = rows * tileSize;
    canvasContext.value = mainCanvas.value.getContext('2d');

    // Generate the initial wrong letters
    for (let i = 0; i < 11; i++) {
        wrongLettersCoords.push({ x: tileSize * i, y: tileSize * i, get row() { return Math.floor(this.x / tileSize) }, get col() { return Math.floor(this.y / tileSize) } });
    }

    wrongLetterGenerator();
    correctLetterGenerator();

    animationLoop();
});

function animationLoop() {
    if (isMoving) {
        if (currentDirection === direction.up && spriteCoords.y > 0) {
            spriteCoords.y -= speed;
        }
        else if (currentDirection === direction.down && spriteCoords.y < tileSize * (rows - 2)) {
            spriteCoords.y += speed;
        }
        else if (currentDirection === direction.left && spriteCoords.x > 0) {
            spriteCoords.x -= speed;
        }
        else if (currentDirection === direction.right && spriteCoords.x < tileSize * (cols - 1)) {
            spriteCoords.x += speed;
        }
    }

    drawBackground();
    drawWord();
    drawScore();
    drawLevel();
    drawSprite();

    // Detect sprite hits the correct letter.
    // const collisionDistance = 0;
    if ((spriteCoords.row === correctLetterCoords.row) && (spriteCoords.col === correctLetterCoords.col)) {
        score++;
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

    // WrongLetter collisions.
    if (wrongLettersCoords.some((wrongLetter) => wrongLetter.row === spriteCoords.row && wrongLetter.col === spriteCoords.col)) {
        score--;
        switch (currentDirection) {
            case direction.left:
                spriteCoords.x += tileSize;
                break;
            case direction.right:
                spriteCoords.x -= tileSize;
                break;
            case direction.up:
                spriteCoords.y += tileSize;
                break;
            case direction.down:
                spriteCoords.y -= tileSize;
                break;
        }

    }



    // wrongLettersCoords.forEach((wrongLetter) => {
    //     if ((Math.abs(spriteCoords.x - wrongLetter.x) < collisionDistance) && ((Math.abs(spriteCoords.y - wrongLetter.y)) < collisionDistance)) {
    //         score--;
    //         spriteCoords.x -= tileSize;
    //         spriteCoords.y -= tileSize;
    //     }
    // })

    wrongLetterDraw();
    correctLetterDraw();

    requestAnimationFrame(animationLoop)
}

function changeSpeed({ detail }) {
    speed = detail.value;
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

//Drawing functions
function drawBackground() {
    canvasContext.value.fillStyle = 'green';
    canvasContext.value.fillRect(0, 0, cols * tileSize, rows * tileSize);
    //canvasContext.value.drawImage(bgImage.value, 0, 0, 300, 500);
}
function drawSprite() {
    canvasContext.value.fillStyle = 'red';
    canvasContext.value.fillRect(spriteCoords.x, spriteCoords.y, tileSize, tileSize);
    canvasContext.value.fillStyle = 'blue';
    canvasContext.value.fillRect(spriteCoords.x + (tileSize / 2) - 5, spriteCoords.y + (tileSize / 2) - 5, 10, 10);
}
function drawWord() {
    canvasContext.value.fillStyle = 'black';
    canvasContext.value.font = `${largeFontSize} Comic Sans MS`
    const wordPadding = 7;
    canvasContext.value.textBaseline = "top"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText(correctLetters, (cols - 6) * tileSize - wordPadding, wordPadding);
    canvasContext.value.fillStyle = 'red';
    canvasContext.value.fillText(correctLetters.slice(0, globalIndex), (cols - 5) * tileSize - wordPadding, wordPadding);
}
function drawScore() {
    canvasContext.value.fillStyle = 'black';
    canvasContext.value.font = `${fontSize} Arial`
    const scorePadding = 7;
    canvasContext.value.textBaseline = "bottom"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText('Score: ' + score, scorePadding, (rows * tileSize) - scorePadding);
}
function drawLevel() {
    canvasContext.value.fillStyle = 'black';
    canvasContext.value.font = `${fontSize} Arial`
    const levelPadding = 7;
    canvasContext.value.textBaseline = "bottom"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText('Level: ' + level, ((cols - 3) * tileSize - levelPadding), (rows * tileSize) - levelPadding);
}
function correctLetterDraw() {
    canvasContext.value.fillStyle = 'blue';
    canvasContext.value.font = `bold ${fontSize} Arial`;
    canvasContext.value.textBaseline = "top";
    canvasContext.value.fillText(correctLetters[globalIndex], correctLetterCoords.x, correctLetterCoords.y);

    canvasContext.value.fillStyle = 'yellow';
    canvasContext.value.font = `bold 10px Arial`;
    canvasContext.value.textBaseline = "top";
    canvasContext.value.fillText(correctLetters[globalIndex], correctLetterCoords.x, correctLetterCoords.y);
}
function wrongLetterDraw() {
    canvasContext.value.fillStyle = 'orange';
    canvasContext.value.font = `bold ${fontSize} Arial`
    canvasContext.value.textBaseline = "top";
    for (let i = 0; i <= 10 - 1; i++) {
        canvasContext.value.fillText(wrongLetters[i], wrongLettersCoords[i].x, wrongLettersCoords[i].y);
    }
}

function left() {
    isMoving = true
    currentDirection = direction.left
}
function right() {
    isMoving = true
    currentDirection = direction.right
}
function up() {
    isMoving = true
    currentDirection = direction.up
}
function down() {
    isMoving = true
    currentDirection = direction.down
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