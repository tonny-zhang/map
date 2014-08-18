function Circle(x, y, radius) {
    Point.apply(this, arguments);
    this.radius = radius;
}

Circle.prototype = new Point();

Circle.prototype.getBounds = function () {
    if(!this.bounds) {
        this.bounds = new CanvasSketch.Bounds(this.x - this.radius, this.y - this.radius, this.x + this.radius, this.y + this.radius);
        return this.bounds;
    } else {
        return this.bounds;
    }
}

Circle.prototype.geoType = "Circle";