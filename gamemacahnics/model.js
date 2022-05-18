'use strict'
export function newCreature(src, classname, parent, file, reference, width, height, initialcoordinate = [0, 0]) { //срс это имена спрайтов, высота, ширина, парент это куда нужно пихать, файл это в какой папке находится спрайты 
    reference.Body = document.createElement("div") //это основная дивка контейнер спрайтов передвигаем и зазеркалим с помощью него
    reference.Body.setAttribute("style", "left:" + initialcoordinate[0] + "px;top:" + initialcoordinate[1] + "px;")
    reference.Body.setAttribute("class", classname)
    parent.appendChild(reference.Body)
    reference.Sprites = []
    for (let i in src) {
        let new1 = document.createElement("image")
        new1.setAttribute("style", "visibility: hidden; content: url(./assets/sprites/" + file + "/" + src[i] + ");")
        new1.setAttribute("class", classname)
        reference.Body.appendChild(new1)
        reference.Sprites[i] = new1
    }
    reference.height = height
    reference.width = width
    reference.vy = 0
    reference.Sprites[0].style.visibility = "visible"
}