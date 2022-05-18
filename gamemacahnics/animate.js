'use strict'
import { NewSecundomer } from "./secundomer.js"
import { clouds, MapMaking, mapTileSize, Mario, Maps, divka, gravity }
    from "./inisialization.js"
import { isRestartDown, isPauseDown, isLeftDown, isDownDown, isRightDown, isUpDown }
    from "./control.js"
let leftborder = 0
let rightborder = 25
let secundomer = {
    body: document.getElementById("secundomer"),
    mecansm: NewSecundomer(),
}
let MonsterZ = []
let gameoverbody = document.getElementById("gameover")
let scorebody = document.getElementById("score")
let score = 0
let cyclecode = 0
let life = 3
let lifebody = document.getElementById("life")

function throttle(func, ms) {

    let isThrottled = false,
        savedArgs,
        savedThis;

    function wrapper() {

        if (isThrottled) { // (2)
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments); // (1)

        isThrottled = true;

        setTimeout(function () {
            isThrottled = false; // (3)
        }, ms);
    }

    return wrapper;
}//Тротлинг не дает одной функций(f) повторятся в заданном интервале(ms), например рисование выполняется только 60 раз в секунду. Интервал равно приблизительно 16 

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



//new one
let tempSec = 0
let tempTop
function cycle() { //цикл анимаций тут нельзя делать вычислений. Пока сырой
    if (tempTop && tempTop.style.content == "url(\"./assets/sprites/environment/bonusactive.png\")") {
        tempTop.style.content = "url(./assets/sprites/environment/bonusinactive.png)"
        score++
        scorebody.innerHTML = score
    }
    tempSec = secundomer.mecansm.GetTime()
    tempSec = 30000 - tempSec
    if (tempSec < 0) {
        gameover()
    }
    secundomer.body.innerHTML = ((tempSec / 60000) >> 0) + "m " + ((tempSec / 1000) >> 0) % 60 + "s"
    if (!Mario.Onearth) {
        Mario.SetSate(Mario, 1, 1)
    } //когда на воздухе марио не меняет позу
    if (isUpDown) {
        Mario.SetSate(Mario, 1, 1)
    }
    if (isDownDown && Mario.Onearth) {
        Mario.SetSate(Mario, 8, 8)
    } else if (isLeftDown) { //-> pressed
        Mario.Onearth ? Mario.SetSate(Mario, 2, 7) : "";
        if (!Mario.looksleft) {
            Mario.looksleft = true
            Mario.Body.style.transform = "scaleX(-1)"
        }
    } else if (isRightDown) { //<- pressed
        Mario.Onearth ? Mario.SetSate(Mario, 2, 7) : "";
        if (Mario.looksleft) {
            Mario.Body.style.transform = "scaleX(1)"
            Mario.looksleft = false
        }
    } else if (Mario.Onearth) {
        Mario.SetSate(Mario, 0, 0)
    }
    i = 0
    while (i < MonsterZ.length) {
        // 
        if (MonsterZ[i].Left + MonsterZ[i].width > Mario.Left && MonsterZ[i].Left < Mario.Left + Mario.width && MonsterZ[i].Top <= Mario.Top + Mario.height && MonsterZ[i].Top + 12 >= Mario.Top + Mario.height) {
            Mario.vy = -0.4
            setState(MonsterZ[i], 2, 2)
            score++
            MonsterZ[i] = MonsterZ[0]
            MonsterZ = MonsterZ.slice(1)
            scorebody.innerHTML = score
        } else if (MonsterZ[i].Left + MonsterZ[i].width > Mario.Left && MonsterZ[i].Left < Mario.Left + Mario.width && MonsterZ[i].Top <= Mario.Top + Mario.height && MonsterZ[i].Top + MonsterZ[i].width >= Mario.Top + Mario.height) {
            life--
            lifebody.innerHTML = life
            if (life == 0) {
                gameover()
            }
            Mario.Left = -divka.Left
            Mario.Top = 0
            i++
        } else {
            MonsterZ[i].SetState(MonsterZ[i], 0, 1)
            MonsterZ[i].Body.style.left = MonsterZ[i].Left + "px"
            MonsterZ[i].Body.style.top = MonsterZ[i].Top + "px"
            i++
        }
    }
    divka.Body.style.left = divka.Left + "px"
    Mario.Body.style.left = Mario.Left + divka.Left + "px"
    Mario.Body.style.top = Mario.Top + "px"
}

let timetoVelocity = Date.now() //it is t1 or initial t. Needed for physics 
let thenow = 0
let backlimit = 0
let frontlimit = 0
let bottomline = 0
let topline = 0
let tempn = 0
let i = 0

