function Vector(geometry, attributes) {
    this.id = CanvasSketch.getId("vector");
    this.geometry = geometry;
    if(attributes) {
        this.attributes = attributes;
    }
}