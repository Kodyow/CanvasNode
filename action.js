function addNode(){
    gameEngine.action = "add";
}

document.getElementById("add").onclick = function clear() {
    gameEngine.createNode = true;
}

document.getElementById("clear").onclick = function clear() {
    gameEngine.entities = [];
}

document.getElementById("zoomin").onclick = function zoomin() {
    if (gameEngine.index < gameEngine.zoomPresets.length-1)
        gameEngine.zoom = gameEngine.zoomPresets[++gameEngine.index];
    console.log(gameEngine.zoom);
}

document.getElementById("zoomout").onclick = function zoomout() {
    if (gameEngine.index > 0)
        gameEngine.zoom =gameEngine.zoomPresets[--gameEngine.index];

    
    console.log(gameEngine.zoom);
}
