!function(global){
	var CONSTANT,
		COLOR_PRECIPITATION,
		COLOR_LINE;
	var $svg_defs;
	var map;

	var callback_data = function(_map,data){
		global.data = data;
		map = _map;
		var areas = data.areas;
		$.each(areas,function(i_outer,v_outer){
			(function(i,v){
				var point_arr = [];
				$.each(v.items,function(v_i,v_v){

					var point = new BMap.Point(v_v.x,v_v.y);
					point_arr.push(point);
				});
				var symbols = v.symbols;
				// var Color = ['red','blue','green','#123','#f26','#ccc','#333'];
				// var radom_color = Color[Math.floor(Math.random()*Color.length)];
				var color = getPrecipitationColor(v.code,symbols?symbols.text:0);
				var polygon = new BMap.Polygon(point_arr, {strokeColor: color, fillColor: color,fillOpacity: 0.9, strokeWeight: 1, strokeOpacity:1});
				map.addOverlay(polygon);   //增加面
				setTimeout(_add_svg_pattern,10);
			})(i_outer,v_outer);
		});
		var lines = data.lines;		
		$.each(lines,function(i,v){
			var point_arr = [];
			var points = v.point;
			if(points.length >= 2){
				$.each(points,function(p_i,p_v){
					var point = new BMap.Point(p_v.x, p_v.y);
					point_arr.push(point);
				});
				var polyline = new BMap.Polyline(point_arr, {strokeColor:"rgb(100, 195, 201)", strokeWeight: v.weight||1, strokeOpacity:0.5});
				map.addOverlay(polyline);   //增加折线
			}
			var flags = v.flags;
			if(flags && flags.items && flags.items.length > 0){
				var text = flags.text;
				$.each(flags.items,function(i,v){
					var label = new BMap.Label(text, {
						position: new BMap.Point(v.x,v.y),
						offset: new BMap.Size(-17, -10)
					});  // 创建文本标注对象
					label.setStyle({
						 color : "rgb(0, 178, 191)",
						 fontSize : "12px",
						 height : "20px",
						 lineHeight : "20px",
						 fontFamily:"微软雅黑",
						 width: '34px',
						 textAlign: 'center',
						 border: 'none',
						 background: 'none'
					 });
					map.addOverlay(label);
				});
			}
		});

		var symbols = data.symbols;
		$.each(symbols,function(i,v){
			var type = v.type;
			// if(type == 3 || type == 4){
			// 	var marker = new BMap.Marker(new BMap.Point(v.x,v.y));
			// 	marker.addEventListener("click",function(){
			// 		var p = marker.getPosition();  //获取marker的位置
			// 		alert(v.flag+" "+" marker的位置是" + p.lng + "," + p.lat);    
			// 	});
			// 	map.addOverlay(marker);
			// 	return ;
			// }
			var text = '',
				color = '#1010FF';
			var style = {
				 color : color,
				 fontSize : "30px",
				 height : "20px",
				 lineHeight : "20px",
				 fontFamily:"微软雅黑",
				 width: '34px',
				 textAlign: 'center',
				 border: 'none',
				 background: 'none'
			};
			if('60' == type){
				text = 'H';
				color = 'red';
			}else if('61' == type){
				text = 'L';
			}else if('37' == type){
				text = '台';
				color = 'green';
			}
			else if(23 == type || 24 == type || 26 == type || 48 == type){// 处理雨雪的极值
				text = v.text;
				if(text == 0){
					return;
				}
				style.fontSize = '20px';
				style.fontShadow = '0 0 3px white';
				color = 'black';
			}
			// else{//测试特殊点标识
			// 	color = 'black';
			// 	text = type;
			// }
			style.color = color;
			var label = new BMap.Label(text, {
				position: new BMap.Point(v.x,v.y),
				offset: new BMap.Size(-17, -10)
			});  // 创建文本标注对象
			label.setStyle(style);
			map.addOverlay(label);
		});

		var line_symbols = data.line_symbols;
		if(line_symbols){
			$.each(line_symbols,function(i,v){
				var point_arr = [];
				draw_line_symbols_flag(v.code,v.items,i);
				$.each(v.items,function(v_i,v_v){
					var point = new BMap.Point(v_v.x, v_v.y);
					point_arr.push(point);
					// setTimeout(function(){
					// 	var marker = new BMap.Marker(point);
					// 	marker.addEventListener("click",function(){
					// 		var p = marker.getPosition();  //获取marker的位置
					// 		alert(" marker的位置是" + p.lng + "," + p.lat);    
					// 	});
					// 	map.addOverlay(marker);
					// },v_i*200);
				});
				var polyline = new BMap.Polyline(point_arr, {strokeColor: getLineColor(v.code), strokeWeight: v.weight || 1, strokeOpacity: 1});
				map.addOverlay(polyline);   //增加折线
			});
		}
	};

	function Icon_Layer(point,radiu,cName){
		BMap.Overlay.apply(this,arguments);
		this.point = point;
		this.radiu = radiu;
		this.cName = cName;
		var div = document.createElement('div');
		this._div = div;
		div.className = this.cName;
		div.innerHTML = '<div></div>';

		$(div).find('div').css({
			transform: 'rotate('+this.radiu+'deg)'
		});
	}
	Icon_Layer.constructor = Icon_Layer;
	Icon_Layer.prototype = new BMap.Overlay();
	Icon_Layer.prototype.initialize = function(map){
		this._map = map;
		map.getPanes().labelPane.appendChild(this._div);
		return this._div;
	}
	Icon_Layer.prototype.getDiv = function(){
		return this._div;
	}
	Icon_Layer.prototype.draw = function(){
		var map = this._map;
		var pixel = map.pointToOverlayPixel(this.point);
		this._div.style.left = pixel.x + "px";
		this._div.style.top  = pixel.y + "px";
	}

	var NUM_SPAN_SYMBOL = 5,
		NUM_SYMBOL_ENDPOINT = 5,
		NUM_SYMBOL_OF_TWO_SYMBOL = 20;
	function draw_line_symbols_flag(code,items,index){
		if(code == 2 || code == 3){
			var len_condition = items.length-NUM_SYMBOL_ENDPOINT;
			for(var i_o = NUM_SYMBOL_ENDPOINT;i_o<len_condition;i_o+=NUM_SYMBOL_OF_TWO_SYMBOL){
				var items_span = items.slice(i_o,i_o+NUM_SPAN_SYMBOL);
				// console.log(index,i_o,items.length,items_span.length);
				if(items_span.length == NUM_SPAN_SYMBOL){
					var point_arr = [];
					var a =  items_span[0],
						b = items_span[items_span.length - 1];
					var x1 = a.x,y1 = a.y,
						x2 = b.x,y2 = b.y;
					var dist = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
					var x,y;
					var max_x = Math.max(x1,x2),
						max_y = Math.max(y1,y2);
					if(code == 2){
						if(x1 == x2){
							// console.log(11);
							x = max_x + Math.abs(dist * Math.cos(Math.PI/4));
							y = max_y - Math.abs((y1-y2)/Math.sin(Math.PI/4));
						}else if(y1 == y2){
							// console.log(12);
							x = max_x + Math.abs((x1 - x2)/Math.sin(Math.PI/4));
							y = max_y - Math.abs(dist * Math.cos(Math.PI/4));
						}else{
							dist *= Math.sin(Math.PI/4);
							var radiu = 3/4 * Math.PI - Math.atan((y1-y2)/(x1-x2));
							var cha_x = Math.abs(dist * Math.cos(radiu));
							
							// x = 135-radiu/Math.PI*180 < 0? max_x + cha_x: max_x - cha_x; 
							x = max_x + cha_x; 
							y = max_y - Math.abs(dist * Math.sin(radiu));
						}
						items_span.push({
							x: x + dist* 0.35,
							y: y + dist* 0.08
						});
					}else if(code == 3){
						var middle_x = x2+(x1-x2)/2,
							middle_y = y2+(y1-y2)/2;
						// setTimeout(function(){
							// var marker = new BMap.Marker(new BMap.Point(middle_x, middle_y));
							// marker.addEventListener("click",function(){
							// 	var p = marker.getPosition();  //获取marker的位置
							// 	alert(i+" marker的位置是" + p.lng + "," + p.lat);    
							// });
							// map.addOverlay(marker);
						// },400);
						var r = dist / 2;
						var start_radiu = 0;
						if(x1 == x2){
							start_radiu = 90;
						}else if(y1 == y2){
							start_radiu = 0;
						}else{
							start_radiu = Math.atan((y1-y2)/(x1-x2))/Math.PI*180;
						}
						var arr = [];
						
						var _index = 0;
						for(var i = 0;i<180;i++){
							var radiu = -(i+start_radiu) * Math.PI/180;
							// console.log(_index++,index,i,len,radiu);
							var cha_x = r * Math.cos(radiu);
							var x =  middle_x + cha_x;
							var y = middle_y - r * Math.sin(radiu);
							arr.push({
								x: middle_x + (x - middle_x)* (i%179 != 0?0.995:1),
								y: middle_y + (y - middle_y)* (i%179 != 0?0.6:1)
							});
						}
						var circle_a = arr[0],
							circle_b = arr[arr.length-1];
						var circle_x1 = circle_a.x,circle_y1 = circle_a.y,
							circle_x2 = circle_b.x,circle_y2 = circle_b.y;
						if(Math.pow(circle_x1-x1,2)+Math.pow(circle_y1-y1,2) < Math.pow(circle_x2-x2,2)+Math.pow(circle_y2-y2,2)){
							arr.reverse();
						}
						items_span = items_span.concat(arr);
					}
					// console.log(items_span.length);
					$.each(items_span,function(i,v){
						var point = new BMap.Point(v.x, v.y);
						point_arr.push(point);
					});
					var color = getLineColor(code);
					var polygon = new BMap.Polygon(point_arr, {strokeColor: color, fillColor: color,fillOpacity: 1, strokeWeight: 1, strokeOpacity:1});
					map.addOverlay(polygon);
					
				}
			}
		}else if(code == 38){
			var SPACE_NUM = 6;
			var color = getLineColor(38);
			$.each(items.slice(0,items.length-SPACE_NUM),function(i,v){
				if(i > 0 && i % SPACE_NUM == 0){
					var point_before = items[i-1],
						point_current = v;
					var radiu = Math.atan((point_current.y - point_before.y)/(point_current.x - point_before.x)) / Math.PI * 180 ;
					if(point_current.x < point_before.x){
						radiu += 180;
					}
					var icon_Layer = new Icon_Layer(new BMap.Point((point_current.x + point_before.x)/2,(point_current.y + point_before.y)/2),-radiu,'frost_line');
					$(icon_Layer.getDiv()).find('div').css({
						'background-color': color
					});
					map.addOverlay(icon_Layer);
					
				}
			});
		}
	}
	/*处理降水的颜色*/
	var getPrecipitationColor = (function(){
		var index = 0;
		return function (code,val){

			// code 默认处理成降雨（如台湾地区就得到具体code值）
			var colors = COLOR_PRECIPITATION[code||CONSTANT.AREA.RAIN].colors;
			if(colors){
				for(var i = 0,j=colors.length;i<j;i++){
					var color = colors[i];
					var condition = color[0];
					if(val >= condition[0] && val < condition[1]){
						var c = color[1];
						if(code == 24){
							c = 'url(#rain_snow_'+(index++)+')';
						}
						return c;
					}
				}
			}
		}
	})();
	/*处理特殊线的颜色*/
	function getLineColor(code){
		var conf = COLOR_LINE[code];
		return conf?conf.color:'blue';
	}
	var prefix_url = 'http://10.14.85.116/nodejs_project/micaps/';
	var data_url = prefix_url + 'data/micaps/14/rr111308.024.json';
	var data_url = prefix_url + 'data/micaps/14/rr111314.024.json';
	var data_url = prefix_url + 'data/micaps/14/rr112108.048.json';
	var data_url = prefix_url + 'data/micaps/14/14110508.000.json';
	// var data_url = prefix_url + 'data/micaps/14/14110514.000.json';
	// var data_url = prefix_url + 'data/micaps/14/14110520.000.json';
	// var data_url = prefix_url + 'data/micaps/14/rrr112708.006.json';
	// var data_url = prefix_url + 'data/micaps/14/kw14121808.024.json';
	// var data_url = prefix_url + 'data/micaps/14/wt121808.024.json';
	var data_url = prefix_url + 'data/micaps/14/14120608.000.json';
	


	var _flag_is_added_svg_pattern = false;
	function _add_svg_pattern(){}
	
	global.initMicapsLine = function(map){
		var ajax_data = $.getJSON(data_url),
			ajax_constant = $.getJSON(prefix_url + 'config/constant.json'),
			ajax_color_precipitation = $.getJSON(prefix_url + 'config/precipitation.json'),
			ajax_color_line = $.getJSON(prefix_url + 'config/line.json');

		$.when(ajax_data,ajax_constant,ajax_color_precipitation,ajax_color_line).done(function(a,b,c,d){
			CONSTANT = b[0];
			COLOR_PRECIPITATION = c[0];
			for(var i in COLOR_PRECIPITATION){
				var val = COLOR_PRECIPITATION[i].colors;
				$.each(val,function(i,v){
					var condition = v[0];
					if(isNaN(condition[0])){
						v[0] = Number.MIN_VALUE;
					}
					if(isNaN(condition[1])){
						v[1] = Number.MAX_VALUE;
					}
				});
			}
			COLOR_LINE = d[0];
			var rain_snow_color = COLOR_PRECIPITATION[24].colors;
			if(rain_snow_color){
				_add_svg_pattern = function(){
					if(_flag_is_added_svg_pattern){
						return;
					}
					mySvg = $('#allmap svg').get(0);
					if(!mySvg){
						return;
					}
					_flag_is_added_svg_pattern = true;

					// https://github.com/tonny-zhang/node-micaps/issues/3
					var css_text = '';
					var svg_pattern = '';
					var svgNS = mySvg.namespaceURI;

					var defs = document.createElementNS(svgNS,'defs');
					mySvg.appendChild(defs);
					$.each(rain_snow_color,function(i,v){
						var name = 'rain_snow_'+i;	
						var pattern = document.createElementNS(svgNS, 'pattern');
						pattern.setAttribute('id', name);
					    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
					    pattern.setAttribute('width', 1000);
					    pattern.setAttribute('height', 4);
					    pattern.setAttribute('x', 12);
					    pattern.setAttribute('y', 12);
					    pattern.setAttribute('patternTransform', 'rotate(-45)');

					    var rect = document.createElementNS(svgNS, 'rect');
					    rect.setAttribute('x', 0);
					    rect.setAttribute('y', 0);
					    rect.setAttribute('width', 9999);
					    rect.setAttribute('height', 1);
					    rect.setAttribute('style', 'stroke: '+v[1]);
					    pattern.appendChild(rect);

					    defs.appendChild(pattern);
					});
				}
			}
			callback_data.call(null,map,a[0]);
		});

	}
}(this);

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
			this.particles.push(this.makeParticle(animator));
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
		for (;;) { //infinite loop
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
				this.particles[i] = this.makeParticle(animator);
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
		g.fillStyle = 'rgba(40, 40, 40, 0.99)';
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
		g.lineWidth = 1.2;
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
				var s = wind.length() / this.maxLength;

				var t = Math.floor(290 * (1 - s)) - 45;
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
					var _color = "hsl(" + (t) + ", 70%, 50%)";
					// var _color = "hsl(84, 228, "+(t*0.5)+")";
					// var _color = 'rgb(0,'+Math.ceil(s * 255)+',0)';
					// g.shadowColor = _color;
					g.strokeStyle = _color;
					g.strokeStyle = '#ccc';
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

	
	var field,// = VectorField.read(windData, true),
		render_delay = 40,
		numParticles = 5000; // slowwwww browsers; 3500
	var mapAnimator;
	function initData(map){
		if(!field){
			return;
		}
		// console.log('initData');
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
		var ctx = canvas.getContext('2d');

		var new_field = VectorField.split(field,sw_point.lng,ne_point.lat,ne_point.lng,sw_point.lat);
		var map_projection = new BMapProjection(map);

		_createMask(width, height, new_field, map_projection);

		var imageCanvas = canvas;
	    
	    var scale = Math.pow(2,map.getZoom() - 4);
	    
	    var display = new MotionDisplay(canvas, imageCanvas, new_field, numParticles, map_projection);
	 	mapAnimator = new Animator();
	 	mapAnimator.zoom = scale;
	 	mapAnimator.animFunc = isAnimating
		mapAnimator.add(display);
		mapAnimator.start(render_delay);

		
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
	    var λ0, φ0, Δλ, Δφ;
	    function _interpolate(λ, φ) {
            // var i = _floorMod(λ - λ0, 360) / Δλ;  // calculate longitude index in wrapped range [0, 360)
            var i = (λ - λ0) / Δλ;
            var j = (φ0 - φ) / Δφ;                 // calculate latitude index in direction +90 to -90

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
	                    return _bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
                	}	
            	}
            }


            // var g00 = _getVal(fi, fj);
            // var g10 = _getVal(fi, cj);
            // var g01 = _getVal(ci, fj);
            // var g11 = _getVal(ci, cj);
            
            // if(_isValue(g00) && _isValue(g10) && _isValue(g01) && _isValue(g11)){
            // 	return _bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
            // }
            // var row;
            // if ((row = _grid[fj])) {
            //     var g00 = row[fi];
            //     var g10 = row[ci];
                
            //     if (_isValue(g00) && _isValue(g10) && (row = _grid[cj])) {
            //     	g00 = _translat(g00);
            //     	g10 = _translat(g10);
            //         var g01 = row[fi];
            //         var g11 = row[ci];
            //         if (_isValue(g01) && _isValue(g11)) {
	           //          g01 = _translat(g01);
	           //          g11 = _translat(g11);
            //             // All four points found, so interpolate the value.
            //             return _bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
            //         }
            //     }
            // }
            // console.log("cannot interpolate: " + λ + "," + φ + ": " + fi + " " + ci + " " + fj + " " + cj);
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
	            (pλ[0] - x) / hλ / k,
	            (pλ[1] - y) / hλ / k,
	            (pφ[0] - x) / hφ,
	            (pφ[1] - y) / hφ
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
	    var _fadeToWhite = _colorInterpolator(_sinebowColor(1.0, 0), [255, 255, 255]);
	    function _extendedSinebowColor(i, a) {
	        return i <= BOUNDARY ?
	            _sinebowColor(i / BOUNDARY, a) :
	            _fadeToWhite((i - BOUNDARY) / (1 - BOUNDARY), a);
	    }
	    function _gradient(v, a){
	    	return _extendedSinebowColor(Math.min(v, 100) / 100, a);
	    }
		return function(width, height, field, projection){
			console.log(field);
			_width = width;
			_height = height;
			_grid = field.field;
			λ0 = field.x0, φ0 = field.y1;
			Δλ = (field.x1 - field.x0)/field.w, Δφ = (field.y1 - field.y0)/field.h;
			var canvas = $('<canvas width='+width+' height='+height+' class="layer_vector">').css({
				left: 0,
				top: 0
			}).appendTo($('#map .BMap_mask')).get(0);
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = "rgba(255, 0, 0, 1)";
	        ctx.fill();
	        // d3.select("#display").node().appendChild(canvas);  // make mask visible for debugging

	        var imageData = ctx.getImageData(0, 0, width, height);
	        data = imageData.data;  // layout: [r, g, b, a, r, g, b, a, ...]

	        var velocityScale = 1;
	        var step = 2;
	        console.log(width, height);
	        for(var x = 0;x<width;x+=step){
	        	for(var y = 0;y<height;y+=step){
	        		var color = TRANSPARENT_BLACK;
	        		
	        		var coord = projection.invert(x, y);

	        		if(coord){
	        			var λ = coord.x, φ = coord.y;
	        			var wind = _interpolate(λ, φ);
	        			var scalar = null;
	        			if(wind){
	        				wind = _distort(projection, λ, φ, x, y, velocityScale, wind);
	        				scalar = wind[2];
	        			}
	        			if(_isValue(scalar)){
	        				color = _gradient(scalar, OVERLAY_ALPHA);
	        			}
	        		}

	        		_set(x, y, color);
	        		_set(x+1, y, color);
	        		_set(x, y+1, color);
	        		_set(x+1, y+1, color);
	        	}
	        }
	        ctx.putImageData(imageData, 0, 0);
	        console.log('create mask');
		}
	})();
	
	function initMap(){
		var $map = $('#map');
		// var map = new BMap.Map("map");
		var tileLayer = new BMap.TileLayer,
			map_url = 'http://map.yuce.baidu.com/tile4/?qt=tile&udt=20141224';
		tileLayer.getTilesUrl = function(t, e) {
			var o = map_url + "&x=" + t.x + "&y=" + t.y + "&z=" + e + "&styles=pl";
			return o;
		};
		// var map_type = new BMap.MapType("地图类型", tileLayer);
		// var map = new BMap.Map("map", {
		// 	enable3DBuilding: !1,
		// 	vectorMapLevel: 99,
		// 	enableMapClick: false,
		// 	mapType: map_type
		// });

		var map = new BMap.Map("map");

		global.map = map;
	    var currentZoom = 5;
	    // map.setMinZoom(4);
	    map.setMaxZoom(9);
	    map.disableInertialDragging();
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
	    	// console.log('end');
	        initData(map);
	    }
	    function dragendOrZoomstart(){
	    	// console.log('start');
	    	if(mapAnimator){
	    		mapAnimator.stop();
	    	}
	    	$map.find('.layer_vector').remove();
	    }

		map.setMapStyle({
			styleJson: 
				[
			          {
			                    "featureType": "land",
			                    "elementType": "all",
			                    "stylers": {}
			          },
			          {
			                    "featureType": "land",
			                    "elementType": "all",
			                    "stylers": {
			                              "color": "#1c3289"
			                    }
			          },
			          {
			                    "featureType": "boundary",
			                    "elementType": "all",
			                    "stylers": {
			                              "color": "#6b9ecc"
			                    }
			          },
			          {
			                    "featureType": "road",
			                    "elementType": "all",
			                    "stylers": {
			                              "visibility": "off"
			                    }
			          },
			          {
			                    "featureType": "water",
			                    "elementType": "all",
			                    "stylers": {
			                              "color": "#3075c5"
			                    }
			          },
			          {
			                    "featureType": "administrative",
			                    "elementType": "labels.text.stroke",
			                    "stylers": {
			                              "color": "#1c3289",
			                              "weight": "0.1",
			                              "visibility": "on"
			                    }
			          },
			          {
			                    "featureType": "label",
			                    "elementType": "labels.text.fill",
			                    "stylers": {
			                              "color": "#ffffff",
			                              "visibility": "on"
			                    }
			          }
			]
		});
	}
	initMap();
	// initMicapsLine(map);

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
	

	function _getAjax(url_format){
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
				dataType: 'jsonp',
				jsonp: '_cb',
				success: function(data){
					// console.log(data, $ajax.date != ajax_date);
					if($ajax.date != ajax_date){
						return;
					}
					callback && callback(data);
				},
				error: function(e){
					console.log(arguments);
				}
			});
			$ajax.date = ajax_date = date;
		}
	}
	global.loadWind = (function(){
		var $loading_windspeed = $('#loading_windspeed');
		var cb = function(data){
			field = VectorField.read(data, true);
			$loading_windspeed.hide();
			initData(map);
		}
		var _loadwind = _getAjax(function(){
			return 'http://10.14.85.116/php/wind/data.php?_name=micapsdata&vti='+getType()+'&type=1000';
		});
		return function(){
			$loading_windspeed.show();
			_loadwind(cb);
		}
	})();
	global.loadWindSpeed = _getAjax(function(lon, lat, callback){
		// return 'http://10.14.85.116/php/wind/data.php?_name=historywindspeed&lon='+lon+'&lat='+lat;
		return 'http://10.14.85.116/php/wind/data.php?_name=micapswind&type=1000&lon='+lon+'&lat='+lat;
	});
	global.loadAir = _getAjax(function(lon, lat, callback){
		return 'http://10.14.85.116/php/wind/data.php?_name=micapsvalue&lon='+lon+'&lat='+lat+'&vti=024,048,072&type=zhyb';
	});
	global.loadXSC = (function(){
		var _cb = function(data){
			initMicapsLine(map, data);
		}
		var _load = _getAjax(function(){
			return 'http://10.14.85.116/php/wind/data.php?_name=micapsdata&vti=000&type=h000';
		});
		return function(){
			_load(_cb);
		}
	})();
}(this);