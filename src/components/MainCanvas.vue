<template>
    <div>
        <div id="mainInput">
            <ion-input @focusout="calculateLetters" :clear-input="true" label="Please Enter Words: "></ion-input>
        </div>
        <div>
            <canvas id="mainCanvas" width="300" height="500"></canvas>
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
import { IonButton, IonInput } from '@ionic/vue';
import { ref, onMounted } from 'vue';

const mainCanvas = ref(null);
const canvasContext = ref(null)
//let bgImage = ref(null);
let i = -1;
let correctLetters = '';
let wrongLetters = [];
let globalIndex = 0;
let spriteCoords = { x: null, y: null };
let correctLetterCoords = { x: 150, y: 150 };
let wrongLettersCoords = [
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null }];
let isMoving = true;
let direction = {
    left: 0,
    right: 1,
    up: 2,
    down: 3,
}
let currentDirection = null;

const gameState = {
    speed: 2,
    direction: direction.right,
    score: 0,
    gameOver: false,
}

onMounted(() => {
    // Add a global event listener for keydown
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", stopMoving);

    mainCanvas.value = document.getElementById('mainCanvas');
    canvasContext.value = mainCanvas.value.getContext('2d');

    animationLoop();
});

function animationLoop() {
    if (isMoving) {
        if (currentDirection === direction.up && spriteCoords.y > 0) {
            spriteCoords.y -= gameState.speed;
        }
        else if (currentDirection === direction.down && spriteCoords.y < mainCanvas.value.height - 45) {
            spriteCoords.y += gameState.speed;
        }
        else if (currentDirection === direction.left && spriteCoords.x > 0) {
            spriteCoords.x -= gameState.speed;
        }
        else if (currentDirection === direction.right && spriteCoords.x < mainCanvas.value.width - 15) {
            spriteCoords.x += gameState.speed;
        }

        //draw the background
        canvasContext.value.fillStyle = 'green';
        canvasContext.value.fillRect(0, 0, 300, 500);
        //canvasContext.value.drawImage(bgImage.value, 0, 0, 300, 500);

        //draw score
        canvasContext.value.fillStyle = 'black';
        canvasContext.value.font = "24px Arial"
        canvasContext.value.fillText('Score: ' + gameState.score, 5, 490);

        //draw sprite
        canvasContext.value.fillStyle = 'red';
        canvasContext.value.fillRect(spriteCoords.x, spriteCoords.y, 15, 15);

        if ((Math.abs(spriteCoords.x - correctLetterCoords.x) <= 8) && (Math.abs(spriteCoords.y - correctLetterCoords.y) <= 15)) {
            gameState.score++;
            //draw correct letter
            correctLetterGenerator();

            //draw wrong letter
            wrongLetterGenerator();

            console.log('correctLetters ' + correctLetters)
            console.log('correctLetters length ' + correctLetters.length)
            console.log('index ' + globalIndex)

            //TODO fix this loop bug
            //I think it is just the order in which it's called.
            if (globalIndex <= correctLetters.length - 2) {
                globalIndex++;
            } else {
                globalIndex = 0;
            }

        }
        correctLetterDraw();
        wrongLetterDraw()
        requestAnimationFrame(animationLoop);
    }
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

function correctLetterGenerator() {
    correctLetterCoords.x = Math.floor(Math.random() * 280 + 10);
    correctLetterCoords.y = Math.floor(Math.random() * 450 + 20);
}
function correctLetterDraw() {
    canvasContext.value.fillStyle = 'blue';
    canvasContext.value.font = "bold 36px Arial"
    canvasContext.value.fillText(correctLetters[globalIndex], correctLetterCoords.x, correctLetterCoords.y);
}

function wrongLetterGenerator() {
    console.dir(wrongLettersCoords)
    for (let i = 0; i <= wrongLettersCoords.length - 1; i++) {
        wrongLettersCoords[i].x = Math.floor(Math.random() * 280 + 10);
        wrongLettersCoords[i].y = Math.floor(Math.random() * 450 + 20);
    }
    console.dir(wrongLettersCoords)
}
function wrongLetterDraw() {
    canvasContext.value.fillStyle = 'orange';
    canvasContext.value.font = "bold 36px Arial"
    canvasContext.value.fillText(wrongLetters[0], wrongLettersCoords[0].x, wrongLettersCoords[0].y);
    canvasContext.value.fillText(wrongLetters[1], wrongLettersCoords[1].x, wrongLettersCoords[1].y);
    canvasContext.value.fillText(wrongLetters[2], wrongLettersCoords[2].x, wrongLettersCoords[2].y);
    canvasContext.value.fillText(wrongLetters[3], wrongLettersCoords[3].x, wrongLettersCoords[3].y);
    canvasContext.value.fillText(wrongLetters[4], wrongLettersCoords[4].x, wrongLettersCoords[4].y);
    canvasContext.value.fillText(wrongLetters[5], wrongLettersCoords[5].x, wrongLettersCoords[5].y);
    canvasContext.value.fillText(wrongLetters[6], wrongLettersCoords[6].x, wrongLettersCoords[6].y);
    canvasContext.value.fillText(wrongLetters[7], wrongLettersCoords[7].x, wrongLettersCoords[7].y);
    canvasContext.value.fillText(wrongLetters[8], wrongLettersCoords[8].x, wrongLettersCoords[8].y);
    canvasContext.value.fillText(wrongLetters[9], wrongLettersCoords[9].x, wrongLettersCoords[9].y);
}

function handleKeyPress(event) {
    // Check which arrow key was pressed
    if (event.key === "ArrowUp") {
        Up();
    } else if (event.key === "ArrowDown") {
        Down();
    } else if (event.key === "ArrowLeft") {
        Left();
    } else if (event.key === "ArrowRight") {
        Right();
    }
}

function Left() {
    isMoving = true
    currentDirection = direction.left
    animationLoop();
}
function Right() {
    isMoving = true
    currentDirection = direction.right
    animationLoop();
}
function Up() {
    isMoving = true
    currentDirection = direction.up
    animationLoop();
}
function Down() {
    isMoving = true
    currentDirection = direction.down
    animationLoop();
}

function stopMoving() {
    isMoving = false;
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