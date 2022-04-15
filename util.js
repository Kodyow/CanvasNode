/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/** 
 * Draws a rounded rectangle using the current state of the canvas.  
 * If you omit the last three params, it will draw a rectangle  
 * outline with a 5 pixel border radius  
 * @param {Number} x The top left x coordinate 
 * @param {Number} y The top left y coordinate  
 * @param {Number} width The width of the rectangle  
 * @param {Number} height The height of the rectangle 
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0; 
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false. 
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true. 
 * https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
 */
 CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = radius > 50 ? 50 : radius  
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius, y);
    this.lineTo(x + width - cornerRadius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
    this.lineTo(x + width, y + height - cornerRadius);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
    this.lineTo(x + cornerRadius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
    this.lineTo(x, y + cornerRadius);
    this.quadraticCurveTo(x, y, x + cornerRadius, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
} 