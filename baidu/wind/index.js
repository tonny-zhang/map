!function(){
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
		// window.console.log('total = ' + total);
		// window.console.log('weight = ' + weight);
		if (total && weight) {

			result.averageLength = total / weight;
		}
		// console.log(result);
		return result;
	};
VectorField.split = function(vectorField,x0,y0,x1,y1){
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
		this.rgb = '40, 40, 40'; //background color
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
			this.particles.push(this.makeParticle(animator));
		}
	};

	//makes random particle within bounds of canvas
	MotionDisplay.prototype.makeParticle = function(animator) {
		var dx = animator ? animator.dx : 0; //speed?
		var dy = animator ? animator.dy : 0; //speed?
		var scale = animator ? animator.scale : 1; //scale of orig graph
		for (;;) { //infinite loop

			var a = Math.random(); //0-1
			var b = Math.random(); //0-1
			// a  = 0.5,b = 0.5;
			var x = a * this.x0 + (1 - a) * this.x1;
			var y = b * this.y0 + (1 - b) * this.y1;
			// return new Particle(x, y, 1 + 40 * Math.random());
			if (this.field.maxLength == 0) {
				return new Particle(x, y, 1 + 40 * Math.random());
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
					return new Particle(x, y, 1 + 40 * Math.random());
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
		var speed = .01 / (animator.zoom || 1);
		// speed = 0.005;
		for (var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			if (p.age > 0 && this.field.inBounds(p.x, p.y)) {
				var a = this.field.getValue(p.x, p.y);
				p.x += speed * a.x;
				p.y += speed * a.y;
				p.age--;
			} else {
				this.particles[i] = this.makeParticle(animator);
			}
		}
	};

	var draw_img_dir = (function(){
		var scale = 1;
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
		var dx = animator.dx;
		var dy = animator.dy;
		var scale = animator.scale;
		var width = w * scale, 
			height = h * scale;
		g.clearRect(dx, dy, w * scale, h * scale);
		// g.fillRect(dx, dy, width, height);
		var proj = new Vector(0, 0);
		var val = new Vector(0, 0);
		g.lineWidth = 3;
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
			if (proj.x < 0 || proj.y < 0 || proj.x > w || proj.y > h) {
				p.age = -2;
			}
			if (p.oldX != -1) { //not new
				var wind = this.field.getValue(p.x, p.y, val);
				var s = wind.length() / this.maxLength;

				var t = Math.floor(290 * (1 - s)) - 45;

				var cha_x = proj.x-p.oldX;
				var angle = 0;
				if(cha_x == 0){
					angle = (proj.y > p.oldY? 1: -1)*Math.PI/2;
				}else{
					if(proj.y == p.oldY){
						angle = proj.x > p.oldX? 0: Math.PI;
					}else{
						angle = Math.atan((proj.y-p.oldY)/(proj.x-p.oldX));
					}
				}

				draw_img_dir(g,p.oldX+(proj.x-p.oldX)/2,p.oldY+(proj.y-p.oldY)/2,{
					angle: angle,
					color: "hsl(" + t + ", 50%, 50%)"
				});
				// g.strokeStyle = "hsl(" + t + ", 50%, 50%)";
				// // g.strokeStyle = 'rgba(0,'+t+',0,1)';
				// g.beginPath();
				// g.moveTo(proj.x, proj.y);
				// g.lineTo(p.oldX, p.oldY);
				// g.stroke();
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
	BMapProjection.prototype.project = function(lon, lat, opt_result){
		var map = this.map;
		var pixel = map.pointToPixel(new BMap.Point(lon, lat) );
		var x = pixel.x,
			y = pixel.y;
		if (opt_result) {
			opt_result.x = x;
			opt_result.y = y;
			return opt_result;
		}
		return new Vector(x, y);
	}
	BMapProjection.prototype.invert = function(x, y) {
		var map = this.map;
		var point = map.pixelToPoint(new BMap.Pixel(x,y));
		return new Vector(point.lng,point.lat);
	}
	function isAnimating() {
		return true;
	}
	/* } 流场相关*/

	
	var field = VectorField.read(windData, true),
		render_delay = 100,
		numParticles = 1000; // slowwwww browsers; 3500
	var mapAnimator;
	function initData(map){

		var bounds = map.getBounds(),
			sw_point = bounds.getSouthWest(),
			ne_point = bounds.getNorthEast(),
			sw = map.pointToPixel(sw_point),
			ne = map.pointToPixel(ne_point);
		var x = sw.x,
			y = ne.y,
			size = map.getSize(),
			width = size.width,
			height = size.height;
		
		var canvas = $('<canvas width='+width+' height='+height+' class="layer_vector">').css({
			left: 0,
			top: 0
		}).appendTo($('#map .BMap_mask')).get(0);
		var imageCanvas = canvas;

	    var map_projection = new BMapProjection(map);
	    var scale = Math.pow(2,map.getZoom() - 4);
	    var new_field = VectorField.split(field,sw_point.lng,ne_point.lat,ne_point.lng,sw_point.lat);
	    var display = new MotionDisplay(canvas, imageCanvas, new_field, numParticles, map_projection);
	 //    display.background = "rgba(255,255,255,1)"
		// display.backgroundAlpha = "rgba(255,255,255,1)"

	 	mapAnimator = new Animator();
	 	mapAnimator.zoom = scale;
	 	mapAnimator.animFunc = isAnimating
		mapAnimator.add(display);
		mapAnimator.start(render_delay);
	}
	function init(){
		var $map = $('#map');
		// var map = new BMap.Map("map");
		var tileLayer = new BMap.TileLayer,
			map_url = 'http://map.yuce.baidu.com/tile4/?qt=tile&udt=20141224';
		tileLayer.getTilesUrl = function(t, e) {
			var o = map_url + "&x=" + t.x + "&y=" + t.y + "&z=" + e + "&styles=pl";
			return o
		};
		var map_type = new BMap.MapType("线下测试", tileLayer);
		var map = new BMap.Map("map", {
			enable3DBuilding: !1,
			vectorMapLevel: 99,
			mapType: map_type
		});

		map.setMapStyle({
			features: ["road", "building", "water", "land"],
			style: "dark"
		});
	    var currentZoom = 5;
	    map.setMinZoom(4);
	    map.setMaxZoom(9);
	    map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
	    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
	    map.centerAndZoom(new BMap.Point(104.408836,34.899005), currentZoom);
	    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
	    map.addControl(new BMap.ScaleControl());                    // 添加默认比例尺控件
	    // map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]}));     //2D图，卫星图
	    map.addControl(new BMap.MapTypeControl({type: BMAP_MAPTYPE_CONTROL_DROPDOWN,anchor: BMAP_ANCHOR_TOP_RIGHT}));    //左上角，默认地图控件
		map.addEventListener("dragend", dragendOrZoomend);
	    map.addEventListener("zoomend", dragendOrZoomend);
	    map.addEventListener("dragstart", dragendOrZoomstart);
	    map.addEventListener("zoomstart", dragendOrZoomstart);
	    var canvasOverlay;
	    function dragendOrZoomend(){
	        initData(map);
	    }
	    function dragendOrZoomstart(){
	    	if(mapAnimator){
	    		mapAnimator.stop();
	    	}
	    	$map.find('.layer_vector').remove();
	    }
	    
		// initData(map);
		// var legendAnimator = new Animator(null, isAnimating);
		// var speedScaleFactor = 20 / 1.15;
		// var legendSpeeds = [1, 3, 5, 10, 15, 30];
		// for (var i = 1; i <= legendSpeeds.length; i++) {
		// 	var c = document.getElementById('legend' + i);
		// 	var legendField = VectorField.constant(
		// 		legendSpeeds[i - 1] * speedScaleFactor, 0, 0, 0, c.width, c.height);
		// 	var legend = new MotionDisplay(c, null, legendField, 30);
		// 	// normalize so colors correspond to wind map's maximum length!
		// 	legend.maxLength = field.maxLength * speedScaleFactor;
		// 	legendAnimator.add(legend);
		// }
		// legendAnimator.start(40);
	}
	init();
}();