function addNode(){
    gameEngine.action = "add";
}

document.getElementById("clear").onclick = function clear() {
    gameEngine.entities = [];
}

document.getElementById("zoomin").onclick = function zoomin() {
    if (gameEngine.zoom < 4)
        gameEngine.zoom += 0.25;
    console.log(gameEngine.zoom);
}

document.getElementById("zoomout").onclick = function zoomin() {
    if (gameEngine.zoom > 0.25)
        gameEngine.zoom -=0.25;

    
    console.log(gameEngine.zoom);
}
