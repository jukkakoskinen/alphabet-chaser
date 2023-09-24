<template>
    <div id="divMain">
        <div id="divTop">
            <ion-range @ionChange="changeSpeed" :pin="true" :ticks="true" :snaps="true" :min="1" :max="8"
                label="Speed! "></ion-range>
        </div>
        <div id="divCanvas">
            <canvas id="mainCanvas"></canvas>
        </div>
        <div id="divButtons">
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
let wrongLetters = 'abcdfgijkmnpqrstuvwxyz';
let colorCorrectLetters = 'blue';
let colorWrongLetters = 'orange';
// Board size
const tileSize = 40;
const rows = 13;
const cols = 9;
const fontSize = {
    large: tileSize + 10 + 'px',
    medium: tileSize + 'px',
    small: tileSize - 10 + 'px',
}
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
    y: tileSize,
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
    movement()

    drawBackground();
    drawWord();
    drawScore();
    drawLevel();
    drawSprite();

    collisonWithCorrectLetter()
    collisonWithWrongLetter()

    drawWrongLetter();
    drawCorrectLetter();

    requestAnimationFrame(animationLoop)
}

function movement(){
    if (isMoving) {
        if (currentDirection === direction.up && spriteCoords.y > tileSize) {
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
}

function collisonWithCorrectLetter(){
     // Detect sprite hits the correct letter.
    // const collisionDistance = 0;
    if ((spriteCoords.row === correctLetterCoords.row) && (spriteCoords.col === correctLetterCoords.col)) {
        stopMoving();
        score++;
        // TODO fix this loop bug, it shouldn't need minus 1.
        // I think it is just the order in which it's called.
        if (globalIndex < correctLetters.length - 1) {
            globalIndex++;
        } else {
            globalIndex = 0;
        }
        if (score === 3) {
            level = 2;
            globalIndex = 0;
            colorCorrectLetters = 'orange';
        }
        // create new coords for wrong letters
        wrongLetterGenerator();
        // create new coords for correct letter
        correctLetterGenerator();
    }
}

function collisonWithWrongLetter(){
     // WrongLetter collisions.
     if (wrongLettersCoords.some((wrongLetter) => wrongLetter.row === spriteCoords.row && wrongLetter.col === spriteCoords.col)) {
        score--;
        switch (currentDirection) {
            case direction.left:
                spriteCoords.x += tileSize / 2;
                break;
            case direction.right:
                spriteCoords.x -= tileSize / 2;
                break;
            case direction.up:
                spriteCoords.y += tileSize / 2;
                break;
            case direction.down:
                spriteCoords.y -= tileSize / 2;
                break;
        }
        stopMoving();
        //TODO check this works...
        levelDown();
    }
}

function changeSpeed({ detail }) {
    speed = detail.value;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function correctLetterGenerator() {
    // Note this always needs calling after the wrong letter have been generated.
    // Otherwise the comparison is pointless.
    let tempX = (randomInteger(2, (cols - 1)) * tileSize);
    let tempY = (randomInteger(2, (rows - 2)) * tileSize);
    while (wrongLettersCoords.some(element => element.x === tempX && element.y === tempY)) {
        tempX = (randomInteger(2, (cols - 1)) * tileSize);
        tempY = (randomInteger(2, (rows - 2)) * tileSize);
    }
    correctLetterCoords.x = tempX;
    correctLetterCoords.y = tempY;
}

function wrongLetterGenerator() {
    for (let i = 0; i < wrongLettersCoords.length; i++) {
        let tempX = (randomInteger(2, (cols - 1)) * tileSize);
        let tempY = (randomInteger(2, (rows - 2)) * tileSize);
        while (wrongLettersCoords.some(element => element.x === tempX && element.y === tempY)) {
            tempX = (randomInteger(2, (cols - 1)) * tileSize);
            tempY = (randomInteger(2, (rows - 2)) * tileSize);
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
    // for (let i = 0; i < rows; i++){
    //     canvasContext.value.strokeRect(0, tileSize * i, tileSize, tileSize);

    // }
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
    canvasContext.value.font = `${fontSize.medium} Comic Sans MS`
    const wordPadding = 3;
    canvasContext.value.textBaseline = "top"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText(correctLetters, (cols - 6) * tileSize - wordPadding, wordPadding);
    canvasContext.value.fillStyle = 'red';
    canvasContext.value.fillText(correctLetters.slice(0, globalIndex), (cols - 6) * tileSize - wordPadding, wordPadding);
}
function drawScore() {
    canvasContext.value.fillStyle = 'black';
    canvasContext.value.font = `${fontSize.small} Arial`
    const scorePadding = 3;
    canvasContext.value.textBaseline = "bottom"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText('Score: ' + score, scorePadding, (rows * tileSize) - scorePadding);
}
function drawLevel() {
    canvasContext.value.fillStyle = 'black';
    canvasContext.value.font = `${fontSize.small} Arial`
    const levelPadding = 3;
    canvasContext.value.textBaseline = "bottom"; //note this is different from the default 'alphabetic' baseline.
    canvasContext.value.fillText('Level: ' + level, ((cols - 3) * tileSize - levelPadding), (rows * tileSize) - levelPadding);
}
function drawCorrectLetter() {
    const alignment = 8;
    const radii = 5;
    canvasContext.value.fillStyle = colorCorrectLetters;
    canvasContext.value.strokeStyle = colorCorrectLetters;
    canvasContext.value.font = `bold ${fontSize.medium - 4} Arial`;
    canvasContext.value.textBaseline = "top";
    canvasContext.value.fillText(correctLetters[globalIndex], correctLetterCoords.x + alignment, correctLetterCoords.y);
    canvasContext.value.beginPath();
    canvasContext.value.roundRect(correctLetterCoords.x, correctLetterCoords.y, tileSize - 4, tileSize - 4, radii);
    canvasContext.value.stroke();
}
function drawWrongLetter() {
    const alignment = 10;
    const radii = 5;
    canvasContext.value.fillStyle = colorWrongLetters;
    canvasContext.value.strokeStyle = colorWrongLetters;
    canvasContext.value.font = `bold ${fontSize.medium - 4} monospace`
    canvasContext.value.textBaseline = "top";
    for (let i = 0; i <= 10 - 1; i++) {
        canvasContext.value.fillText(wrongLetters[i], wrongLettersCoords[i].x + alignment, wrongLettersCoords[i].y);
        canvasContext.value.beginPath();
        canvasContext.value.roundRect(wrongLettersCoords[i].x, wrongLettersCoords[i].y, tileSize - 4, tileSize - 4, radii);
        canvasContext.value.stroke();
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

function levelDown() {
    if (score < 3) {
        level = 1;
        colorCorrectLetters = 'blue';
        globalIndex = 0;
    }
}

</script>

<style>
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