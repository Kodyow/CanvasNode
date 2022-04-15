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

        ctx.strokeStyle = "blue"
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "black"
        ctx.roundRect(this.x, this.y, this.width, this.height,50,false,true);
        ctx.font = '14px serif';
        ctx.fillText('Hello world', this.x, this.y);      
        ctx.save();
        ctx.restore();
    }
    update() {

    }
}