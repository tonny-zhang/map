var log = typeof console != 'undefined'?function(){
	console.log.apply(console, arguments);
}: function(){};
var getWindColor = (function(){
	var opacity = 0.5;
	var conf = [{
		a: -10,
		b: 0,
		c: [255, 255, 255, 0]
	},{
		a: 0,
		b: 8.49,
		c: [152, 219, 248, 0.1]
	},{
		a: 8.49,
		b: 15.79,
		c: [50, 100, 255, opacity]
	},{
		a: 15.79,
		b: 30,
		c: [254, 0, 3, opacity]
	},{
		a: 30,
		b: 70,
		c: [209, 103, 211, opacity]
	},{
		a: 70,
		b: 90,
		c: [238, 200, 239, opacity]
	},{
		a: 90,
		b: 100,
		c: [255, 255, 255, opacity]
	}];
	// var conf = [{
	// 	a: -10,
	// 	b: 8.49,
	// 	c: [0, 0, 255, 0]
	// },{
	// 	a: 8.49,
	// 	b: 20,
	// 	c: [255, 0, 0, 0.8]
	// }];
	var len = conf.length;
	return function(wind_vector, is_wind_pow, is_return_arr){
		var wind_pow = is_wind_pow? wind_vector: Math.sqrt(Math.pow(wind_vector.x, 2) + Math.pow(wind_vector.y, 2));
		var conf_item = conf[len - 1],
			conf_item_prev;
		for(var i = 0; i<len; i++){
			var item = conf[i];
			if(wind_pow >= item['a'] && wind_pow < item['b']){
				conf_item = item;
				conf_item_prev = conf[i-1];
				break;
			}
		}
		if(!conf_item_prev){
			return is_return_arr? [255,255,255,0]: 'rgba(255,255,255,0)';
		}
		// if(is_return_arr){
		// 	conf_item['c'][3] = Math.floor(conf_item['c'][3]*255)
		// }
		// return is_return_arr? conf_item['c']: 'rgba('+(conf_item['c'])+')';
		var c1 = conf_item_prev['c'],
			c2 = conf_item['c'];
		var r1 = c1[0],
			g1 = c1[1],
			b1 = c1[2],
			a1 = c1[3],
			r2 = c2[0],
			g2 = c2[1],
			b2 = c2[2],
			a2 = c2[3];

		var p = (wind_pow - conf_item['a'])/(conf_item['b'] - conf_item['a']);
		var r = Math.floor(r1 + (r2 - r1)*p),
			g = Math.floor(g1 + (g2 - g1)*p),
			b = Math.floor(b1 + (b2 - b1)*p),
			a = a1 + (a2 - a1)*p;
			// console.log('rgba('+([r%255, g%255, b%255, a%255])+')');
		return is_return_arr? [r, g, b, Math.floor(a*255)]:'rgba('+([r, g, b, a])+')';
	}
})();

