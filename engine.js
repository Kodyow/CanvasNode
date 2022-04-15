// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        this.canvas = null;
        this.camera = {x: 0, y:0}

        // Everything that will be updated and drawn each frame
        
        this.click = null;
        this.mouse = null;
        this.isDragging = false;
        this.dragStart = {x:0,y:0};
        this.action = "add";
        this.zoom = 1;

        this.originalWidth = window.innerWidth;
        this.originalHeight = window.innerHeight;  
        this.width = window.innerWidth / this.zoom;
        this.height = window.innerHeight / this.zoom;
        this.scaleWidth = this.width/this.originalWidth;
        this.scaleHeight = this.height/this.originalHeight;

        // THE KILL SWITCH
        this.running = false;
        this.entities = [];
        // Options and the Details
        this.options = {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
            debugging: false,
        }
    };

    init(ctx,canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
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
    getXandY(e) {
        var rect = this.canvas.getBoundingClientRect();
        var scaleX = this.canvas.width/rect.width;
        var scaleY = this.canvas.height /rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        }

    };

    startInput() {
        var that = this;


        window.addEventListener('contextmenu', function (e) { 
            e.preventDefault(); 
        }, false);

        this.ctx.canvas.addEventListener("mousedown", function (e) {
            e.preventDefault();
            if (e.button === 2) {
                that.canvas.style.cursor = "grabbing";
                that.isDragging = true;
                var mouse = that.getXandY(e);
                that.dragStart.x = mouse.x/that.zoom - that.camera.x;
                that.dragStart.y = mouse.y/that.zoom - that.camera.y;
            } 
        }, false);

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            if (that.isDragging)
            {
                var mouse = that.getXandY(e);
                
                that.camera.x = mouse.x/that.zoom - that.dragStart.x
                that.camera.y = mouse.y/that.zoom - that.dragStart.y
                if (that.camera.x > 0) {
                    that.camera.x = 0;
                }
                if (that.camera.y > 0) {
                    that.camera.y = 0;
                }
                if (that.camera.x - that.originalWidth < -7680) {
                    that.camera.x = -7680 + that.originalWidth;
                }
                if (that.camera.y - that.originalHeight< -4320) {
                    that.camera.y = -4320 + that.originalHeight;
                }
            }

        }, false);
        
        this.ctx.canvas.addEventListener("mouseup", function (e) {
            that.isDragging = false;
            that.canvas.style.cursor = "default";
            console.log(that.camera.x);
        }, false);

        this.ctx.canvas.addEventListener("click", function (e) {
            that.click = that.getXandY(e);
            that.addEntity(new CanvasNode((that.click.x -that.camera.x)*that.scaleWidth ,(that.click.y-that.camera.y)*that.scaleHeight,200,100));
            console.log(that.entities);
        }, false);

        this.ctx.canvas.addEventListener("keydown", function (e) {
            switch (e.code) {
                case "Space":
                    that.up = true;
                    break;
            }
        }, false);

        this.ctx.canvas.addEventListener("keyup", function (e) {
            switch (e.code) {
                case "Space":
                    that.up = false;
                    break;
            }
        }, false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.translate(0, 0);
        this.ctx.scale(this.zoom,this.zoom);
        this.ctx.translate( this.camera.x, this.camera.y );

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        var xPos = 0;
        var yPos = 0;
        ctx.strokeStyle = "lightgrey";
        ctx.lineWidth = 1;
        while (yPos < 4320/*this.canvas.height*/) {
            while (xPos < 7680/*this.canvas.width*/) {
                
                ctx.strokeRect(xPos, yPos, 20, 20);
                xPos += 20; 
            }
            yPos += 20;
            xPos = 0;
        }
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
        this.canvas.width = window.innerWidth*this.zoom;
        this.canvas.height = window.innerHeight*this.zoom;
        this.width = window.innerWidth / this.zoom;
        this.height = window.innerHeight / this.zoom;
        this.originalWidth = window.innerWidth;
        this.originalHeight = window.innerHeight;  
        this.scaleWidth = this.width/this.originalWidth;
        this.scaleHeight = this.height/this.originalHeight;
        this.removeFromWorldSplice();        
    };

    clearAll() {
        this.entities = [];
    }

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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = true;

    var gameEngine = new GameEngine(ctx);
    gameEngine.init(ctx,canvas);
    
	//new SceneManager(gameEngine);
 
	gameEngine.start();

//});