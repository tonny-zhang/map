$(function(){
	var map; 
	var zoom = 10; 
	var config = { 
		projection: "EPSG:4326" 
	} 
	//初始化地图对象 
   	map = new TMap("mapDiv",config); 
   	//设置显示地图的中心点和级别 
	map.centerAndZoom(new TLngLat(121.36164,31.223355),zoom);
	var config = { 
		type:"TMAP_NAVIGATION_CONTROL_LARGE",	//缩放平移的显示类型 
		anchor:"TMAP_ANCHOR_TOP_LEFT",			//缩放平移控件显示的位置 
		offset:[0,0],							//缩放平移控件的偏移值 
		showZoomInfo:true						//是否显示级别提示信息，true表示显示，false表示隐藏。 
	}; 
	//创建缩放平移控件对象 
	control = new TNavigationControl(config); 
	//添加缩放平移控件 
	map.addControl(control); 
	// map.enableHandleMouseScroll(); 

	var pm2_5_data_url = './data/pm2.5.json';
	var map_data_url = './data/shanghai.json';
	var pm2_5_data,map_data;
	function callback(){
		if(pm2_5_data && map_data){
			function getpmData(name){
				for(var i = 0,j = pm2_5_data.length;i<j;i++){
					var item = pm2_5_data[i];
					if(name == item.position_name){
						return item;
					}
				}
			}
			var data = [];
			$.each(map_data.features,function(_index,v){
				var station_name = v['properties']['name'];
				var _d = getpmData(station_name);
				if(_d){
					v['pm25'] = _d;
					data.push(v);
				}
			});
			$.each(data,function(i,v){
				var prop = v.properties;
				//创建图片对象  
				var icon = new TIcon("http://api.tianditu.com/img/map/markerA.png",new TSize(19,27),{anchor:new TPixel(9,27)});  
				//向地图上添加自定义标注  
				var marker = new TMarker(new TLngLat(prop['log'],prop['lat']),{icon:icon});  
				marker._index = i;
				//注册标注的点击事件  
				TEvent.addListener(marker,"mouseover",function(p){
					marker.isover = true;
				});
				TEvent.addListener(marker,"mouseout",function(p){
					marker.isover = false;
				});
				TEvent.addListener(marker,"click",function(p){
					var geo_data = data[marker._index];
					var geometry = geo_data.geometry;
					var type = geometry.type;
					var coordinates = geometry.coordinates;
					var _pm25data = geo_data.pm25;
					var color = getColor(_pm25data['pm2_5']);
					clearPolygon();
					var infoWin = new TInfoWindow(marker.getLngLat());
					infoWin.setLabel(_pm25data.position_name+'('+_pm25data.quality+')<br/>PM2.5： '+_pm25data.pm2_5+'<br/>AQI：'+_pm25data.aqi);
					infoWin.closeInfoWindowWithMouse();
					map.addOverLay(infoWin); 
					if('Polygon' == type){
						drawPolygon(marker,coordinates[0],color);
					}else if('MultiPolygon' == type){
						$.each(coordinates,function(i,v){
							drawPolygon(marker,v[0],color);
						});
					}
				});  
				map.addOverLay(marker); 
			});
		}
	}
	function getColor(pm25){
		if(pm25 > 0 && pm25 <= 50){
			return '#41EC3E';
		}else if(pm25 > 51 && pm25<= 100){
			return '#EFEF45';
		}else if(pm25 > 101 && pm25<= 150){
			return '#F2A461';
		}else if(pm25 > 151 && pm25<= 200){
			return '#F47676';
		}else if(pm25 > 201 && pm25< 300){
			return '#B14B7D';
		}else {
			return '#8C374E';
		}
	}
	var polygons = [];
	function clearPolygon(){
		var item ;
		while(item = polygons.shift()){
			TEvent.removeListener(item.mouseoutfn); 
			item.remove();
		}
	}
	function drawPolygon(marker,polygon,color){
		// console.log('drawPolygon',marker.isShowing);
		// if(marker.isShowing){
		// 	return;
		// }

		var points = [];
		$.each(polygon,function(i,v){
			points.push(new TLngLat(v[0],v[1]));
		});
		var polygon = new TPolygon(points,{fillColor: color,strokeColor:"blue", strokeWeight:1, strokeOpacity:0.5, fillOpacity:0.5}); 
		polygon.mouseoutfn = TEvent.addListener(polygon,"mouseout",function(p){
			clearTimeout(marker.tt);
			marker.tt = setTimeout(function(){
				if(!marker.isover){
					marker.isShowing = false;
					polygon.remove();
				}
			},100);
		});
		polygons.push(polygon);
		map.addOverLay(polygon);
		marker.isShowing = true;
	}
	$.getJSON(pm2_5_data_url,function(data){
		pm2_5_data = data;
		callback();
	});
	$.getJSON(map_data_url,function(data){
		map_data = data;
		callback();
	});
});