import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';


export const useMainStore = defineStore('mainStore', () => {
    // Directions and movement
    const isMoving = ref(true);
    const currentDirection = ref(null);
    const direction = reactive({
        left: 0,
        right: 1,
        up: 2,
        down: 3,
    })

    const speed = ref(1)
    const showSettings = ref(false);
    const showLogin = ref(false);

    const doubleCount = computed(() => count.value * 2)
    function increment() {
        count.value++
    }

    return {  currentDirection, direction, doubleCount, showLogin, showSettings, speed, increment, isMoving, }

})





