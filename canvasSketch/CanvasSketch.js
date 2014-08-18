window.CanvasSketch = {
	vesion: "1.0.0",		
	author: "Gao",
};

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

function Vector(geometry, attributes) {
    this.id = CanvasSketch.getId("vector");
    this.geometry = geometry;
    if(attributes) {
        this.attributes = attributes;
    }
}

function Geometry(){
    this.id = CanvasSketch.getId("geomtry_");
}

//bounds属性定义了当前Geometry外接矩形范围。
Geometry.prototype.bounds = null;

//定义Geometry的id属性。
Geometry.prototype.id = null;

//定义对bounds基类克隆的方法
Geometry.prototype.clone = function () {
    return new Geometry();
}

//销毁当前的Geometry
Geometry.prototype.destroy = function () {
    this.bounds = null;
    this.id = null;
}

function Point(x, y) {
    Geometry.apply(this, arguments);
    this.x = x;
    this.y = y;
}

Point.prototype = new Geometry();
//point类的横坐标。
Point.prototype.x = null;
//point类的纵坐标。
Point.prototype.y = null;

//得到点的范围。
Point.prototype.getBounds = function () {
    if(!this.bounds) {
        var x = this.x;
        var y = this.y;
        this.bounds = new CanvasSketch.Bounds(x, y, x, y);
        return this.bounds;
    } else {
        return this.bounds;
    }
}

//clone方法。
Point.prototype.clone = function () {
    return new Point(this.x, this.y);
}

Point.prototype.geoType = "Point";

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

//渲染器类的构造函数。
function Canvas (layer) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    //只有当lock为false的时候才会执行绘制。
    this.lock = true;
    this.layer = layer;
    this.setSize(layer.size);
    this.geometrys = {};
    layer.div.appendChild(this.canvas);
}

//设置canvas元素的大小。
Canvas.prototype.setSize = function(size){
    this.canvas.width = size.w;
    this.canvas.height = size.h;
    this.canvas.style.width = size.w + "px";
    this.canvas.style.height = size.h + "px";
}

//这个方法用于收集所有需要绘制的矢量元素。    
Canvas.prototype.drawGeometry = function(geometry, style){
    this.geometrys[geometry.id] = [geometry, style];
    //如果渲染器没有被锁定则可以进行重绘。
    if(!this.lock){
        this.redraw();
    }
}

//每次绘制都是全部清除，全部重绘。
//todo加入快照后可以大大提高性能。    
Canvas.prototype.redraw = function(){
    this.context.clearRect(0, 0, this.layer.size.w, this.layer.size.h);
    var geometry;
    if(!this.lock){
        for(var id in this.geometrys){
            if(this.geometrys.hasOwnProperty(id)){
                geometry = this.geometrys[id][0];
                style = this.geometrys[id][1];
                this.draw(geometry, style, geometry.id);
            }            
        }
    }    
}

//每一个矢量元素的绘制，这里我们在以后会添加更多的矢量图形。
Canvas.prototype.draw = function(geometry, style, id){
    if(geometry.geoType == "Point"){
        this.drawPoint(geometry, style, id);
    }
    if(geometry.geoType == "Circle") {
        this.drawCircle(geometry, style, id);
    }
    //{todo} 我们在这里判断各种矢量要素的绘制。        
}

//针对点的绘制方法。
Canvas.prototype.drawPoint = function(geometry, style, id){
    var radius = style.pointRadius;
    var twoPi = Math.PI*2;
    var pt = this.getLocalXY(geometry);
    //填充
    if(style.fill) {
        this.setCanvasStyle("fill", style)
        this.context.beginPath();
        this.context.arc(pt.x, pt.y, radius, 0, twoPi, true);
        this.context.fill();
    }
    //描边
    if(style.stroke) {
        this.setCanvasStyle("stroke", style)
        this.context.beginPath();
        this.context.arc(pt.x, pt.y, radius, 0, twoPi, true);
        this.context.stroke();
    }
    this.setCanvasStyle("reset");
}

//针对圆的绘制方法。
Canvas.prototype.drawCircle = function(geometry, style, id){
    var radius = geometry.radius
    var twoPi = Math.PI*2;
    var pt = this.getLocalXY(geometry);
    //填充
    if(style.fill) {
        this.setCanvasStyle("fill", style)
        this.context.beginPath();
        this.context.arc(pt.x, pt.y, radius / this.layer.res, 0, twoPi, true);
        this.context.fill();
    }
    //描边
    if(style.stroke) {
        this.setCanvasStyle("stroke", style)
        this.context.beginPath();
        this.context.arc(pt.x, pt.y, radius / this.layer.res, 0, twoPi, true);
        this.context.stroke();
    }
    this.setCanvasStyle("reset");
}

//设置canvas的样式。
Canvas.prototype.setCanvasStyle = function(type, style) {
    if (type === "fill") {     
        this.context.globalAlpha = style['fillOpacity'];
        this.context.fillStyle = style['fillColor'];
    } else if (type === "stroke") {  
        this.context.globalAlpha = style['strokeOpacity'];
        this.context.strokeStyle = style['strokeColor'];
        this.context.lineWidth = style['strokeWidth'];
    } else {
        this.context.globalAlpha = 0;
        this.context.lineWidth = 1;
    }
}

//获得一个点的屏幕显示位置。
Canvas.prototype.getLocalXY = function(point) {
    var resolution = this.layer.getRes();
    var extent = this.layer.bounds;
    var x = (point.x / resolution + (-extent.left / resolution));
    var y = ((extent.top / resolution) - point.y / resolution);
    return {x: x, y: y};
}