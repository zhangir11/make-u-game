'use strict'
export let isUpDown = false
export let isDownDown = false
export let isLeftDown = false
export let isRightDown = false

document.addEventListener('keydown', (e) => {
    if (e.code === "ArrowUp") {
        isUpDown = true
    } else if (e.code === "ArrowDown") {
        isDownDown = true
    } else if (e.code === "ArrowLeft") {
        isLeftDown = true
    } else if (e.code === "ArrowRight") {
        isRightDown = true
    }

});

document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowUp") {
        isUpDown = false
    } else if (e.code === "ArrowDown") {
        isDownDown = false
    } else if (e.code === "ArrowLeft") {
        isLeftDown = false
    } else if (e.code === "ArrowRight") {
        isRightDown = false
    }
});