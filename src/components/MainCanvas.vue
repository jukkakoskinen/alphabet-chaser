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
let correctLetters = '';
let wrongLetters = '';
let i = -1;
let snakeX = 0;
let snakeY = 0;
let letterX = 0;
let letterY = 0;
let wrongLetterX = 0;
let wrongLetterY = 0;
let isMoving = true;
let direction = {
    Left: 0,
    Right: 1,
    Up: 2,
    Down: 3,
}
let currentDirection = null;

const gameState = {
    speed: 2,
    letterChain: {},
    tailCoords: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 }, { x: 30, y: 0 }, { x: 40, y: 0 }],
    direction: direction.Right,
    score: -1,
    gameOver: false,
    willEat: false,
}

onMounted(() => {
    // Add a global event listener for keydown
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", stopMoving);

    mainCanvas.value = document.getElementById('mainCanvas');
    canvasContext.value = mainCanvas.value.getContext('2d');

    draw();

    /* bgImage.value = new Image();
    bgImage.value.src = '../src/assets/home.jpg'
    
    bgImage.value.onload = function () {
        canvasContext.value.drawImage(bgImage.value, 0, 0, 300, 500);
    } */
});
/* beforeDestroy() {
        // Remove the event listener when the component is destroyed
        window.removeEventListener("keydown", this.handleKeyPress);
    }, */

function calculateLetters(event) {
    let words = event.target.value;

    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let wordsToLearn = [words];
    console.log('wordsToLearn ' + wordsToLearn);
    let indexer = 0;
    correctLetters = wordsToLearn[indexer].split('');
    console.log('correctLetters ' + correctLetters);

    for (let j = 0; j < correctLetters.length; j++) {

        wrongLetters = alphabet.replace(correctLetters[j], '');
        alphabet = wrongLetters;
        console.log('alphabet replaced ' + wrongLetters);
        console.log('correctLetters[j] ' + correctLetters[j]);
    }

    console.log('OUT alphabet replaced ' + wrongLetters);

}


function draw() {
    if (isMoving) {
        //console.log(way)
        if (currentDirection === direction.Up && snakeY > 0) {
            snakeY -= gameState.speed;
        }
        else if (currentDirection === direction.Down && snakeY < mainCanvas.value.height - 45) {
            snakeY += gameState.speed;
        }
        else if (currentDirection === direction.Left && snakeX > 0) {
            snakeX -= gameState.speed;
        }
        else if (currentDirection === direction.Right && snakeX < mainCanvas.value.width - 15) {
            snakeX += gameState.speed;
        }

        //draw the background
        canvasContext.value.fillStyle = 'green';
        canvasContext.value.fillRect(0, 0, 300, 500);
        //canvasContext.value.drawImage(bgImage.value, 0, 0, 300, 500);

        //draw score
        canvasContext.value.fillStyle = 'black';
        canvasContext.value.font = "24px Arial"
        canvasContext.value.fillText('Score: ' + gameState.score, 5, 490);

        //draw snake
        canvasContext.value.fillStyle = 'red';
        canvasContext.value.fillRect(snakeX, snakeY, 15, 15);

        if ((Math.abs(snakeX - letterX) <= 8) && (Math.abs(snakeY - letterY) <= 15)) {
            gameState.score++;
            //draw correct letter
            letterGenerator();
            canvasContext.value.fillStyle = 'blue';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(correctLetters[i], letterX, letterY);
            //draw wrong letter
            wrongLetterGenerator();
            canvasContext.value.fillStyle = 'orange';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(wrongLetters[i], wrongLetterX, wrongLetterY);
            wrongLetterGenerator();
            canvasContext.value.fillStyle = 'orange';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(wrongLetters[i], wrongLetterX + 15, wrongLetterY - 25);
            wrongLetterGenerator();
            canvasContext.value.fillStyle = 'orange';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(wrongLetters[i], wrongLetterX + 30, wrongLetterY + 45);
            wrongLetterGenerator();
            canvasContext.value.fillStyle = 'orange';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(wrongLetters[i], wrongLetterX + 50, wrongLetterY - 37);

            if (i <= correctLetters.length - 2) {
                i++;
            } else {
                i = 0;
            }

        } else {
            //draw correct letters
            canvasContext.value.fillStyle = 'blue';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(correctLetters[i], letterX, letterY);
            //draw wrong letters
            canvasContext.value.fillStyle = 'orange';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(wrongLetters[i], wrongLetterX + 15, wrongLetterY - 25);
            //draw wrong letters
            canvasContext.value.fillStyle = 'orange';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(wrongLetters[i + 1], wrongLetterX + 30, wrongLetterY + 45);;
            //draw wrong letters
            canvasContext.value.fillStyle = 'orange';
            canvasContext.value.font = "bold 36px Arial"
            canvasContext.value.fillText(wrongLetters[i + 2], wrongLetterX + 50, wrongLetterY - 37);;
        }






        requestAnimationFrame(draw);
    }
}


function Left() {
    isMoving = true
    currentDirection = direction.Left
    draw();
}
function Right() {
    isMoving = true
    currentDirection = direction.Right
    draw();
}
function Up() {
    isMoving = true
    currentDirection = direction.Up
    draw();
}
function Down() {
    isMoving = true
    currentDirection = direction.Down
    draw();
}

function stopMoving() {
    isMoving = false;
}

function letterGenerator() {
    letterX = Math.floor(Math.random() * 280 + 10);
    letterY = Math.floor(Math.random() * 450 + 20);
    //console.log(letterX)
    //console.log(letterY)
}
function wrongLetterGenerator() {
    wrongLetterX = Math.floor(Math.random() * 280 + 10);
    wrongLetterY = Math.floor(Math.random() * 450 + 20);
    //console.log(letterX)
    //console.log(letterY)
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

function setDirection(gameState, newDirection) {
    gameState.direction = newDirection;
}





function startGame() {
    init();
    move();
    letterGenerator();
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