/*时间格式化*/
Date.prototype.format = function(format,is_not_second){
	format || (format = 'yyyy-MM-dd hh:mm:ss');
	var o = {
		"M{2}" : this.getMonth()+1, //month
		"d{2}" : this.getDate(),    //day
		"h{2}" : this.getHours(),   //hour
		"m{2}" : this.getMinutes(), //minute
		"q{2}" : Math.floor((this.getMonth()+3)/3),  //quarter
	}
	if(!is_not_second){
		o["s{2}"] = this.getSeconds(); //second
		o["S{2}"] = this.getMilliseconds() //millisecond
	}
	if(/(y{4}|y{2})/.test(format)){
		format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	} 
	for(var k in o){
		if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	
	return format;
}

!function(global){
	/* 流场相关 { */
	var Vector = function(x, y) {
		this.x = x;
		this.y = y;
	}


	Vector.polar = function(r, theta) {
		return new Vector(r * Math.cos(theta), r * Math.sin(theta));
	};


	Vector.prototype.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};


	Vector.prototype.copy = function() {
		return new Vector(this.x, this.y);
	};


	Vector.prototype.setLength = function(length) {
		var current = this.length();
		if (current) {
			var scale = length / current;
			this.x *= scale;
			this.y *= scale;
		}
		return this;
	};


	Vector.prototype.setAngle = function(theta) {
		var r = length();
		this.x = r * Math.cos(theta);
		this.y = r * Math.sin(theta);
		return this;
	};


	Vector.prototype.getAngle = function() {
		return Math.atan2(this.y, this.x);
	};


	Vector.prototype.d = function(v) {
		var dx = v.x - this.x;
		var dy = v.y - this.y;
		return Math.sqrt(dx * dx + dy * dy);
	};
	/**
	 * Represents a vector field based on an array of data,
	 * with specified grid coordinates, using bilinear interpolation
	 * for values that don't lie on grid points.
	 */

	/**
	 *
	 * @param field 2D array of Vectors
	 *
	 * next params are corners of region.
	 * @param x0
	 * @param y0
	 * @param x1
	 * @param y1
	 */
	var VectorField = function(field, x0, y0, x1, y1) {
		this.x0 = x0;
		this.x1 = x1;
		this.y0 = y0;
		this.y1 = y1;
		this.field = field;
		this.w = field.length;
		this.h = field[0].length;
		this.maxLength = 0;
		for (var i = 0; i < this.w; i++) {
			for (var j = 0; j < this.h; j++) {

				this.maxLength = Math.max(this.maxLength, field[i][j].length());
			}
		}
	};

	/**
	 * Reads data from raw object in form:
	 * {
	 *   x0: -126.292942,
	 *   y0: 23.525552,
	 *   x1: -66.922962,
	 *   y1: 49.397231,
	 *   gridWidth: 501.0,
	 *   gridHeight: 219.0,
	 *   field: [
	 *     0,0,
	 *     0,0,
	 *     ... (list of vectors)
	 *   ]
	 * }
	 *
	 * If the correctForSphere flag is set, we correct for the
	 * distortions introduced by an equirectangular projection.
	 */
	VectorField.read = function(data, correctForSphere) {
		var field = [];
		var w = data.gridWidth; //width
		var h = data.gridHeight; //height
		var n = 2 * w * h; //2*area
		var i = 0;
		// OK, "total" and "weight"
		// are kludges that you should totally ignore,
		// unless you are interested in the average
		// vector length on vector field over lat/lon domain.
		var total = 0;
		var weight = 0;
		for (var x = 0; x < w; x++) {
			field[x] = [];
			for (var y = 0; y < h; y++) {
				//reads in x/y data for each point, left->right, top->bottom
				var vx = data.field[i++];
				var vy = data.field[i++];
				var v = new Vector(vx, vy);
				// Uncomment to test a constant field:
				// v = new Vector(10, 0);
				if (correctForSphere) {
					var ux = x / (w - 1);
					var uy = y / (h - 1);
					var lon = data.x0 * (1 - ux) + data.x1 * ux;
					var lat = data.y0 * (1 - uy) + data.y1 * uy;
					var m = Math.PI * lat / 180;
					var length = v.length();
					if (length) {
						total += length * m;
						weight += m;
					}
					v.x /= Math.cos(m);
					v.setLength(length);
				}
				field[x][y] = v;
			}
		}
		var result = new VectorField(field, data.x0, data.y0, data.x1, data.y1);
		// window.log('total = ' + total);
		// window.log('weight = ' + weight);
		if (total && weight) {

			result.averageLength = total / weight;
		}
		// log(result);
		return result;
	};
	VectorField.split1 = function(vectorField,x0,y0,x1,y1){
		var w = vectorField.w,
			h = vectorField.h,
			x_old = vectorField.x0,
			y_old = vectorField.y0,
			per_x = (vectorField.x1 - x_old)/w,
			per_y = (vectorField.y1 - y_old)/h;

		var new_field = [];
		var i_x0 = i_x1 = i_y0 = i_y1 = -1;
		var field = vectorField.field;
		for(var i = 0,j = field.length;i<j;i++){
			var new_x = x_old + per_x * (i-1);
			if(new_x >= x0 && new_x <= x1){
				if(i_x0 == -1){
					i_x0 = i;
				}else{
					i_x1 = i;
				}
				for(var i_inner = 0,v_inner = field[i],j_inner = v_inner.length;i_inner< j_inner;i_inner++){
					var new_y = y_old + per_y * (i_inner-1);
					if(new_y >= y1 && new_y <= y0){
						if(i_y0 == -1){
							i_y0 = i_inner;
						}else{
							i_y1 = i_inner;
						}
					}
				}
			}
		}
		i_x0 -= 3;
		i_x1 += 3;
		i_y0 -= 3;
		i_y1 += 3;
		var MIN_X = 10,MIN_Y = 7;
		var cha_i = i_x1 - i_x0;
		if(cha_i < MIN_X){
			cha_i = Math.ceil((MIN_X - cha_i)/2);
			i_x0 = Math.max(0,i_x0-cha_i);
			i_x1 = Math.min(i_x1+cha_i,w-1);
		}
		var cha_j = i_y1 - i_y0;
		if(cha_j < MIN_Y){
			cha_j = Math.ceil((MIN_Y - cha_j)/2);
			i_y0 = Math.max(0,i_y0-cha_j);
			i_y1 = Math.min(i_y1+cha_j,h-1);
		}
		i_x0 = Math.max(0,i_x0);
		i_x1 = Math.min(i_x1,w-1);
		i_y0 = Math.max(0,i_y0);
		i_y1 = Math.min(i_y1,h-1);

		new_x0 = x_old + i_x0 * per_x;
		new_x1 = x_old + i_x1 * per_x;
		new_y0 = y_old + i_y0 * per_y;
		new_y1 = y_old + i_y1 * per_y;

		for(var i = i_x0;i<i_x1;i++){
			var field_colum = [];
			for(var j = i_y0;j<i_y1;j++){
				field_colum.push(field[i][j]);
			}
			new_field.push(field_colum);
		}

		var newVectorField = new VectorField(new_field,new_x0,new_y0,new_x1,new_y1);
		/*保证计算颜色时基本保持一致*/
		newVectorField.maxLength = vectorField.maxLength;
		return newVectorField;
	}
	VectorField.split = function(vectorField,x0,y0,x1,y1){return vectorField;
		var w = vectorField.w,
			h = vectorField.h,
			x_old = vectorField.x0,
			y_old = vectorField.y0,
			per_x = (vectorField.x1 - x_old)/w,
			per_y = (vectorField.y1 - y_old)/h,
			x_start = Math.min(x0, x1),
			x_end = Math.max(x0, x1),
			y_start = Math.min(y0, y1),
			y_end = Math.max(y0, y1);
		var new_field = [];
		var new_x0 = 900, new_x1 = -900, new_y0 = 900, new_y1 = -900;
		var field = vectorField.field;
		for(var i = 0,j = field.length;i<j;i++){
			var new_x = x_old + per_x * (i-1);
			if(new_x >= x_start && new_x <= x_end){
				if(new_x0 > new_x){
					new_x0 = new_x;
				}
				if(new_x1 < new_x){
					new_x1 = new_x;
				}


				var arr = [];
				for(var i_inner = 0,v_inner = field[i],j_inner = v_inner.length;i_inner< j_inner;i_inner++){
					var new_y = y_old + per_y * (i_inner-1);

					if(new_y >= y_start && new_y <= y_end){

						if(new_y0 > new_y){
							new_y0 = new_y;
						}
						if(new_y1 < new_y){
							new_y1 = new_y;
						}
						arr.push(v_inner[i_inner]);
					}
				}
				if(arr.length > 0){
					new_field.push(arr);
				}
			}
		}

		var newVectorField = new VectorField(new_field,new_x0,new_y0,new_x1,new_y1);
		/*保证计算颜色时基本保持一致*/
		newVectorField.maxLength = vectorField.maxLength;
		return newVectorField;
	}
	VectorField.prototype.inBounds = function(x, y) {
		return x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1;
	};


	VectorField.prototype.bilinear = function(coord, a, b) {
		var na = Math.floor(a);
		var nb = Math.floor(b);
		var ma = Math.ceil(a);
		var mb = Math.ceil(b);
		var fa = a - na;
		var fb = b - nb;

		return this.field[na][nb][coord] * (1 - fa) * (1 - fb) +
			this.field[ma][nb][coord] * fa * (1 - fb) +
			this.field[na][mb][coord] * (1 - fa) * fb +
			this.field[ma][mb][coord] * fa * fb;
	};


	VectorField.prototype.getValue = function(x, y, opt_result) {
		var a = (this.w - 1 - 1e-6) * (x - this.x0) / (this.x1 - this.x0);
		var b = (this.h - 1 - 1e-6) * (y - this.y0) / (this.y1 - this.y0);
		var vx = this.bilinear('x', a, b);
		var vy = this.bilinear('y', a, b);
		if (opt_result) {
			opt_result.x = vx;
			opt_result.y = vy;
			return opt_result;
		}
		return new Vector(vx, vy);
	};


	VectorField.prototype.vectValue = function(vector) {
		return this.getValue(vector.x, vector.y);
	};


	VectorField.constant = function(dx, dy, x0, y0, x1, y1) {
		var field = new VectorField([
			[]
		], x0, y0, x1, y1);
		field.maxLength = Math.sqrt(dx * dx + dy * dy);
		field.getValue = function() {
			return new Vector(dx, dy);
		}
		return field;
	}

	/**
	 * Listens to mouse events on an element, tracks zooming and panning,
	 * informs other components of what's going on.
	 */
	var Animator = function(element, opt_animFunc, opt_unzoomButton) {
		this.element = element;
		this.mouseIsDown = false;
		this.mouseX = -1;
		this.mouseY = -1;
		this.animating = true;
		this.state = 'animate';
		this.listeners = [];
		this.dx = 0;
		this.dy = 0;
		this.scale = 1;
		this.zoomProgress = 0;
		this.scaleTarget = 1;
		this.scaleStart = 1;
		this.animFunc = opt_animFunc;
		this.unzoomButton = opt_unzoomButton;

		if (element) {
			var self = this;
			$(element).mousedown(function(e) {
				self.mouseX = e.pageX - this.offsetLeft;
				self.mouseY = e.pageY - this.offsetTop;
				self.mousedown();
			});
			$(element).mouseup(function(e) {
				self.mouseX = e.pageX - this.offsetLeft;
				self.mouseY = e.pageY - this.offsetTop;
				self.mouseup();
			});
			$(element).mousemove(function(e) {
				self.mouseX = e.pageX - this.offsetLeft;
				self.mouseY = e.pageY - this.offsetTop;
				self.mousemove();
			});
		}
	};


	Animator.prototype.mousedown = function() {
		this.state = 'mouse-down';
		this.notify('startMove');
		this.landingX = this.mouseX;
		this.landingY = this.mouseY;
		this.dxStart = this.dx;
		this.dyStart = this.dy;
		this.scaleStart = this.scale;
		this.mouseIsDown = true;
	};


	Animator.prototype.mousemove = function() {
		if (!this.mouseIsDown) {
			this.notify('hover');
			return;
		}
		var ddx = this.mouseX - this.landingX;
		var ddy = this.mouseY - this.landingY;
		var slip = Math.abs(ddx) + Math.abs(ddy);
		if (slip > 2 || this.state == 'pan') {
			this.state = 'pan';
			this.dx += ddx;
			this.dy += ddy;
			this.landingX = this.mouseX;
			this.landingY = this.mouseY;
			this.notify('move');
		}
	}

	Animator.prototype.mouseup = function() {
		this.mouseIsDown = false;
		if (this.state == 'pan') {
			this.state = 'animate';
			this.notify('endMove');
			return;
		}
		this.zoomClick(this.mouseX, this.mouseY);
	};


	Animator.prototype.add = function(listener) {
		this.listeners.push(listener);
	};


	Animator.prototype.notify = function(message) {
		if (this.unzoomButton) {
			var diff = Math.abs(this.scale - 1) > .001 ||
				Math.abs(this.dx) > .001 || Math.abs(this.dy > .001);
			this.unzoomButton.style.visibility = diff ? 'visible' : 'hidden';
		}
		if (this.animFunc && !this.animFunc()) {
			return;
		}
		for (var i = 0; i < this.listeners.length; i++) {
			var listener = this.listeners[i];
			if (listener[message]) {
				listener[message].call(listener, this);
			}
		}
	};


	Animator.prototype.unzoom = function() {
		this.zoom(0, 0, 1);
	};

	Animator.prototype.removeMask = function() {

		this.notify('remove');

	};

	Animator.prototype.zoomClick = function(x, y) {
		var z = 1.7;
		var scale = 1.7 * this.scale;
		var dx = x - z * (x - this.dx);
		var dy = y - z * (y - this.dy);
		this.zoom(dx, dy, scale);
	};

	Animator.prototype.zoom = function(dx, dy, scale) {
		this.state = 'zoom';
		this.zoomProgress = 0;
		this.scaleStart = this.scale;
		this.scaleTarget = scale;
		this.dxTarget = dx;
		this.dyTarget = dy;
		this.dxStart = this.dx;
		this.dyStart = this.dy;
		this.notify('startMove');
	};

	Animator.prototype.relativeZoom = function() {
		return this.scale / this.scaleStart;
	};


	Animator.prototype.relativeDx = function() {
		return this.dx - this.dxStart;
	}

	Animator.prototype.relativeDy = function() {
		return this.dy - this.dyStart;
	}

	Animator.prototype.start = function(opt_millis) { //start animation
		var millis = opt_millis || 20;
		var self = this;

		function go() {
			var start = new Date();
			self.loop();
			var time = new Date() - start;
			self.tt_go = setTimeout(go, Math.max(10, millis - time)); //execute every opt_milis seconds
		}
		go();
	};
	Animator.prototype.stop = function(){
		clearTimeout(this.tt_go);
	}

	Animator.prototype.loop = function() {
		if (this.state == 'mouse-down' || this.state == 'pan') {
			return;
		}
		if (this.state == 'animate') {
			this.notify('animate');
			return;
		}
		if (this.state == 'zoom') {
			this.zoomProgress = Math.min(1, this.zoomProgress + .07);
			var u = (1 + Math.cos(Math.PI * this.zoomProgress)) / 2;

			function lerp(a, b) {
				return u * a + (1 - u) * b;
			}
			this.scale = lerp(this.scaleStart, this.scaleTarget);
			this.dx = lerp(this.dxStart, this.dxTarget);
			this.dy = lerp(this.dyStart, this.dyTarget);
			if (this.zoomProgress < 1) {
				this.notify('move');
			} else {
				this.state = 'animate';
				this.zoomCurrent = this.zoomTarget;
				this.notify('endMove');
			}
		}
	};

	/**
	 * Displays a geographic vector field using moving particles.
	 * Positions in the field are drawn onscreen using the Alber
	 * "Projection" file.
	 */

	var Particle = function(x, y, age) {
		this.x = x;
		this.y = y;
		this.oldX = -1;
		this.oldY = -1;
		this.age = age;
		this.rnd = Math.random();
	}


	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {number} scale The scale factor for the projection.
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @param {number} longMin
	 * @param {number} latMin
	 * @param {VectorField} field
	 * @param {number} numParticles
	 */
	var MotionDisplay = function(canvas, imageCanvas, field, numParticles, opt_projection) {
		this.canvas = canvas;
		this.projection = opt_projection || IDProjection;
		this.field = field;
		this.numParticles = numParticles; //number of streaks
		this.first = true; //first run
		this.maxLength = field.maxLength; //max length of vector
		this.imageCanvas = imageCanvas;
		this.x0 = this.field.x0; //corner coordinates
		this.x1 = this.field.x1; //corner coordinates
		this.y0 = this.field.y0; //corner coordinates
		this.y1 = this.field.y1; //corner coordinates
		this.makeNewParticles(null, true); //randomly generate particles within map
		this.colors = [];
		this.rgb = '40, 40, 40'; //background color 40, 40, 40 28,28,130
		this.background = 'rgb(' + this.rgb + ')';
		this.backgroundAlpha = 'rgba(' + this.rgb + ', .02)';
		this.outsideColor = '#fff';
		for (var i = 0; i < 256; i++) {
			this.colors[i] = 'rgb(' + i + ',' + i + ',' + i + ')'; //grayscale colors
		}
		if (this.projection) {
			this.startOffsetX = this.projection.offsetX;
			this.startOffsetY = this.projection.offsetY;
			this.startScale = this.projection.scale;
		}
	};


	MotionDisplay.prototype.setAlpha = function(alpha) {
		this.backgroundAlpha = 'rgba(' + this.rgb + ', ' + alpha + ')';
	};

	MotionDisplay.prototype.makeNewParticles = function(animator) {
		num_create = 0;
		this.particles = [];
		for (var i = 0; i < this.numParticles; i++) {
			var p = this.makeParticle(animator);
			p && this.particles.push(p);
		}
	};

	var AGE_RANDOM = 100;
	function _rand(){
		return (Math.random());
	}
	//makes random particle within bounds of canvas
	MotionDisplay.prototype.makeParticle = function(animator) {
		var dx = animator ? animator.dx : 0; //speed?
		var dy = animator ? animator.dy : 0; //speed?
		var scale = animator ? animator.scale : 1; //scale of orig graph
		//加入检测次数限制，防止进入死循环
		for (var num_test = 0;num_test< 500;num_test++) { //infinite loop
			// 148.488759 41.23353
			// 150.696435 39.374402
			var a = Math.random(); //0-1
			var b = Math.random(); //0-1
			// a  = 0.5,b = 0.5;
			var x = a * this.x0 + (1 - a) * this.x1;
			var y = b * this.y0 + (1 - b) * this.y1;
			// var x = a * 150.696435 + (1 - a) * 142.488759;
			// var y = b * 39.374402 + (1 - b) * 41.23353;
			// x = 121.169744, y = 23.6069;
			// x = 146.060316 , y = 40.394867;
			// return new Particle(x, y, 1 + 40 * Math.random());
			if (this.field.maxLength == 0) {
				return new Particle(x, y, 1 + AGE_RANDOM * Math.random());
			}
			var v = this.field.getValue(x, y); //vector form
			var m = v.length() / this.field.maxLength; //magnitude
			// The random factor here is designed to ensure that
			// more particles are placed in slower areas; this makes the
			// overall distribution appear more even.
			if ((v.x || v.y) && (Math.random() > m * .9)) { //10% chance at max length
				var proj = this.projection.project(x, y);
				var sx = proj.x * scale + dx;
				var sy = proj.y * scale + dy;
				if (!(sx < 0 || sy < 0 || sx > this.canvas.width || sy > this.canvas.height)) { //dimension check
					return new Particle(x, y, 1 + AGE_RANDOM * Math.random());
				}
			}
		}
	};


	MotionDisplay.prototype.startMove = function(animator) {
		// Save screen.
		//this.imageCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
	};


	MotionDisplay.prototype.endMove = function(animator) {
		if (animator.scale < 1.1) {
			this.x0 = this.field.x0;
			this.x1 = this.field.x1;
			this.y0 = this.field.y0;
			this.y1 = this.field.y1;
		} else {
			// get new bounds for making new particles.
			var p = this.projection;
			var self = this;

			function invert(x, y) {
				x = (x - animator.dx) / animator.scale;
				y = (y - animator.dy) / animator.scale;
				return self.projection.invert(x, y);
			}
			var loc = invert(0, 0);
			var x0 = loc.x;
			var x1 = loc.x;
			var y0 = loc.y;
			var y1 = loc.y;

			function expand(x, y) {
				var v = invert(x, y);
				x0 = Math.min(v.x, x0);
				x1 = Math.max(v.x, x1);
				y0 = Math.min(v.y, y0);
				y1 = Math.max(v.y, y1);
			}
			// This calculation with "top" is designed to fix a bug
			// where we were missing particles at the top of the
			// screen with north winds. This is a short-term fix,
			// it's dependent on the particular projection and
			// region, and we should figure out a more general
			// solution soon.
			var top = -.2 * this.canvas.height;
			expand(top, this.canvas.height);
			expand(this.canvas.width, top);
			expand(this.canvas.width, this.canvas.height);
			this.x0 = Math.max(this.field.x0, x0);
			this.x1 = Math.min(this.field.x1, x1);
			this.y0 = Math.max(this.field.y0, y0);
			this.y1 = Math.min(this.field.y1, y1);
		}
		tick = 0;
		this.makeNewParticles(animator);
	};


	MotionDisplay.prototype.animate = function(animator) {
		this.moveThings(animator);
		this.draw(animator);
	}


	MotionDisplay.prototype.move = function(animator) {
		var w = this.canvas.width;
		var h = this.canvas.height;
		var g = this.canvas.getContext('2d');

		g.fillStyle = this.outsideColor;
		var dx = animator.dx;
		var dy = animator.dy;
		var scale = animator.scale;

		g.fillRect(0, 0, w, h);
		g.fillStyle = this.background;
		g.fillRect(dx, dy, w * scale, h * scale);
		var z = animator.relativeZoom();
		var dx = animator.dx - z * animator.dxStart;
		var dy = animator.dy - z * animator.dyStart;
		// g.drawImage(this.imageCanvas, dx, dy, z * w, z * h);
	};


	MotionDisplay.prototype.moveThings = function(animator) {
		/*控制地图绽放对速度的影响,百度地图等级都是2的指数倍*/
		var speed = .03 / (animator.zoom || 1);
		// speed = 0.005;
		for (var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			if (p.age > 0 && this.field.inBounds(p.x, p.y)) {
				var a = this.field.getValue(p.x, p.y);
				p.x += speed * a.x;
				p.y += speed * a.y;
				p.age--;
			} else {
				var p_new = this.makeParticle(animator);
				if(p_new){
					this.particles[i] = p_new;
				}
			}
		}
	};

	var draw_img_dir = (function(){
		var scale = 2;
		var width = 6*scale,
			height = 4*scale;
		var canvas_pattern = document.createElement('canvas');
		canvas_pattern.setAttribute('width',width);
		canvas_pattern.setAttribute('height',height);
		var ctx_pattern = canvas_pattern.getContext('2d');

		// ctx_pattern.rotate(Math.PI / 4);
		ctx_pattern.beginPath(); // 开始路径绘制
		ctx_pattern.moveTo(0, 1*scale);
		ctx_pattern.lineTo(0, 3*scale);
		ctx_pattern.lineTo(4*scale, 3*scale);
		ctx_pattern.lineTo(4*scale, 4*scale);
		ctx_pattern.lineTo(6*scale, 2*scale);
		ctx_pattern.lineTo(4*scale, 0);
		ctx_pattern.lineTo(4*scale, 1*scale);
		ctx_pattern.closePath();

		ctx_pattern.fill();
		ctx_pattern.save();
		var TO_RADIANS = Math.PI/180; 
		// document.body.appendChild(canvas_pattern);
		return function(ctx,x,y,option){
			var angle = option.angle;
			if(isNaN(angle)){
				return;
			}

			ctx.save();
			ctx.translate(x,y);
			ctx.rotate(angle);
			ctx_pattern.fillStyle = option.color || 'rgba(0,255,255,1)';
			ctx_pattern.fill();
			ctx.drawImage(canvas_pattern, width / 2 * (-1),height / 2 * (-1));
			ctx.restore();
		}
	})();
	MotionDisplay.prototype.draw = function(animator) {
		var g = this.canvas.getContext('2d');
		var w = this.canvas.width;
		var h = this.canvas.height;
		
		var zoom = animator.zoom || 1;
		if (this.first) {
			g.fillStyle = this.background;
			this.first = false;
		} else {
			g.fillStyle = this.backgroundAlpha;
		}
		g.fillStyle = 'rgba(40, 40, 40, 0.95)';
		var dx = animator.dx;
		var dy = animator.dy;
		var scale = animator.scale;
		var width = w * scale, 
			height = h * scale;
		var prev = g.globalCompositeOperation;
        g.globalCompositeOperation = "destination-in";

        g.fillRect(dx, dy, width, height);
        g.globalCompositeOperation = prev;
		// g.clearRect(dx, dy, w * scale, h * scale);
		
		var proj = new Vector(0, 0);
		var val = new Vector(0, 0);
		g.lineWidth = 1;
		for (var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			// p.x = 106.65410385127255;
			// p.y = 24.653452892573455;
			if (!this.field.inBounds(p.x, p.y)) {
				p.age = -2;
				continue;
			}
			this.projection.project(p.x, p.y, proj);
			proj.x = proj.x * scale + dx;
			proj.y = proj.y * scale + dy;
			// !! 这里会出现不连续现象，后续修复!!
			// // 处理顶部出现横向运动带
			// if(p.oldY == proj.y && p.y >= this.field.y0){
			// 	p.age = -2;
			// 	continue;
			// }
			if (proj.x < 0 || proj.y < 0 || proj.x > w || proj.y > h) {
				p.age = -2;
			}
			
			if (p.oldX != -1) { //not new
				var wind = this.field.getValue(p.x, p.y, val);
				// var s = wind.length() / this.maxLength;

				// var t = Math.floor(290 * (1 - s)) - 45;
				// if(t < 210){
					// var cha_x = proj.x-p.oldX;
					// var angle = 0;
					// if(cha_x == 0){
					// 	angle = (proj.y > p.oldY? 1: -1)*Math.PI/2;
					// }else{
					// 	if(proj.y == p.oldY){
					// 		angle = proj.x > p.oldX? 0: Math.PI;
					// 	}else{
					// 		angle = Math.atan((proj.y-p.oldY)/(proj.x-p.oldX));
					// 		if(proj.x < p.oldX){
					// 			angle += Math.PI;
					// 		}
					// 	}
					// }

					// draw_img_dir(g,p.oldX+(proj.x-p.oldX)/2,p.oldY+(proj.y-p.oldY)/2,{
					// 	angle: angle,
					// 	color: "hsl(" + t + ", 50%, 50%)"
					// });

					// var per = Math.min(Math.ceil(s * 255),100);
					// t = 200;
					// var _color = "hsl(" + (t) + ", 70%, 50%)";
					// var _color = "hsl(84, 228, "+(t*0.5)+")";
					// var _color = 'rgb(0,'+Math.ceil(s * 255)+',0)';
					// g.shadowColor = _color;
					// g.strokeStyle = _color;
					g.strokeStyle = '#1eddff';//'rgb(0, 100, 200)';
					g.beginPath();
					g.moveTo(proj.x, proj.y);
					g.lineTo(p.oldX, p.oldY);
					g.stroke();
				// }
			}
			p.oldX = proj.x;
			p.oldY = proj.y;
		}
	};


	// please don't hate on this code too much.
	// it's late and i'm tired.

	var MotionDetails = function(div, callout, field, projection, animator) {
		$(callout).fadeOut();
		var moveTime = +new Date();
		var calloutOK = false;
		var currentlyShowing = false;
		var calloutX = 0;
		var calloutY = 0;
		var calloutHTML = '';
		var lastX = 0;
		var lastY = 0;

		function format(x) {
			x = Math.round(x * 10) / 10;
			var a1 = ~~x;
			var a2 = (~~(x * 10)) % 10;
			return a1 + '.' + a2;
		}

		function minutes(x) {
			x = Math.round(x * 60) / 60;
			var degrees = ~~x;
			var m = ~~((x - degrees) * 60);
			return degrees + '&deg;&nbsp;' + (m == 0 ? '00' : m < 10 ? '0' + m : '' + m) + "'";
		}

		$(div).mouseleave(function() {
			moveTime = +new Date();
			calloutOK = false;
		});

		var pos = $(div).position();

		$(div).mousemove(function(e) {

			// TODO: REMOVE MAGIC CONSTANTS
			var x = e.pageX - this.offsetLeft - 60;
			var y = e.pageY - this.offsetTop - 10;
			if (x == lastX && y == lastY) {
				return;
			}
			lastX = x;
			lastY = y;
			moveTime = +new Date();
			var scale = animator.scale;
			var dx = animator.dx;
			var dy = animator.dy;
			var mx = (x - dx) / scale;
			var my = (y - dy) / scale;
			var location = projection.invert(mx, my);
			var lat = location.y;
			var lon = location.x;
			var speed = 0;
			if (field.inBounds(lon, lat)) {
				speed = field.getValue(lon, lat).length() / 1.15;
			}
			calloutOK = !!speed;
			calloutHTML = '<div style="padding-bottom:5px"><b>' +
				format(speed) + ' mph</b> wind speed<br></div>' +
				minutes(lat) + ' N, ' +
				minutes(-lon) + ' W<br>' +
				'click to zoom';

			calloutY = (pos.top + y) + 'px';
			calloutX = (pos.left + x + 20) + 'px';
		});

		setInterval(function() {
			var timeSinceMove = +new Date() - moveTime;
			if (timeSinceMove > 200 && calloutOK) {
				if (!currentlyShowing) {
					callout.innerHTML = calloutHTML;
					callout.style.left = calloutX;
					callout.style.top = calloutY;
					callout.style.visibility = 'visible';
					$(callout).fadeTo(400, 1);
					currentlyShowing = true;
				}
			} else if (currentlyShowing) {
				$(callout).fadeOut('fast');
				currentlyShowing = false;
			}
		}, 50);
	};
	/**
	 * Identity projection.
	 */
	var IDProjection = {
		project: function(x, y, opt_v) {
			var v = opt_v || new Vector();
			v.x = x;
			v.y = y;
			return v;
		},
		invert: function(x, y, opt_v) {
			var v = opt_v || new Vector();
			v.x = x;
			v.y = y;
			return v;
		}
	};
	function BMapProjection (map){
		this.map = map;
	}
	BMapProjection.prototype.project = function(lng, lat, opt_result){
		var map = this.map;
		// var pixel = map.getProjection().fromLatLngToPoint(new qq.maps.LatLng(lat, lng));
		var pixel = map.mapCanvasProjection.fromLatLngToContainerPixel(new qq.maps.LatLng(lat, lng));
		var x = pixel.getX(),
			y = pixel.getY();
		if (opt_result) {
			opt_result.x = x;
			opt_result.y = y;
			return opt_result;
		}
		return new Vector(x, y);
	}
	BMapProjection.prototype.invert = function(x, y) {
		var map = this.map;
		var point = map.mapCanvasProjection.fromContainerPixelToLatLng(new qq.maps.Point(x, y));
		// var point = map.getProjection().fromPointToLatLng(new qq.maps.Point(x, y), true);
		return new Vector(point.getLng(), point.getLat());
	}
	function isAnimating() {
		return true;
	}
	/* } 流场相关*/

	
	var field,// = VectorField.read(windData, true),
		render_delay = 100;//40,
		numParticles = 3000; // slowwwww browsers; 3500
	var mapAnimator;
	function initData(map){
		if(!field){
			return;
		}
		// log('initData');
		var bounds = map.getBounds(),
			sw_point = bounds.getSouthWest(),
			ne_point = bounds.getNorthEast(),
			sw = map.mapCanvasProjection.fromLatLngToContainerPixel(sw_point),
			ne = map.mapCanvasProjection.fromLatLngToContainerPixel(ne_point);
			// sw = map.getProjection().fromLatLngToPoint(sw_point),
			// ne = map.getProjection().fromLatLngToPoint(ne_point);
			// sw = map.lngLatToContainer(sw_point, map.getZoom()),
			// ne = map.lngLatToContainer(ne_point, map.getZoom());
		var x = sw.getX(),
			y = ne.getY(),
			width = $map.width(),
			height = $map.height();
			// size = map.getSize(),
			// width = size.width,
			// height = size.height;

		
		var new_field = VectorField.split(field, sw_point.getLng(), ne_point.getLat(), ne_point.getLng(), sw_point.getLat());
		

		var map_projection = new BMapProjection(map);
		function initDisplay(){
			var canvas = $('<canvas width='+width+' height='+height+' class="layer_vector">').css({
				left: 0,
				top: 0
			}).appendTo($container_layer).get(0);
			var ctx = canvas.getContext('2d');
			var imageCanvas = canvas;
	    
		    var scale = Math.pow(2,map.getZoom() - 4);
		    
		    var display = new MotionDisplay(canvas, imageCanvas, new_field, Math.min(numParticles, numParticles*width/1000, numParticles*height/800), map_projection);
		 	mapAnimator = new Animator();
		 	mapAnimator.zoom = scale;
		 	mapAnimator.animFunc = isAnimating
			mapAnimator.add(display);
			mapAnimator.start(render_delay);
		}
		setTimeout(function(){
			_createMask(width, height, new_field, map_projection, initDisplay);
		}, 500);
		// initDisplay();
		
	}
	var _createMask = (function(){
		var TRANSPARENT_BLACK = [0, 0, 0, 0]; 		// singleton 0 rgba
		var OVERLAY_ALPHA = Math.floor(0.4*255);  	// overlay transparency (on scale [0, 255])
		var data, _width, _height, _grid;
		var _isVisible = function(x, y) {
            var i = (y * _width + x) * 4;
            return data[i + 3] > 0;  // non-zero alpha means pixel is visible
        }
        var _set = function(x, y, rgba){
        	var i = (y * _width + x) * 4;
            data[i    ] = rgba[0];
            data[i + 1] = rgba[1];
            data[i + 2] = rgba[2];
            data[i + 3] = rgba[3];
        }
        function _bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
	        var rx = (1 - x);
	        var ry = (1 - y);
	        var a = rx * ry,  b = x * ry,  c = rx * y,  d = x * y;
	        var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
	        var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
	        return [u, v, Math.sqrt(u * u + v * v)];
	    }
	    function _floorMod(a, n) {
	        var f = a - n * Math.floor(a / n);
	        // HACK: when a is extremely close to an n transition, f can be equal to n. This is bad because f must be
	        //       within range [0, n). Check for this corner case. Example: a:=-1e-16, n:=10. What is the proper fix?
	        return f === n ? 0 : f;
	    }
	    function _isValue(x) {
	        return x !== null && x !== undefined;
	    }
	    function _translat(g){
	    	return [g.x, g.y];
	    }
	    function _getVal(i, j){
	    	var row = _grid[i];
	    	if(_isValue(row)){
	    		var column = row[j];
	    		if(_isValue(column)){
	    			return _translat(column);
	    		}
	    	}
	    }
	    var λ0, φ0, Δλ, Δφ, dH;
	    function _interpolate(λ, φ) {
            var i = _floorMod(λ - λ0, 360) / Δλ;  // calculate longitude index in wrapped range [0, 360)
            // var i = (λ - λ0) / Δλ;
            var j = dH - (φ0 - φ) / Δφ;                 // calculate latitude index in direction +90 to -90

            //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
            //        fi  i   ci          four points "G" that enclose point (i, j). These points are at the four
            //         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
            //      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
            //    j ___|_ .   |           (1, 9) and (2, 9).
            //  =8.3   |      |
            //      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
            //         |      |           column, so the index ci can be used without taking a modulo.

            var fi = Math.floor(i), ci = fi + 1;
            var fj = Math.floor(j), cj = fj + 1;

            var column;
            if((column = _grid[fi])){
            	var g00 = column[fj],
            		g01 = column[cj];
            	if(_isValue(g00) && _isValue(g01) && (column = _grid[ci])){
            		g00 = _translat(g00);
                	g01 = _translat(g01);
                	var g10 = column[fj],
                		g11 = column[cj];
                	if (_isValue(g10) && _isValue(g11)) {
                		g10 = _translat(g10);
	                    g11 = _translat(g11);
	                    var return_val = _bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
	                    return return_val;
                	}	
            	}
            }

            return null;
        }
        function _distortion(projection, λ, φ, x, y) {
	        var hλ = λ < 0 ? H : -H;
	        var hφ = φ < 0 ? H : -H;
	        // var pλ = projection([λ + hλ, φ]);
	        // var pφ = projection([λ, φ + hφ]);
	        var pλ = projection.project(λ + hλ, φ);
	        var pφ = projection.project(λ, φ + hφ);

	        // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1° λ
	        // changes depending on φ. Without this, there is a pinching effect at the poles.
	        var k = Math.cos(φ / 360 * τ);

	        return [
	            (pλ.x - x) / hλ / k,
	            (pλ.y - y) / hλ / k,
	            (pφ.x - x) / hφ,
	            (pφ.y - y) / hφ
	        ];
	    }
        function _distort(projection, λ, φ, x, y, scale, wind) {
	        var u = wind[0] * scale;
	        var v = wind[1] * scale;
	        var d = _distortion(projection, λ, φ, x, y);

	        // Scale distortion vectors by u and v, then add.
	        wind[0] = d[0] * u + d[2] * v;
	        wind[1] = d[1] * u + d[3] * v;
	        return wind;
	    }

	    var BOUNDARY = 0.45;
	    var τ = 2 * Math.PI;
    	var H = 0.0000360;  // 0.0000360°φ ~= 4m
	    function _sinebowColor(hue, a) {
	        // Map hue [0, 1] to radians [0, 5/6τ]. Don't allow a full rotation because that keeps hue == 0 and
	        // hue == 1 from mapping to the same color.
	        var rad = hue * τ * 5/6;
	        rad *= 0.75;  // increase frequency to 2/3 cycle per rad

	        var s = Math.sin(rad);
	        var c = Math.cos(rad);
	        var r = Math.floor(Math.max(0, -c) * 255);
	        var g = Math.floor(Math.max(s, 0) * 255);
	        var b = Math.floor(Math.max(c, 0, -s) * 255);
	        return [r, g, b, a];
	    }
	    function _colorInterpolator(start, end) {
	        var r = start[0], g = start[1], b = start[2];
	        var Δr = end[0] - r, Δg = end[1] - g, Δb = end[2] - b;
	        return function(i, a) {
	            return [Math.floor(r + i * Δr), Math.floor(g + i * Δg), Math.floor(b + i * Δb), a];
	        };
	    }
	    // log(_sinebowColor(1.0, 0));
	    var _fadeToWhite = _colorInterpolator(_sinebowColor(1.0, 0), [255, 255, 255]);
	    function _extendedSinebowColor(i, a) {
	        return i <= BOUNDARY ?
	            _sinebowColor(i / BOUNDARY, a) :
	            _fadeToWhite((i - BOUNDARY) / (1 - BOUNDARY), a);
	    }
	    function _gradient(v, a){
	    	return _extendedSinebowColor(Math.min(v, 100) / 100, a);
	    }
	    var $progress = $('#progress');
	    var tt_run;
	    var tt_run_arr = [];
		return function(width, height, field, projection, cb){
			$('.layer_vector').remove();
			var $moveElement = $('[n=moveElement]');
			if(!$container_layer){
				$container_layer = $('<div style="position:absolute;left:0px;top:0px">').appendTo($moveElement);
			}
			var transform = $moveElement.css('transform');
			var m = /matrix\([-.\d]+, [-.\d]+, [-.\d]+, [-.\d]+, ([-.\d]+), ([-.\d]+)\)/.exec(transform);
			if(m){
				$container_layer.css({
					width: width,
					height: height,
					left: -parseFloat(m[1]),
					top: -parseFloat(m[2])
				});
			}
			var time_create_mask = 0,
				date_create_mask = new Date();
			// log(field);
			_width = width;
			_height = height;
			_grid = field.field;
			dH = field.h;
			λ0 = field.x0, φ0 = field.y1;
			Δλ = (field.x1 - field.x0)/field.w, Δφ = (field.y1 - field.y0)/dH;
			// log(λ0, φ0, Δλ, Δφ);
			var canvas = $('<canvas width='+width+' height='+height+' class="layer_vector layer_mask">').css({
				left: 0,
				top: 0
			}).appendTo($container_layer).get(0);
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = "rgba(255, 0, 0, 1)";
	        ctx.fill();
	        // d3.select("#display").node().appendChild(canvas);  // make mask visible for debugging

	        var imageData = ctx.getImageData(0, 0, width, height);
	        data = imageData.data;  // layout: [r, g, b, a, r, g, b, a, ...]

	        var velocityScale = 1;
	        var step = 2;
	        function _getColor(wind){
	        	var MAX_WIND = 20;
	        	var opacity = Math.min(wind[2]/MAX_WIND, 1);
	        	return [255, 255, 255, opacity*255];
	        }
	        var time_invert = 0,
	        	time_interpolate = 0,
	        	time_color = 0,
	        	time_set = 0,
	        	time_putdata = 0;
	        var prev_x = -900;
	        function setY(x){
	        	for(var y = 0;y<height;y+=step){
	        		var color = TRANSPARENT_BLACK;
	        		
	        		var date_invert = new Date();
	        		var coord = projection.invert(x, y);
	        		time_invert += (new Date() - date_invert);
	        		if(coord){
	        			var date_interpolate = new Date();
	        			var λ = coord.x, φ = coord.y;
	        			// if(-160 <= λ && λ <= 160){
	        				// prev_x = λ;
		        			var wind = _interpolate(λ, φ);
		        			if(wind){
			        			color = getWindColor(wind[2], 1, 1);
			        		}
		        		// }
	        			// var scalar = null;
	        			// if(wind){
	        			// 	// wind = _distort(projection, λ, φ, x, y, velocityScale, wind);
	        			// 	scalar = wind[2];
	        			// }
	        			// time_interpolate += (new Date() - date_interpolate);
	        			// if(_isValue(scalar)){
	        			// 	var date_color = new Date();
	        			// 	color = _gradient(scalar, OVERLAY_ALPHA);
	        			// 	// console.log(wind, color);
	        			// 	time_color += (new Date() - date_color);
	        			// }
	        		}
	        		if(color != TRANSPARENT_BLACK){
	        			var date_set = new Date();
		        		_set(x, y, color);
		        		_set(x+1, y, color);
		        		_set(x, y+1, color);
		        		_set(x+1, y+1, color);
		        		time_set += (new Date() - date_set);
	        		}
	        	}

	        	var p = (x)/width*100;
	        	p = p.toFixed(1);
	        	$progress.width(p+'%');
	        	// if(--dealingNum == 0){
	        	// 	ctx.putImageData(imageData, 0, 0);
	        	// 	log('create mask');
	        	// }
	        	clearTimeout(tt_run);
	        	if(--dealingNum <= 0){
	        		var date_putdata = new Date();
	        		ctx.putImageData(imageData, 0, 0);
	        		$progress.width(0);

	        		log('time_invert = '+time_invert);
	        		log('time_interpolate = '+time_interpolate);
	        		log('time_color = '+time_color);
	        		log('time_set = '+time_set);
	        		log('time_putdata = '+(new Date() - date_putdata));
	        		log('time_create_mask = '+(new Date() - date_create_mask));

	        		cb && cb();
	        	}
	        }
	        var runningNum = width;
	        setY(runningNum-step);

	        for(var i = 0, j = tt_run_arr.length; i<j; i++){
	        	clearTimeout(tt_run_arr[i]);
	        }
	        tt_run_arr = [];
	        var dealingNum = 0;
	        for(var x = 0;x<width;x+=step){
	        	(function(x_inner){
	        		dealingNum++;
	        		var t = setTimeout(function(){
		        		setY(x_inner);
		        	}, x);
		        	tt_run_arr.push(t);
	        	})(x);
	        }
		}
	})();
	
	var $map = $('#map');
	var $container_layer;
	function initMap(){
		
		var map = new qq.maps.Map(document.getElementById("map"), {
	        // 地图的中心地理坐标。
	        center: new qq.maps.LatLng(34.899005, 104.408836),
	        mapTypeId: qq.maps.MapTypeId.SATELLITE,
	        minZoom: 3,
        	maxZoom: 8,
        	zoom: 4
	    });
	    // 百度地图的瓦片编码和其它的不一样，这里暂时没有叠加上
	    // var baiduTileOpts = {
	    //     alt: "baidu",
	    //     name: "baidu",
	    //     tileSize: new qq.maps.Size(256,256),
	    //     maxZoom: 19,
	    //     minZoom: 1,
	    //     getTileUrl: function(title, zoom){
     //    		// return 'http://api0.map.bdimg.com/customimage/tile?&x='+title.x+'&y='+title.y+'&z='+zoom+'&udt=20150601&styles=t%3Aland%7Ce%3Aall%7Cc%3A%231c3289%2Ct%3Aboundary%7Ce%3Aall%7Cc%3A%236b9ecc%2Ct%3Aroad%7Ce%3Aall%7Cv%3Aoff%2Ct%3Awater%7Ce%3Aall%7Cc%3A%233075c5%2Ct%3Aadministrative%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%231c3289%7Cw%3A0.1%2Ct%3Alabel%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%23ffffff';
     //    		return 'http://online1.map.bdimg.com/tile/?qt=tile&x='+title.x+'&y='+title.y+'&z='+zoom+'&styles=pl&udt=20150605&scaler=1';
     //    	}
	    // };
	    // var baiduTile = new qq.maps.ImageMapType(baiduTileOpts);
	    // map.mapTypes.set('baidu',baiduTile);
    	// map.set('mapTypeId','baidu');

    	//获取谷歌图层地址url
	    var _getTileUrl = function(tile, zoom){
	        var x = tile.x,
	            y = tile.y;
	        var tileUrl = 'http://{s}.google.cn/vt/lyrs=m@159000000&'+
	            'hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Gali',
	            tileSubdomains = ['mt0', 'mt1', 'mt2', 'mt3'];
	        var tileUrl = 'http://www.google.cn/maps/vt?lyrs=s@174&gl=cn&x={x}&y={y}&z={z}';
	        var test_v = Math.pow(2, zoom);
			if(x < 0){
				x = test_v + x;
			}else{
				x = x % test_v;
			}
	        tileUrl = tileUrl.replace(/\{x\}/, x);
	        tileUrl = tileUrl.replace(/\{y\}/, y);
	        tileUrl = tileUrl.replace(/\{z\}/, zoom);

	        var s = tileSubdomains[Math.floor(Math.random()*4)];
	        tileUrl = tileUrl.replace(/\{s\}/, s);

	        return tileUrl;
	    };

	    var googleTileOpts = {
	        alt:"google",
	        name:"google",
	        tileSize:new qq.maps.Size(256,256),
	        maxZoom:19,
	        minZoom:1,
	        getTileUrl:_getTileUrl
	    };
	    var googleTile = new qq.maps.ImageMapType(googleTileOpts);
	    map.mapTypes.set('google',googleTile);
    	map.set('mapTypeId','google');
	    // var label = new qq.maps.Label({
	    //     offset:new qq.maps.Size(15,0)
	    // });
	    // qq.maps.event.addListener(map,"mousemove",function(e){
	    //     label.setContent(e.latLng.toString());
	    //     label.setPosition(e.latLng);
	        
	    // });
	    // qq.maps.event.addListener(map,"mouseover",function(e){
	    //     label.setMap(map);
	    // });
	    // qq.maps.event.addListener(map,"mouseout",function(e){
	    //     label.setMap(null);
	    // });
		var delay_check = 100;
		var top_control = $('#top_nav').height();
		function resetControl(){
			var $smnoprint = $('.smnoprint');
			if($smnoprint.length > 0){
				$smnoprint.css({
					top: top_control
				});
				setTimeout(function(){
					if($smnoprint.position().top != top_control){
						setTimeout(resetControl, delay_check);
					}else{
						$smnoprint.css({
							opacity: 1
						});
					}
				}, delay_check);
			}else{
				setTimeout(resetControl, delay_check);
			}
		}
		resetControl();

		qq.maps.event.addListener(map, 'dragstart', dragendOrZoomstart);
		qq.maps.event.addListener(map, 'drag', drag);
		// // qq.maps.event.addListener(map, 'zoomstart', dragendOrZoomstart);
		// qq.maps.event.addListener(map, 'dragend', dragendOrZoomend);
		// qq.maps.event.addListener(map, 'zoomend', dragendOrZoomend);
		
		qq.maps.event.addListener(map, 'zoom_changed', function(){
			dragendOrZoomstart();
			drag();
		});
		global.map = map;

	    var canvasOverlay;
	    var tt_dragend;
	    var tt_initdata;
	    function dragendOrZoomend(){
	    	resetControl();
	    	clearTimeout(tt_dragend);
	    	clearTimeout(tt_initdata);
	    	tt_initdata = setTimeout(function(){
	    		if(mapAnimator){
		    		mapAnimator.stop();
		    	}
		    	$map.find('.layer_vector').remove();
	        	initData(map);
	        }, 30);
	    }
	    var tt_dzstart;
	    function dragendOrZoomstart(){
	    	clearTimeout(tt_dzstart);
	    	tt_dzstart = setTimeout(function(){
	    		// log('start');
		    	if(mapAnimator){
		    		mapAnimator.stop();
		    	}
		    	$map.find('.layer_vector').remove();
		    	
	    	}, 30);
	    }
	    function drag(){
	    	clearTimeout(tt_dragend);
	    	tt_dragend = setTimeout(function(){
	    		dragendOrZoomend();
	    	}, 50);
	    }
	    var tt_resize;
	    $(window).on('resize', function(){
	    	dragendOrZoomstart();
	    	clearTimeout(tt_resize);
	    	tt_resize = setTimeout(function(){
	    		dragendOrZoomend();
	    	}, 10);
	    });
	}
	initMap();

	function getType(){
		var hour = new Date().getHours();
		var compare_hour = hour >= 8 && hour < 20? 8: 20;
		var type = 12+Math.floor((hour - compare_hour)/3)*3+'';
		for(var i = type.length;i<3;i++){
			type = '0'+ type;
		}
		return type;
	}
	global.getWind = function(lng, lat){
		if(field){
			return field.getValue(lng, lat);
		}
	}
	

	function _getAjax(url_format, dataType){
		var ajax_date;
		return function(){
			var args = [].slice.call(arguments);
			var len = args.length;
			var callback;
			if(len > 0){
				var cb = args[len - 1];
				if($.isFunction(cb)){
					callback = cb;
				}
			}
			
			var date = new Date();
			var url = url_format.apply(null, args);
			var $ajax = $.ajax({
				url: url,
				dataType: dataType || 'jsonp',
				jsonp: '_cb',
				success: function(data){
					// log(data, $ajax.date != ajax_date);
					if($ajax.date != ajax_date){
						return;
					}
					callback && callback(data);
				},
				error: function(e){
					// log(arguments);
					alert('数据加载出现错误，请重试！');
				}
			});
			$ajax.date = ajax_date = date;
		}
	}
	var url_data = 'http://10.14.85.116/php/wind/data.php';
	global.loadWind = (function(){
		var $loading_windspeed = $('#loading_windspeed');
		var cb = function(data){
			field = VectorField.read(data, true);
			$loading_windspeed.hide();
			initData(map);
		}
		var _loadwind = _getAjax(function(){
			return url_data+'?_name=micapsdata&vti='+getType()+'&type=1000';
		});
		return function(){
			$loading_windspeed.show();
			_loadwind(cb);
			// cb(windData);
		}
	})();
	global.loadWindSpeed = _getAjax(function(lon, lat, callback){
		// return 'http://10.14.85.116/php/wind/data.php?_name=historywindspeed&lon='+lon+'&lat='+lat;
		return url_data+'?_name=micapswind&type=1000&lon='+lon+'&lat='+lat;
	});
	global.loadAir = _getAjax(function(lon, lat, callback){
		return url_data+'?_name=micapsvalue&lon='+lon+'&lat='+lat+'&vti=024,048,072&type=zhyb';
	});
	global.loadXSC = (function(){
		var _cb = function(data){
			initMicapsLine(map, data);
		}
		var _load = _getAjax(function(){
			return url_data+'?_name=micapsdata&vti=000&type=h000';
		});
		return function(){
			_load(_cb);
		}
	})();
}(this);