import { Mario, Maps, divka, gravity }
from "./inisialization.js"
import { isLeftDown, isDownDown, isRightDown, isUpDown }
from "./control.js"
let queue = true

const throttle = (f, ms = 0) => {
        console.log("hehe")
        let TimeNow = Date.now()
        return function() {
            let timee = Date.now()
            if (timee - TimeNow - ms >= 0) {
                TimeNow = timee
                f(...arguments)
            }
        }
    } //Тротлинг не дает одной функций(f) повторятся в заданном интервале(ms), например рисование выполняется только 60 раз в секунду. Интервал равно приблизительно 16 

//changes sprite of Mario 

function setState(creature, start, end) { //start с какого спрайта начинается анимация end на каком спрайте закончивается анимация
    if (start == creature.State && start == end) {
        return
    }
    creature.Sprites[creature.State].style.visibility = "hidden" //текущий спрайт становится невидимым
    if (creature.State >= start && creature.State < end) {
        creature.State++
    } else {
        creature.State = start
    }
    creature.Sprites[creature.State].style.visibility = "visible" //след спрайт становится видимым
} //new One в итоге создается анимация

//game cycle



let MarioSetSate = throttle(setState, 100)
    //new one

function cycle() { //цикл анимаций тут нельзя делать вычислений. Пока сырой 
    if (!Mario.Onearth) {
        divka.Body.style.left = divka.Left + "px"
        Mario.Body.style.left = Mario.Left + "px"
        Mario.Body.style.top = Mario.Top + "px"
        return
    } //когда на воздухе марио не меняет позу
    if (isUpDown) {
        setState(Mario, 1, 1)
    } else if (isDownDown) {
        setState(Mario, 8, 8)
    } else if (isLeftDown) { //-> pressed
        MarioSetSate(Mario, 2, 7)
        if (!Mario.looksleft) {
            Mario.looksleft = true
            Mario.Body.style.transform = "scaleX(-1)"
        }
    } else if (isRightDown) { //<- pressed
        MarioSetSate(Mario, 2, 7)
        if (Mario.looksleft) {
            Mario.Body.style.transform = "scaleX(1)"
            Mario.looksleft = false
        }
    } else {
        setState(Mario, 0, 0)
    }
    divka.Body.style.left = divka.Left + "px"
    Mario.Body.style.left = Mario.Left + "px"
    Mario.Body.style.top = Mario.Top + "px"
}

let animateForever = throttle(window.requestAnimationFrame, 16) //controlling fps by throttling requestAnimationFrame 

let timetoVelocity = Date.now() //it is t1 or initial t. Needed for physics 

function foreverEver() { //game function
    if (queue) {
        queue = false
        let thenow = Date.now() //it is t2 or now. Needed for physics 
        let bottomline = collidebottom(Mario) //take bottom limit
        let backlimit = collideback(Mario)
        let frontlimit = collidefront(Mario)
        if (bottomline < 5000) { //if bottom limit is low than 5000 that means there block under Mario
            Mario.Onearth = true
        } else {
            Mario.Onearth = false
        }

        if ((!Mario.Onearth) || (Mario.vy < 0)) { // calculation for jumping and falling with gravity
            let temp = Mario.vy //initial velocity
            Mario.vy += gravity * (thenow - timetoVelocity) //a*dt=current velocity
            Mario.Top += Math.round((thenow - timetoVelocity) * (Mario.vy + temp) / 2) //travelled disatance=dt*(vInit+vCurrent)/2
        } else {
            Mario.vy = 0 //no moving in y axes
        }

        if (Mario.Top >= bottomline) {
            Mario.Top = bottomline
        } //if Mario gets lower than limit than Mario will return to the limit

        if (Mario.Onearth && isUpDown) {
            Mario.vy = -0.5
        }
        if (isDownDown) {

        } else if (isLeftDown) {
            if (Mario.Left > 0) {
                Mario.Left -= Math.round((thenow - timetoVelocity) * 0.2) //simple physics. distance=dt*v
            }
        } else if (isRightDown) {
            if (Mario.Left < 436) {
                Mario.Left += Math.round((thenow - timetoVelocity) / 5)
            } else if (divka.Left + (Maps.length - 25) * 36 > 0) {
                divka.Left -= Math.round((thenow - timetoVelocity) / 5)
            } else if (Mario.Left < 868) {
                Mario.Left += Math.round((thenow - timetoVelocity) / 5)
            }
        }

        //
        if (Mario.Left < backlimit) {
            Mario.Left = backlimit
        }
        if (Mario.Left > frontlimit) {
            Mario.Left = frontlimit
        }
        timetoVelocity = thenow
        queue = true
    }
    animateForever(cycle)
}

