// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D


        this.ctx = null;
        this.canvas = null;

        
        
        // Mouse Fields 
        this.mouse = {x:0,y:0};
        this.dragStart = {x:0,y:0};
        this.isDragging = false;

        // camera fields
        this.camera = {
            x: 0, 
            y:0,
            scale:1,
            scalePresets:[0.25,0.33,0.5,0.67,0.75,0.8,0.9,1,1.25,1.50,1.75,2,2.5,3,4,5],
            presetIndex:7,
            scaledWidth:window.innerWidth,
            scaledHeight:window.innerHeight,
        }

        this.width = window.innerWidth / this.camera.scale;
        this.height = window.innerHeight / this.camera.scale;
        this.scaleWidth = this.width/window.innerWidth;
        this.scaleHeight = this.height/window.innerHeight;
        
        // Actions
        this.createNode = false;
        this.action = "add";

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
        var scaleY = this.canvas.height/rect.height;
        //console.log((e.clientX - rect.left) * scaleX);
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
                that.dragStart.x = mouse.x/that.camera.scale - that.camera.x;
                that.dragStart.y = mouse.y/that.camera.scale - that.camera.y;
            } 
            canvas.focus();
        }, false);

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            if (that.isDragging)
            {
                var mouse = that.getXandY(e);
                
                that.camera.x = mouse.x/that.camera.scale - that.dragStart.x;
                that.camera.y = mouse.y/that.camera.scale - that.dragStart.y;
                console.log(mouse.x);
                if (that.camera.x > 0) {
                    that.camera.x = 0;
                }
                if (that.camera.y > 0) {
                    that.camera.y = 0;
                }
                if ((that.camera.x - window.innerWidth)*that.scaleWidth < -7680) {
                    that.camera.x = -7680 + window.innerWidth*that.scaleWidth;
                }
                if ((that.camera.y - window.innerHeight)*that.scaleHeight< -4320) {
                    that.camera.y = -4320 + window.innerHeight*that.scaleHeight;
                }
            }

        }, false);
        
        this.ctx.canvas.addEventListener("mouseup", function (e) {
            that.isDragging = false;
            that.canvas.style.cursor = "default";
            console.log(that.getXandY(e).x); 
            console.log(that.camera.x);
            console.log(that.camera.y);           
        }, false);

        this.ctx.canvas.addEventListener("click", function (e) {
            const click = that.getXandY(e);
            const x = (click.x*that.scaleWidth-that.camera.x);
            const y = (click.y*that.scaleHeight-that.camera.y);
            if (that.createNode) {
                that.addEntity(new CanvasNode(x,y,200,100));
                that.createNode = false;
            }
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

        document.getElementById('controls').addEventListener("wheel", function (e) {
            e.preventDefault();
        }, false);

        this.ctx.canvas.addEventListener("wheel", function (e) {
            e.preventDefault();
            
            that.mouse = that.getXandY(e);
            if (e.deltaY > 0 ) {
                if (that.camera.presetIndex > 0) {
                    that.camera.scale = that.camera.scalePresets[--that.camera.presetIndex];
                }
            } else {
                if (that.camera.presetIndex < that.camera.scalePresets.length-1) {
                    that.camera.scale = that.camera.scalePresets[++that.camera.presetIndex];
                }
            }
            const logcalZoom = that.camera.scale-1;
            that.camera.x = ((that.camera.x-that.mouse.x)/(that.canvas.width*logcalZoom));
            that.camera.y = ((that.camera.y-that.mouse.y)/(that.canvas.height*logcalZoom));
            console.log(that.camera.y*that.canvas.height*that.logcalZoom);
            console.log(that.camera.x);
            console.log(that.camera.y);
        }, false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        //this.ctx.translate(0, 0);
        this.ctx.scale(this.camera.scale,this.camera.scale);
        this.ctx.translate( this.camera.x, this.camera.y);

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        var xPos = 0;
        var yPos = 0;
        ctx.strokeStyle = "Black";
        ctx.fillStyle = "White";
        ctx.lineWidth = 5;
        ctx.fillRect(xPos, yPos, 4320, 7680);
        ctx.strokeRect(xPos, yPos, 4320, 7680);
        // while (yPos < 4320/*this.canvas.height*/) {
        //     while (xPos < 7680/*this.canvas.width*/) {
                
        //         ctx.strokeRect(xPos, yPos, 20, 20);
        //         xPos += 20; 
        //     }
        //     yPos += 20;
        //     xPos = 0;
        // }
        
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
        //move to resize event handler
        this.canvas.width = window.innerWidth*this.camera.scale;
        this.canvas.height = window.innerHeight*this.camera.scale;
        this.width = window.innerWidth / this.camera.scale;
        this.height = window.innerHeight / this.camera.scale;
        this.scaleWidth = this.width/window.innerWidth;
        this.scaleHeight = this.height/window.innerHeight;
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