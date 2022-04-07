// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];
        this.click = null;
        this.mouse = null;
        this.action = "add";

        // THE KILL SWITCH
        this.running = false;

        // Options and the Details
        this.options = {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
            debugging: false,
        }
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            if (this.running) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            }
        };
        gameLoop();
    };

    startInput() {
        var that = this;

        const getXandY = e => ({
            x: e.clientX - that.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - that.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            that.mouse = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("click", function (e) {
            that.click = getXandY(e);
            console.log(that.click);
            that.addEntity(new CanvasNode(that.click.x,that.click.y,100,100));
            console.log(that.entities);
        }, false);

        this.ctx.canvas.addEventListener("keydown", function (e) {
            switch (e.code) {
                case "Space":
                    that.up = true;
                    break;

                case "KeyW":
                    that.up = true;
                    break;

                case "KeyA":
                    that.left = true;
                    break;    

                case "KeyS":
                    that.down = true;
                    break;

                case "KeyD":
                    that.right = true;
                    break;

                case "KeyJ":
                    that.attack = true;
                    break;

                case "KeyI":
                    that.titan= true;
                    break;
                case "KeyM":
                    that.transform = true;
                    break;

                case "KeyK":
                    that.specialK = true;
                    break;

                case "KeyL":
                    that.specialL = true;
                    break;

                case "ShiftLeft":
                    that.run = true;
            }
        }, false);

        this.ctx.canvas.addEventListener("keyup", function (e) {
            switch (e.code) {
                case "Space":
                    that.up = false;
                    break;

                case "KeyW":
                    that.up = false;
                    break;

                case "KeyA":
                    that.left = false;
                    break;    

                case "KeyS":
                    that.down = false;
                    break;

                case "KeyD":
                    that.right = false;
                    break;

                case "KeyK":
                    that.specialK = false;
                    break;

                case "KeyL":
                    that.specialL = false;
                    break;
                case "ShiftLeft":
                    that.run = false;
            }
        }, false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx);
        }
        //this.camera.draw(this.ctx);

    };

    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }        

        this.removeFromWorldSplice();        
    };

    removeFromWorldSplice() {
        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
    };

    tick() {
        const current = Date.now();
        const delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        const gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    };
};

//ASSET_MANAGER.downloadAll(function() {
    
    var canvas = document.getElementById('main');
	var ctx = canvas.getContext('2d'); 
    ctx.imageSmoothingEnabled = false;

    var gameEngine = new GameEngine(ctx);
    gameEngine.init(ctx);
    
	//new SceneManager(gameEngine);
 
	gameEngine.start();

//});