'use strict'
import { getLevel1, transfer }
    from "../assets/maps/1lvl.js"
import { newCreature }
    from "./model.js"

export let Maps = [] //Карта игры
// let PositionView = 0 //Где находитя камера пока не используется
export let divka = {
    Left: 0,
    Body: document.getElementById("map")
} //дивка самой игры либо камера если можно так назвать
export let gravity = 0.0015
let divos = document.getElementById("monitor")
export let mapTileSize = 36 //размер тайла. Все тайлы это квадраты
export let clouds = []
// let counter = 0
// let countertime = 0 //for measuring fps

//timeNow = Date.now()//нахер не нужен
// MapTiling
export let MonsterZ = []
export function MapMaking(getlvl = getLevel1) {
    newCreature(["MarioStands.png", "MarioJump.png", "MarioRun1.png", "MarioRun2.png", "MarioRun3.png", "MarioRun4.png", "MarioRun5.png", "MarioRun6.png", "MarioSeats.png",], "Mario", divos, "Mario", Mario, 32, 64)
    let lvl = getlvl()
    let monsters = lvl[1]
    let map = lvl[0]
    for (let i = 0; i < map[0].length; i++) { //Array preparation
        Maps[i] = []
        clouds[i] = []
    }

    for (let i = 0; i < map[0].length; i++) { //setting objects
        for (let j = 0; j < map.length; j++) {
            if (map[j][i] == 0) {
                continue
            }

            if (map[j][i] != 5) { //пихаем тайлы с помощью переводчика и самого шаблона карты с цифрами
                Maps[i][j] = document.createElement("image")
                Maps[i][j].setAttribute("style", "top:" + mapTileSize * (j) + "px;left:" + mapTileSize * i + "px")
                map[j][i] == 3 ? Maps[i][j].style.content = "url(\"./assets/sprites/environment/" + transfer[map[j][i]] + ".png\")" : "";
                Maps[i][j].setAttribute("class", "grid " + transfer[map[j][i]])
            } else { // если это облако нужно пихать его остальные части
                if (clouds[i - 1][j - 1] == undefined) {
                    clouds[i - 1][j - 1] = document.createElement("image")
                    clouds[i - 1][j - 1].setAttribute("style", "top:" + mapTileSize * (j - 1) + "px;left:" + mapTileSize * (i - 1) + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "00.png) " + "; ")
                    clouds[i - 1][j - 1].setAttribute("class", "grid")
                }

                if (clouds[i - 1][j] == undefined) {
                    clouds[i - 1][j] = document.createElement("image")
                    clouds[i - 1][j].setAttribute("style", "top:" + mapTileSize * (j) + "px;left:" + mapTileSize * (i - 1) + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "01.png) " + "; ")
                    clouds[i - 1][j].setAttribute("class", "grid")
                }

                clouds[i][j] = document.createElement("image")
                clouds[i + 1][j - 1] = document.createElement("image")
                clouds[i][j - 1] = document.createElement("image")
                clouds[i + 1][j] = document.createElement("image")
                clouds[i][j - 1].setAttribute("style", "top:" + mapTileSize * (j - 1) + "px;left:" + mapTileSize * i + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "10.png) " + "; ")
                clouds[i][j - 1].setAttribute("class", "grid")
                clouds[i + 1][j - 1].setAttribute("style", "top:" + mapTileSize * (j - 1) + "px;left:" + mapTileSize * (i + 1) + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "20.png) " + "; ")
                clouds[i + 1][j - 1].setAttribute("class", "grid")
                clouds[i][j].setAttribute("style", "top:" + mapTileSize * (j) + "px;left:" + mapTileSize * i + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "11.png) " + "; ")
                clouds[i][j].setAttribute("class", "grid")
                clouds[i + 1][j].setAttribute("style", "top:" + mapTileSize * (j) + "px;left:" + mapTileSize * (i + 1) + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "21.png) " + "; ")
                clouds[i + 1][j].setAttribute("class", "grid")
            }
        }
    }
    console.log(Maps.length)

    for (let i = 0; i < 26; i++) { //injecting to HTML или рисование
        for (let j = 0; j < map.length; j++) {
            if (Maps[i][j] != undefined) {
                divka.Body.appendChild(Maps[i][j])
            }
            if (clouds[i][j] != undefined) {
                divka.Body.appendChild(clouds[i][j])
            }
        }
    }
    for (let i in monsters) {
        MonsterZ[i] = { //создание монстра
            Onearth: true,
            State: 0,
            Top: monsters[i][1] * mapTileSize,
            Left: monsters[i][0] * mapTileSize,
            looksleft: false,
            vy: 0
        }
        newCreature(["monsterFungi1.png", "monsterFungi2.png", "monsterFungi3.png"], "Monster", divka.Body, "Monster", MonsterZ[i], 32, 32, MonsterZ[i])
        console.log(MonsterZ[i])
    }
}

export let Mario = { //создание самого игрока
    Onearth: true,
    State: 0,
    Top: 0,
    Left: 0,
    looksleft: false
}

