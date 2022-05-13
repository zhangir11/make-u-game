import {mapTileSize, Mario, Maps, divka, gravity }
from "./inisialization.js"
import { isLeftDown, isDownDown, isRightDown, isUpDown }
from "./control.js"
let queue = true

const throttle = (f, ms = 0) => {
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
        setState(Mario, 1, 1)
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
        let topline = collidetop(Mario)

        if ((!Mario.Onearth) || (Mario.vy < 0)) { // calculation for jumping and falling with gravity
            let temp = Mario.vy //initial velocity
            Mario.vy += gravity * (thenow - timetoVelocity) //a*dt=current velocity
            Mario.Top += Math.round((thenow - timetoVelocity) * (Mario.vy + temp) / 2) //travelled disatance=dt*(vInit+vCurrent)/2
        } else {
            Mario.vy = 0 //no moving in y axes
        }

        if (Mario.Top >= bottomline) {
            Mario.Top = bottomline
            Mario.Onearth = true
        } else { //if Mario gets lower than limit than Mario will return to the limit
            Mario.Onearth = false
            if (Mario.vy < 0.2 && Mario.vy > 0) {
                Mario.vy = 0.2
            }
        }
        if (Mario.Top <= topline) {
            let temp = Maps[Math.trunc((Mario.Left - divka.Left + (Mario.width>>1)) / mapTileSize)]?.[Math.trunc((topline - 1) / mapTileSize)];
            console.log(temp?.style.content)
            if (temp && temp.style.content=="url(\"./assets/sprites/environment/bonusactive.png\")") {
                temp.style.content = "url(./assets/sprites/environment/bonusinactive.png)"
            }
            Mario.Top = topline
            Mario.vy = 0.2
        }

        if (Mario.Onearth && isUpDown) {
            Mario.vy = -0.7
        }
        if (isDownDown) {

        } else if (isLeftDown) {
            if (Mario.Left > 0) {
                Mario.Left -= Math.round((thenow - timetoVelocity) * 0.2) //simple physics. distance=dt*v
            }
        } else if (isRightDown) {
            //simple physics. distance=dt*v

            if (Mario.Left < 436) {//436 середина экрана. Марио движется до этой линий дальше двигается дивка, в конце опять Марио
                Mario.Left += Math.round((thenow - timetoVelocity) / 5)
            } else if (divka.Left + (Maps.length - 25) * mapTileSize > 0) {
                divka.Left -= Math.round((thenow - timetoVelocity) / 5)
            } else if (Mario.Left < 868) {//900-creature.width
                Mario.Left += Math.round((thenow - timetoVelocity) / 5)
            }
        }
        let backlimit = collideback(Mario)
        let frontlimit = collidefront(Mario)

        //ОТкатываем внедрение в обьект
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
//коллайды возвращает границы Куда может упасть либо передвинется Марио 
function collidetop(creature) {
    let fstblocY = Math.trunc((creature.Top) / 36)

    let fstblocX = Math.trunc((creature.Left - divka.Left + 1) / mapTileSize)
    let sndblocX = Math.trunc((creature.Left - divka.Left + creature.width-2) / mapTileSize)
    for (fstblocY; fstblocY >= 0; fstblocY--) {
        if ((Maps[fstblocX][fstblocY] != undefined) || (Maps[sndblocX][fstblocY] != undefined)) {
            return fstblocY * mapTileSize + mapTileSize
        }
    }
    return 0
} //

function collidefront(creature) {
    let fstblocX = Math.trunc((creature.Left - divka.Left + creature.width-4) / mapTileSize)

    let fstblocY = Math.trunc((creature.Top + creature.height-1) / mapTileSize)
    let sndblocY = Math.trunc((creature.Top) / mapTileSize)
    let thrdblocY = Math.trunc((creature.Top + (creature.height>>1)) / mapTileSize)
    for (fstblocX; fstblocX < Maps.length; fstblocX++) {
        if ((Maps[fstblocX][sndblocY] != undefined) || (Maps[fstblocX][fstblocY] != undefined) || (Maps[fstblocX][thrdblocY] != undefined)) {
            return fstblocX * mapTileSize + divka.Left - creature.width
        }
    }
    return Maps.length*mapTileSize-creature.width
}

function collideback(creature) {
    let fstblocX = Math.trunc((creature.Left - divka.Left - 1) / mapTileSize)

    let fstblocY = Math.trunc((creature.Top + creature.height-1) / mapTileSize)
    let sndblocY = Math.trunc((creature.Top) / mapTileSize)
    let thrdblocY = Math.trunc((creature.Top + (creature.height>>1)) / mapTileSize)

    for (fstblocX; fstblocX >= 0; fstblocX--) {
        if ((Maps[fstblocX][sndblocY] != undefined) || (Maps[fstblocX][fstblocY] != undefined) || (Maps[fstblocX][thrdblocY] != undefined)) {
            return fstblocX * mapTileSize + divka.Left + mapTileSize
        }
    }
    return 0
}

function collidebottom(creature) {
    let fstblocX = Math.trunc((creature.Left - divka.Left + 1) / mapTileSize)
    let sndblocX = Math.trunc((creature.Left - divka.Left + creature.width-2) / mapTileSize)

    let fstblocY = Math.trunc((creature.Top + creature.height+1) / mapTileSize)
    for (fstblocY; fstblocY < Maps[0].length; fstblocY++)
        if ((Maps[fstblocX][fstblocY] != undefined) || (Maps[sndblocX][fstblocY] != undefined)) {
            return fstblocY * mapTileSize - creature.height
        }
    return Maps[0].length*mapTileSize
}

addEventListener('load', () => setInterval(foreverEver, 8))