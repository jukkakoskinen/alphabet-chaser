import { defineStore } from 'pinia';

export const useMainStore = defineStore('mainStore', {
    state: () => ({

        // Directions and movement
        currentDirection: null,
        direction: {
            left: 0,
            right: 1,
            up: 2,
            down: 3,
        },
        isMoving: true,
        showLogin: false,
        showSettings: false,
        speed: 1,
        wordRelated: {
            correctLetters: '',
            currentWordToLearn: 'Deafault Word To Learn',
            mainListOfWords: ['hi', 'bye'],
            wrongLetters: '',
        }  
    }),
    actions: {}
})