function LaunchContinuePaused() {
    if (isPauseDown) {
        setTimeout(LaunchContinuePaused, 30)
    } else {
        setTimeout(kostyl, 30)
    }
}

function kostyl2() {
    if (!isRestartDown) {
        setTimeout(kostyl2, 30)
    } else {
        restartGame()
    }
}

function gameover() {
    secundomer.mecansm.StopTime()
    clearInterval(cyclecode)
    gameoverbody.style.display = "block"
    kostyl2()
}

function restartGame() {
    if (isRestartDown) {
        setTimeout(restartGame, 30)
    } else {
        location.reload()
    }
}

function kostyl() {
    if (isRestartDown) {
        restartGame()
    } else if (!isPauseDown) {
        setTimeout(kostyl, 30)
    } else {
        ContinuePaused()
    }
}

function ContinuePaused() {
    if (isPauseDown) {
        setTimeout(ContinuePaused, 30)
    } else {
        secundomer.mecansm.Continue()
        timetoVelocity = Date.now()
        cyclecode = setInterval(() => {
            foreverEver()
        }, 16)
    }
}

function foreverEver() { //game function
    if (isPauseDown) {
        clearInterval(cyclecode)
        secundomer.mecansm.StopTime()
        LaunchContinuePaused()
    }
    if (isRestartDown) {
        restartGame()
    }
    thenow = Date.now() //it is t2 or now. Needed for physics
    for (i in MonsterZ) {
        backlimit = collideback(MonsterZ[i])
        frontlimit = collidefront(MonsterZ[i])
        bottomline = collidebottom(MonsterZ[i]) //take bottom limit
        if (MonsterZ[i].Left > 0 && MonsterZ[i].Left > 0 && !MonsterZ[i].directionRight) {
            MonsterZ[i].Left -= Math.round((thenow - timetoVelocity) * 0.07) //simple physics. distance=dt*v
        } else if (MonsterZ[i].Left < mapTileSize * Maps.length - MonsterZ[i].width) {
            MonsterZ[i].Left += Math.round((thenow - timetoVelocity) * 0.07)
        }
        if ((!MonsterZ[i].Onearth) || (MonsterZ[i].vy < 0)) { // calculation for jumping and falling with gravity
            tempn = MonsterZ[i].vy //initial velocity
            MonsterZ[i].vy += gravity * (thenow - timetoVelocity) //a*dt=current velocity
            MonsterZ[i].Top += Math.round((thenow - timetoVelocity) * (MonsterZ[i].vy + tempn) / 2) //travelled disatance=dt*(vInit+vCurrent)/2
        } else {
            MonsterZ[i].vy = 0 //no moving in y axes
        }

        if (MonsterZ[i].Top >= bottomline) {
            MonsterZ[i].Top = bottomline
            MonsterZ[i].Onearth = true
        } else { //if MonsterZ gets lower than limit than MonsterZ will return to the limit
            MonsterZ[i].Onearth = false
            if (MonsterZ[i].vy < 0.2 && MonsterZ[i].vy > 0) {
                MonsterZ[i].vy = 0.2
            }
        }
        if (MonsterZ[i].Left < backlimit) {
            MonsterZ[i].Left = backlimit
            MonsterZ[i].directionRight = true
        }
        if (MonsterZ[i].Left > frontlimit) {
            MonsterZ[i].directionRight = false
            MonsterZ[i].Left = frontlimit
        }
    }
    backlimit = collideback(Mario)
    frontlimit = collidefront(Mario)
    bottomline = collidebottom(Mario) //take bottom limit
    topline = collidetop(Mario)

    if ((!Mario.Onearth) || (Mario.vy < 0)) { // calculation for jumping and falling with gravity
        tempn = Mario.vy //initial velocity
        Mario.vy += gravity * (thenow - timetoVelocity) //a*dt=current velocity
        Mario.Top += Math.round((thenow - timetoVelocity) * (Mario.vy + tempn) / 2) //travelled disatance=dt*(vInit+vCurrent)/2
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
        tempTop = Maps[((Mario.Left + (Mario.width >> 1)) / mapTileSize) >> 0]?.[((topline - 1) / mapTileSize) >> 0];
        Mario.Top = topline
        Mario.vy = 0.2
    }

    if (Mario.Onearth && isUpDown) {
        Mario.vy = -0.7
    }
    if (isDownDown) {

    } else if (isLeftDown) {
        if (Mario.Left > 0 && Mario.Left > -divka.Left) {
            Mario.Left -= Math.round((thenow - timetoVelocity) * 0.17) //simple physics. distance=dt*v
        }
    } else if (isRightDown) {
        //simple physics. distance=dt*v
        if (Mario.Left < mapTileSize * Maps.length - Mario.width) {
            Mario.Left += Math.round((thenow - timetoVelocity) * 0.17)
            if (divka.Left + Mario.Left > 450 && Mario.Left < mapTileSize * Maps.length - 449) {
                divka.Left -= Math.round((thenow - timetoVelocity) * 0.17)
                if (-divka.Left / mapTileSize + 24 > rightborder) {
                    for (i = 0; i < 15; i++) {
                        Maps[rightborder + 1]?.[i] ? divka.Body.appendChild(Maps[rightborder + 1][i]) : "";
                        clouds[rightborder + 1]?.[i] ? divka.Body.appendChild(clouds[rightborder + 1][i]) : "";
                    }
                    rightborder++
                    for (i = 0; i < 15; i++) {
                        Maps[leftborder][i]?.remove()
                        clouds[leftborder][i]?.remove()
                    }
                    leftborder++
                }
            }
        }
    }

    //ОТкатываем внедрение в обьект
    if (Mario.Left < backlimit) {
        Mario.Left = backlimit
    }
    if (Mario.Left > frontlimit) {
        Mario.Left = frontlimit
    }

    if (Mario.Top >= mapTileSize * Maps[0].length) {
        life--
        lifebody.innerHTML = life
        if (life == 0) {
            gameover()
        }
        Mario.Left = -divka.Left
        Mario.Top = 0
        i++
    }
    timetoVelocity = thenow
    window.requestAnimationFrame(cycle)
}

