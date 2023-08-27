<template>
    <div>
        <canvas id="mainCanvas"></canvas>
        <div>
            <ion-button>Left</ion-button>
            <ion-button>Right</ion-button>
            <ion-button>Up</ion-button>
            <ion-button>Down</ion-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';

const Direction = {
    Left: 0,
    Right: 1,
    Up: 2,
    Down: 3
}

function Alphabet(canvasContext) {
    this.speed = 10;
    this.letter = {};

    this.init = function () {
        canvasContext.font = '20px Comic Sans MS';
        this.tail = [{}];
        this.direction = Direction.Right;
        this.score = 0;
        this.gameOver = false;
        this.willEat = false;
    }

    this.startGame = () => {
        this.init();
        //this.move();
        //this.letterGenerator();
    }

    this.setDirection = (direction) => {
        this.direction = direction;
    }

    this.draw = () => {
        console.log(canvasContext)
        canvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        //draw score
        canvasContext.fillStyle = 'black';
        canvasContext.fillText('Score: ' + this.score, 10, 25);

    }










}



onMounted(() => {
    const mainCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('mainCanvas');
    const canvasContext = mainCanvas.getContext('2d');

    let game = new Alphabet(canvasContext);
    game.startGame();
    game.draw();


});





</script>

<style>
#mainCanvas {
    width: 300px;
    height: 500px;
    border: 2px solid gray;
}
</style>