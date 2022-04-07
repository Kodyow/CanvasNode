class CanvasNode{
    constructor(x,y,width,height) {
        this.x = x;
        this.y = y; 
        this.width = width;
        this.height = height;
        this.selected = true;
        this.content = null; 
    }
    draw(ctx) {
        
        ctx.fillStyle = "Red";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.save();
        ctx.restore();
    }
    update() {

    }
}