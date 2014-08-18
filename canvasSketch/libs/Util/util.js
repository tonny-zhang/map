CanvasSketch.lastId = 0;
//取得id。
CanvasSketch.getId = function (preString) {
	CanvasSketch.lastId += 1;
	return preString + CanvasSketch.lastId;
}

//图形的范围
CanvasSketch.Bounds = function (x1, y1, x2, y2) {
	this.leftBottom = new CanvasSketch.Position(x1, y1);
	this.rigthTop = new CanvasSketch.Position(x2, y2);
	this.leftTop = new CanvasSketch.Position(x1, y2);
	this.rightBottom = new CanvasSketch.Position(x2, y1);
	this.left = x1;
	this.right = x2;
	this.bottom = y1;
	this.top = y2;
}

CanvasSketch.Bounds.prototype.getCenter = function (){
	var w = this.right - this.left;
	var h = this.top - this.bottom;
	return new CanvasSketch.Position(this.left + w/2, this.bottom + h/2);
}

//位置信息类
CanvasSketch.Position = function (x, y) {
	this.x = x;
	this.y = y;
}

//大小类
CanvasSketch.Size = function (w, h) {
	this.w = w;
	this.h = h;
}

//矢量图形的默认样式
CanvasSketch.defaultStyle = function () {
	this.fill = true;
	this.stroke = true;
	this.pointRadius = 5;
	this.fillOpacity = 0.6;
	this.strokeOpacity = 1;
	this.fillColor = "red";
	this.strokeColor = "black";
}