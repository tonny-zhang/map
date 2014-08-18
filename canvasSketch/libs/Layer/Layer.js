//图层类
function Layer(div) {
    var style = div.style;
    var size = new CanvasSketch.Size(parseInt(style.width), parseInt(style.height));
    this.size = size;
    this.div = div;    
    this.maxBounds = new CanvasSketch.Bounds(-size.w / 2, -size.h / 2, size.w / 2, size.h / 2);
    this.bounds = new CanvasSketch.Bounds(-size.w / 2, -size.h / 2, size.w / 2, size.h / 2);
    this.center = this.bounds.getCenter();
    this.zoom = 100;
    this.getRes();
    this.vectors = {};
    //加入矢量图形的总个数。
    this.vectorsCount = 0;
    //创建一个渲染器。
    this.renderer = new Canvas(this);
}

//这个res代表当前zoom下每像素代表的单位长度。 
//比如当前缩放比率为 200% 则通过计算得到 res为0.5，说明当前zoom下每个像素只表示0.5个单位长度。
Layer.prototype.getRes = function() {
    this.res = 1 / (this.zoom / 100);
    return this.res;
}

Layer.prototype.addVectors = function (vectors) {
    this.renderer.lock = true;
    for(var i = 0, len = vectors.length; i < len; i++) {
        if(i == len-1) {this.renderer.lock = false;}
        this.vectors[vectors[i].id] = vectors[i];
        this.drawVector(vectors[i]);
    }
    this.vectorsCount += vectors.length;
}

Layer.prototype.drawVector = function (vector) {
    var style;
	if(!vector.style) {
        style = new CanvasSketch.defaultStyle();
    } else {
		style = vector.style;
	}
    this.renderer.drawGeometry(vector.geometry, style);
}

Layer.prototype.moveTo = function (zoom, center) {
    this.zoom = zoom;
    if(!center) {
        center = this.center;
    }
    var res = this.getRes();
    var width = this.size.w * res;
    var height = this.size.h * res;
    //获取新的视图范围。
    var bounds = new CanvasSketch.Bounds(center.x - width/2, center.y - height/2, center.x + width/2, center.y + height/2);
    this.bounds = bounds;
    //记录已经绘制vector的个数
    var index = 0;
    this.renderer.lock = true;
    for(var id in this.vectors){
        index++;
        if(index == this.vectorsCount) {
            this.renderer.lock = false;
        }
        this.drawVector(this.vectors[id]);
    }
}

//通过屏幕坐标设定center。
Layer.prototype.setCenterFromPx = function (px) {
    this.center = new CanvasSketch.Position(px.x * this.res + this.maxBounds.left, -px.y * this.res + this.maxBounds.top);
}