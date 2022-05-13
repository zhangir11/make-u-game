import { getLevel1, transfer }
from "../assets/maps/1lvl.js"
import { newCreature }
from "./model.js"

export let Maps = [] //Карта игры
    // let PositionView = 0 //Где находитя камера пока не используется
export let divka = {
        Left: 0,
        Body: document.getElementById("hren")
    } //дивка самой игры либо камера если можно так назвать
export let gravity = 0.001
let divos = document.getElementById("cros")
let fps = document.getElementById("fpska") //дивка фпски
let mapTileSize = 36 //размер тайла. Все тайлы это квадраты
    // let counter = 0
    // let countertime = 0 //for measuring fps

//timeNow = Date.now()//нахер не нужен

// MapTiling

function MapMaking(getlvl = getLevel1) {
    let clouds = []
    let map = getlvl()
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
                Maps[i][j].setAttribute("style", "position:absolute; top:" + mapTileSize * (j) + "px;left:" + mapTileSize * i + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + ".png) " + "; width:" + mapTileSize + "px; height:" + mapTileSize + "px;")
            } else { // если это облако нужно пихать его остальные части
                if (clouds[i - 1][j - 1] == undefined) {
                    clouds[i - 1][j - 1] = document.createElement("image")
                    clouds[i - 1][j - 1].setAttribute("style", "position:absolute; top:" + mapTileSize * (j - 1) + "px;left:" + mapTileSize * (i - 1) + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "00.png) " + "; width:" + mapTileSize + "px; height:" + mapTileSize + "px;")
                }

                if (clouds[i - 1][j] == undefined) {
                    clouds[i - 1][j] = document.createElement("image")
                    clouds[i - 1][j].setAttribute("style", "position:absolute; top:" + mapTileSize * (j) + "px;left:" + mapTileSize * (i - 1) + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "01.png) " + "; width:" + mapTileSize + "px; height:" + mapTileSize + "px;")
                }

                clouds[i][j] = document.createElement("image")
                clouds[i + 1][j - 1] = document.createElement("image")
                clouds[i][j - 1] = document.createElement("image")
                clouds[i + 1][j] = document.createElement("image")
                clouds[i][j - 1].setAttribute("style", "position:absolute; top:" + mapTileSize * (j - 1) + "px;left:" + mapTileSize * i + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "10.png) " + "; width:" + mapTileSize + "px; height:" + mapTileSize + "px;")
                clouds[i + 1][j - 1].setAttribute("style", "position:absolute; top:" + mapTileSize * (j - 1) + "px;left:" + mapTileSize * (i + 1) + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "20.png) " + "; width:" + mapTileSize + "px; height:" + mapTileSize + "px;")
                clouds[i][j].setAttribute("style", "position:absolute; top:" + mapTileSize * (j) + "px;left:" + mapTileSize * i + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "11.png) " + "; width:" + mapTileSize + "px; height:" + mapTileSize + "px;")
                clouds[i + 1][j].setAttribute("style", "position:absolute; top:" + mapTileSize * (j) + "px;left:" + mapTileSize * (i + 1) + "px; content: url(./assets/sprites/environment/" + transfer[map[j][i]] + "21.png) " + "; width:" + mapTileSize + "px; height:" + mapTileSize + "px;")
            }
        }
        console.log(Maps.length)
    }

    for (let i = 0; i < map[0].length; i++) { //injecting to HTML или рисование
        for (let j = 0; j < map.length; j++) {
            if (Maps[i][j] != undefined) {
                divka.Body.appendChild(Maps[i][j])
            }
            if (clouds[i][j] != undefined) {
                divka.Body.appendChild(clouds[i][j])
            }
        }
    }
}

MapMaking()

export let Mario = { //создание самого игрока
    Onearth: true,
    State: 0,
    Top: 0,
    Left: 0,
    looksleft: false
}

newCreature(["MarioStands.png", "MarioJump.png", "MarioRun1.png", "MarioRun2.png", "MarioRun3.png", "MarioRun4.png", "MarioRun5.png", "MarioRun6.png", "MarioSeats.png", ], 64, 32, divos, "Mario", Mario)
console.log(Mario.Body)