let fstblocY = 0
let fstblocX = 0
let sndblocY = 0
let sndblocX = 0
let thrdblocY = 0

//коллайды возвращает границы Куда может упасть либо передвинется Марио 
function collidetop(creature) {
    fstblocY = ((creature.Top) / 36) >> 0

    fstblocX = ((creature.Left + 1) / mapTileSize) >> 0
    sndblocX = ((creature.Left + creature.width - 2) / mapTileSize) >> 0
    for (fstblocY; fstblocY >= 0; fstblocY--) {
        if ((Maps[fstblocX]?.[fstblocY] != undefined) || (Maps[sndblocX]?.[fstblocY] != undefined)) {
            return fstblocY * mapTileSize + mapTileSize
        }
    }
    return 0
} //

function collidefront(creature) {
    fstblocX = ((creature.Left + creature.width + 4) / mapTileSize) >> 0

    fstblocY = ((creature.Top + creature.height - ((creature.Onearth) ? 1 : 0.)) / mapTileSize) >> 0
    sndblocY = ((creature.Top) / mapTileSize) >> 0
    thrdblocY = ((creature.Top + (creature.height >> 1)) / mapTileSize) >> 0
    for (fstblocX; fstblocX < Maps.length; fstblocX++) {
        if ((Maps[fstblocX]?.[sndblocY] != undefined) || (Maps[fstblocX]?.[fstblocY] != undefined) || (Maps[fstblocX]?.[thrdblocY] != undefined)) {
            return fstblocX * mapTileSize - creature.width
        }
    }
    return Maps.length * mapTileSize - creature.width
}

function collideback(creature) {
    fstblocX = ((creature.Left - 4) / mapTileSize) >> 0

    fstblocY = ((creature.Top + creature.height - ((creature.Onearth) ? 1 : 0.)) / mapTileSize) >> 0
    sndblocY = ((creature.Top) / mapTileSize) >> 0
    thrdblocY = ((creature.Top + (creature.height >> 1)) / mapTileSize) >> 0

    for (fstblocX; fstblocX >= 0; fstblocX--) {
        if ((Maps[fstblocX]?.[sndblocY] != undefined) || (Maps[fstblocX]?.[fstblocY] != undefined) || (Maps[fstblocX]?.[thrdblocY] != undefined)) {
            return fstblocX * mapTileSize + mapTileSize
        }
    }
    return 0
}

function collidebottom(creature) {
    fstblocX = ((creature.Left + 1) / mapTileSize) >> 0
    sndblocX = ((creature.Left + creature.width - 2) / mapTileSize) >> 0

    fstblocY = Math.trunc((creature.Top + creature.height + 1) / mapTileSize)
    for (fstblocY; fstblocY < Maps[0].length; fstblocY++)
        if ((Maps[fstblocX]?.[fstblocY] != undefined) || (Maps[sndblocX]?.[fstblocY] != undefined)) {
            return fstblocY * mapTileSize - creature.height
        }
    return Maps[0].length * mapTileSize
}

addEventListener('load', () => {
    MapMaking(MonsterZ)
    Mario.SetSate = throttle(setState, 100)
    for (i in MonsterZ) {
        MonsterZ[i].SetState = throttle(setState, 150)
    }
    kostyl()
})