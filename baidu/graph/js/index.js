! function() {
	var map = new BMap.Map("map");

	map.centerAndZoom(new BMap.Point(116.404, 39.915), 5);
	// map.centerAndZoom(new BMap.Point(69.772, 46.886), 8);
	map.enableScrollWheelZoom();

	var OPACITY = 0.8;
	function _addPolygon(items, fn_getXY, color_fill, color_stroke) {
		var point_arr = [];
		$.each(items, function(v_i, v_v) {
			var xy = fn_getXY(v_v);
			var point = new BMap.Point(xy[0], xy[1]);
			point_arr.push(point);
		});
		var polygon = new BMap.Polygon(point_arr, {
			strokeColor: color_fill || color_stroke || 'rgba(255,0,0,1)',
			fillColor: color_fill || 'rgba(0,0,0,0)',
			fillOpacity: OPACITY,
			strokeWeight: 1,
			strokeOpacity: OPACITY
		});
		map.addOverlay(polygon); //增加面
	}
	function _addPoline(points, fn_getXY, color_stroke, weight){
		if(points.length >= 2){
			var point_arr = [];
			$.each(points, function(p_i, p_v){
				var xy = fn_getXY(p_v);
				var point = new BMap.Point(xy[0], xy[1]);
				point_arr.push(point);
			});
			var polyline = new BMap.Polyline(point_arr, {
				strokeColor: color_stroke, 
				strokeWeight: weight || 1, 
				strokeOpacity: 1
			});
			map.addOverlay(polyline);   //增加折线
		}
	}
	function _showData(data) {
		map.clearOverlays();
		if(data.type == 14){
			var areas = data.areas;
			if(areas && areas.length > 0){
				$.each(areas, function(i, v){
					_addPolygon(v.items, function(v){
						return [v.x, v.y]
					}, v.c);
				});
			}
			var lines = data.lines;		
			$.each(lines, function(i, v){
				_addPoline(v.point, function(v){
					return [v.x, v.y]
				}, "#1010FF", v.weight);
			})
		}else{
			$.each(data, function(i, v){
				_addPolygon(v.items, function(v){
					return [v.lng, v.lat]
				}, v.color);
			});
		}
	}
	var changeProduct = (function(){
		var cache = {};
		return function(productName, data_path){
			$title.text(productName);
			var val_cache = cache[productName];
			if(val_cache){
				_showData(val_cache);
			}else{
				$.getJSON('./data/'+data_path, function(data){
					cache[productName] = data;
					_showData(data);
				});
			}
		}
	})();
	var $body = $('body'), 
		$tool = $('#tool'),
		$title = $('#title'),
		$win = $(window);
	function resetTool(){
		$tool.height($body.height() - $title.height());
	}
	resetTool();
	var tt_reset;
	$win.on('resize', function(){
		clearTimeout(tt_reset);
		tt_reset = setTimeout(resetTool, 10);
	});
	$tool.delegate('li', 'click', function(){
		var $this = $(this);
		$this.addClass('on').siblings().removeClass('on');
		changeProduct($this.text(), $this.data('p'));
	});
	var list_path = './data/list.json';
	$.getJSON(list_path, function(list){
		var html = '<ul>';
		$.each(list, function(i, v){
			html += '<li data-p="'+v.p+'">'+(v.n)+'</li>';
		});
		html += '</ul>';
		$tool.append(html);
		$tool.find('li').first().click();
	});
	// $.getJSON('http://10.14.85.116/nodejs_project/GraphTool/shell/testdata/data_clip/地质灾害气象预报.json', _showData);
}();