// function collidetop(creature) {
//     let fstblocX = (creature.Left) / 36
//     let fstblocY = (creature.Top) / 36
//     let sndblocX = fstblocX + 1
//     if ((Maps[fstblocX][fstblocY] != undefined) || (Maps[sndblocX][fstblocY] != undefined)) {
//         creature.Top = fstblocY * 36 + 72
// console.log("here2")
// true
//         return true
//     }
//     let sndblocY = fstblocY - 1
//     if (((Maps[sndblocX][sndblocY] != undefined) || (Maps[sndblocX][sndblocY] != undefined)) && (creature.Top <= sndblocY * 36 + 72)) {
//         creature.Top = sndblocY * 36 + 72
//         return true
//     }
//     return false
// }under development

function collidefront(creature) {
    let fstblocX = Math.floor((creature.Left - divka.Left + 32) / 36)

    let fstblocY = Math.floor((creature.Top + 63) / 36)
    let sndblocY = Math.floor((creature.Top + 1) / 36)
    let thrdblocY = Math.floor((creature.Top + 35) / 36)

    if ((Maps[fstblocX][sndblocY] != undefined) || (Maps[fstblocX][fstblocY] != undefined) || (Maps[fstblocX][thrdblocY] != undefined)) {
        console.log(fstblocX * 36 + divka.Left - 32, "front")
        return fstblocX * 36 + divka.Left - 32
    }
    if (((Maps[fstblocX][fstblocY] != undefined) || (Maps[fstblocX][sndblocY] != undefined) || (Maps[fstblocX][thrdblocY] != undefined)) && (creature.Left + divka.Left - 4 >= fstblocX * 36)) {
        console.log(fstblocX * 36 + divka.Left - 32, "front")
        return fstblocX * 36 + divka.Left - 32
    }
    return 867
}

function collideback(creature) {
    let fstblocX = Math.floor((creature.Left - divka.Left) / 36)

    let fstblocY = Math.floor((creature.Top + 63) / 36)
    let sndblocY = Math.floor((creature.Top + 1) / 36)
    let thrdblocY = Math.floor((creature.Top + 35) / 36)

    if ((Maps[fstblocX][sndblocY] != undefined) || (Maps[fstblocX][fstblocY] != undefined) || (Maps[fstblocX][thrdblocY] != undefined)) {
        console.log(fstblocX * 36 + divka.Left + 36, "back")
        return fstblocX * 36 + divka.Left + 36
    }
    if (((Maps[fstblocX][fstblocY] != undefined) || (Maps[fstblocX][sndblocY] != undefined) || (Maps[fstblocX][thrdblocY] != undefined)) && (creature.Left + divka.Left <= fstblocX * 36)) {
        console.log(fstblocX * 36 + divka.Left + 36, "back")
        return fstblocX * 36 + divka.Left + 36
    }
    return 0
}

function collidebottom(creature) {
    let fstblocX = Math.floor((creature.Left - divka.Left) / 36)
    let sndblocX = Math.floor((creature.Left - divka.Left + 31) / 36)

    let fstblocY = Math.floor((creature.Top + 64) / 36)
    if ((Maps[fstblocX][fstblocY] != undefined) || (Maps[sndblocX][fstblocY] != undefined)) {
        return creature.Top = fstblocY * 36 - 64
    }
    if (((Maps[sndblocX][fstblocY] != undefined) || (Maps[sndblocX][fstblocY] != undefined)) && (creature.Top + 28 >= fstblocY * 36)) {
        return creature.Top = fstblocY * 36 - 64
    }
    return 5000
}
addEventListener('load', () => setInterval(foreverEver, 8))