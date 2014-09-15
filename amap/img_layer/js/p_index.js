/*根据定位得到城市信息*/
!function(){
	var prefix_req = 'http://radar.tianqi.cn/radar/';//location.host != 'radar.tianqi.cn'?'http://radar.tianqi.cn/radar/':'./';
	var U = {};
	window.Util = U;
	var OS = (function(){
		var os = {};
		var n = navigator.userAgent;
		if(~n.indexOf('Android')){
			os.isAndroid = true;
		}else if($.browser.safari){//这里粗略通过浏览器是不是safrari来判断是否是IOS操作系统
			/*小米的手机$.browser.safari竟然为true*/
			if(/iphone|ipad/i.test(n)){
				os.isIOS = true;
			}
		}
		os.isNativeApp = navigator.userAgent.indexOf('nativeApp') == 0;
		return os;
	})();
	var initLon = 116.3274,
		initLat = 39.9451;
	/*本地存储*/
    if(typeof localStorage != 'undefined'){
		var store = localStorage;
		var prefix = 'w_';
		var formateName = function(name){
			return prefix+name;
		}
		var _localstorage = {
			set: function(name,val){
				if(val === undefined || val === null){
					return _localstorage.rm(name);
				}
				try {
	                var json = JSON.stringify(val);
	                store.setItem(formateName(name),json);
	                return true;
	            } catch (e) {console.log(e);}
			},
			get: function(name){
				var val = localStorage[formateName(name)];
				if(val != undefined && val != null){
					try{val = JSON.parse(val);}catch(e){}
					return val;
				}
			},
			rm: function(name){
				name = formateName(name);
				if(name){
					store.removeItem(name);
				}else{
					store.clear();
				}
			},
			rmAll: function(){
				for(var i in store){
					if(i.indexOf(prefix) == 0){
						store.removeItem(i);
					}
				}
			}
		}
	}
	!function(){
		var unique_id = 0;
		var callback_cache = {};
		/*调用本地方法*/
		U.command = OS.isNativeApp ? function(fnName,param,callback){
			var args = [].slice.call(arguments);
			if(args.length == 2 && typeof param == 'function'){
				callback = param;
				param = null;
			}
			var paramArr = [];
			if(!param){
				param = {};
			}
			
			
			if(callback){
				var u_id = new Date().getTime()+'_'+unique_id++;
				callback_cache[u_id] = function(){
					callback.apply(this,arguments);
					delete callback_cache[u_id];
				};
				param['cb'] = u_id;
			}
			var promptFn = function(){
				var val = prompt(fnName,JSON.stringify(param||''));
				console.log("fnName:"+fnName+",val:"+val+",typeof(val)"+(typeof val)+"_  ,u_id:"+u_id);
				return val;
			}
			if(u_id){
				setTimeout(function(){
					var val = promptFn();
					if(null != val && '' != val){
						U.command.callback(u_id,val);
					}
				},0);
			}else{
				return promptFn();
			}
			
		}:function(){};
		/*本地方法的回调*/
		U.command.callback = function(callback_name,param){
			var callback = callback_cache[callback_name];
			if(isNaN(param)){
				param = param.replace(/\r/g,'').replace(/\n/g,'\\n');
				try{
					param = JSON.parse(param);
				}catch(e){}
			}
			
			console.log(callback+' '+JSON.stringify(param));
			callback && callback(param);
		}
	}();


	/*根据定位得到城市信息*/
	var getGeoInfo = function(successCallback,onerrorFn){
		var timeout = 5100;
	    var areaidValideTimeCache = 'aread_time';
	    var geoinfoCache = 'geo_info';
	    var geoinfo = _localstorage.get(geoinfoCache);
    	// 有效时间内不重复操作
    	// if(geoinfo && (parseInt(_localstorage.get(areaidValideTimeCache)) || Number.MAX_VALUE) > new Date().getTime()){
    	// 	successCallback && successCallback(geoinfo);
     	//    return ;
	    // }
	    var errorFn = function(type){
	    	if($.isFunction(onerrorFn)){
	    		onerrorFn(type);
	    	}else{
	    		alert('为了得到更好的定位服务，请开启位置服务（设置->位置服务）;code('+type+')');
	    	}
	    }
	    var geolocation = navigator.geolocation;
	    var fn_success = function(position,type){
	    	console.log('S'+(type||0));
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var geoinfo = {
            	lat: lat,
            	lon: lon
            };
            _localstorage.set(geoinfoCache,geoinfo);
            // 设置有效时间为半小时
            _localstorage.set(areaidValideTimeCache,new Date().getTime()+1000*60*30);
            successCallback && successCallback({
            	lat: lat,
            	lon: lon
            });
        }
        var geoIP = function(failFn){
        	getJSONP(prefix_req+"geo.php",function(result){
				if(result.status == 1){
	            	var rectangle = result.rectangle.split(/[,;]/);
	            	var lat = (Number(rectangle[1]) + Number(rectangle[3]))/2;
	            	var lon = (Number(rectangle[0]) + Number(rectangle[2]))/2;
	            	initLat = lat;
	            	initLon = lon;
	            	fn_success({
        				coords: {
        					latitude: initLat,
        					longitude: initLon
        				}
        			},1);
	            }else{
	            	failFn && failFn(12);
	            }
			},function(){
				failFn && failFn(13);
			});
        }
        var fn_command_geo = (function(){
        	var isRuned = false;
        	var timeoutTT;
        	return function(type,isFromIP){
        		// timeoutTT = setTimeout(function(){
	        	// 	isRuned = true;
        		// 	errorFn(type);
        		// },timeout);
        		U.command('getGeo',function(data){
        			// clearTimeout(timeoutTT);
	        		// if(isRuned){
	        		// 	return;
	        		// }
	        		if(!data || data.e){
	        			var errMsg = '定位出现错误！'
	        			if(isFromIP){
	        				alert(errMsg);
	        			}else{
	        				geoIP(function(){
		        				alert(errMsg);
		        			});
	        			}
	        			
	        			return;
	        		}
	        		fn_success({
        				coords: {
        					latitude: data.lat,
        					longitude: data.lon
        				}
        			},2);
        		});
        	}
        })();
        /*ios下的safari会出现讨厌的提示框，这里safari的时候就直接调用原生定位接口*/
	    if(geolocation && !OS.isNativeApp){
	    	 geolocation.getCurrentPosition(fn_success,function(error){
	    	 	if(OS.isAndroid){
	    	 		fn_command_geo(11);
	    	 	}else{
	    	 		geoIP(fn_command_geo);
	    	 	}
	    	 },{
                maximumAge: 60*1000*2,
                timeout: timeout
            });
	    }else{
	    	fn_command_geo(2);
	    }
	}

	var getJSONP = function(url,fn_success,fn_error){
		$.ajax({
            type : "get",
            url : url,
            dataType : "jsonp",
            jsonp: "cb",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            success : fn_success,
            error: fn_error
        });
	}
	var showNetWorkStatus = function(){
		U.command('toast',{
			msg: '网络连接异常！'
		});
	}
	U.command('isCanUseNetwork',function(flag){
		if(!flag){
			showNetWorkStatus();
		}
	});
	$(function(){
		var info_width = $('#hour_rain').width(),
			into_height = $('#hour_rain').height();
		$('#rain_line').attr('width',info_width).attr('height',into_height).css({
			width: info_width,
			height: into_height
		});
		var x_middle = y_middle = radius = 93;
		// var ctx = $('#circle_rain').get(0).getContext("2d");
		// ctx.sector(100,0,radius,0,Math.PI/180*10).fill();

		var color = ["rgba(255,255,255,.3)","#03a9f4","#0288d1","#01579b"];  //0.05-0.15是小雨，0.15-0.35是中雨, 0.35以上是大雨
		 
		// /*画扇形*/
		// var drawTT;
		// function drawSector(data,callback){
		// 	clearTimeout(drawTT);
		// 	ctx.clearRect(0, 0, x_middle*2,y_middle*2);
		//     var startPoint=-Math.PI/180*90;
		//     var index = 0;
		//     var delay = 10;
		//     var run = function(){
		//     	if(index > data.length-1){
		//     		callback && callback();
		//     		return;
		//     	}
		//     	var v = data[index++];
		//     	var colorIndex = 0;
		//     	if(v < 0.05){
		//     		colorIndex = 0;
		//     	}else if(v >= 0.05 && v < 0.15){
		//     		colorIndex = 1;
		//     	}else if(v >= 0.15 && v < 0.35){
		//     		colorIndex = 2;
		//     	}else{
		//     		colorIndex = 3;
		//     	}
		//     	var colorVal = color[colorIndex];
		//     	ctx.fillStyle = colorVal;
		//     	ctx.beginPath();  
		//         ctx.moveTo(x_middle,y_middle);  
		//         var endPoint = startPoint + Math.PI/180*6;
		//         ctx.arc(x_middle,y_middle,radius,startPoint,endPoint,false);  
		//         ctx.fill();  
		//         startPoint = endPoint; 
		//         drawTT = setTimeout(run,delay);
		//     }
		//     drawTT = setTimeout(run,delay);
		// }  
		window.requestAnimFrame = (function(callback) {
		  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		  function(callback) {
		    window.setTimeout(callback, 1000 / 60);
		  };
		})();
		var rainfall_data ;
		function draw_canvas(c, startTime) {
		  if (rainfall_data != undefined) {

		    // update

		    var time = (new Date()).getTime() - startTime;


		    var data=Array.apply(null, new Array(rainfall_data.length)).map(Number.prototype.valueOf,0);;
		    var data_len = data.length;
		    var canvas_len = c.width;
		    var canvas_height = c.height
		      var cxt=c.getContext("2d");//console.log(rainfall_data,canvas_len,canvas_height);

		    speed=2.2*0.5
		      wave_length=6
		      wave_size=0.4


		      for (i=0;i<data_len;i++) {
		        // speed=2.2*0.5
		        //   wave_length=6
		        //   wave_size=8
		        //   data[i]=rainfall_data[i]+wave_size*Math.sin((i/data_len)*wave_length*Math.PI*3+2*Math.PI*time/(1000*speed))/canvas_height/10
		          speed=2.6*0.5
		          wave_length=4
		          wave_size=6
		          data[i]=rainfall_data[i]+wave_size*Math.cos((i/data_len)*wave_length*Math.PI*3-3.2*Math.PI*time/(1000*speed))/canvas_height/10

		      }

		    //clear
		    cxt.clearRect ( 0 , 0 , canvas_len , canvas_height );

		    //draw
		    var interval = canvas_len / (data_len-1);

		    for (i=0;i<data_len-1;i++) {
		      cxt.fillStyle="#1878f0";
		      //cxt.fillStyle="#0066FF";
		      //cxt.fillStyle="#000000";
		      cxt.beginPath();

		      cxt.moveTo(i*interval,canvas_height)
		        cxt.lineTo(i*interval,canvas_height*(1-data[i]))
		        cxt.lineTo((i+1.2)*interval,canvas_height*(1-data[i+1]))
		        cxt.lineTo((i+1.2)*interval,canvas_height)
		        cxt.lineTo(i*interval,canvas_height)

		        cxt.closePath();
		      cxt.fill();
		    }
		  }

		  // request new frame
		  requestAnimFrame(function() {
		    draw_canvas(c, startTime);
		  });
		}
		function drawSector(data,callback){
			rainfall_data = data;
			draw_canvas($('#rain_line').get(0),(new Date()).getTime());
		}

		var randar_layers = [];
		var domain = 'http://rain.swarma.net'
		var $play_time = $('#play_time');
		/*播放器*/
		var Player = (function(){
			
			var isPlaying = false;
			var $btn_play = $('#btn_play').click(function(){
				var $this = $(this);
				if($this.hasClass('pause')){
					pause();
					$this.removeClass('pause');
				}else{
					play();
					$this.addClass('pause');
				}
			});
			var delay = 300;
			var currentIndex = 0;
			var newLayer,oldLayer;
			var playTT;
			var play = function(){
				isPlaying = true;
				oldLayer = randar_layers[currentIndex];
				oldLayer.setOpacity(0);
				
				var len = randar_layers.length;
				var nextIndex = currentIndex+1 < len?currentIndex+1:0;
				newLayer = randar_layers[nextIndex];

				newLayer.setOpacity(showOpacity);
				$play_time.text(newLayer.time);
				oldLayer = newLayer;
				currentIndex = nextIndex;
				playTT = setTimeout(play,currentIndex==len-1?delay*10:delay);
			}
			var pause = function(){
				isPlaying = false;
				clearTimeout(playTT);
			}
			return {
				reset: function(){
					$btn_play.removeClass('pause');
					currentIndex = 0;
					clearTimeout(playTT);
				},
				play: play,
				pause: pause
			}
		})();
		

		/*初始化地图*/
		var mapObj;
		function mapInit(){
			var initLngLat = new AMap.LngLat(initLon,initLat);
			mapObj = new AMap.Map("map",{
				scrollWheel: true,//可通过鼠标滚轮缩放地图
		        doubleClickZoom: true, //可以双击鼠标放大地图
		        view: new AMap.View2D({
			        center: initLngLat,
			        zoom: 4,
			        touchZoom: true,
			        crs:'EPSG3857'
				})  //2D地图显示视口  
			});
			AMap.event.addListener(mapObj,'complete',function(){
				console.log('map complete');
			});
			//地图类型切换
		    mapObj.plugin(["AMap.MapType"], function() {
		        var type = new AMap.MapType({
		        	defaultType: 0,
		        	showRoad: true
		        });//初始状态使用2D地图
		        mapObj.addControl(type);
		        // 地图类型改变时强制重绘
		        $('.amap-maptype-con').click(function(){
		        	renderImgLayer();
		        });
		    });
			// mapObj = new AMap.Map('map',{resizeEnable: true, center: initLngLat, level: 5, touchZoom: true});
			//在地图中添加ToolBar插件
		    mapObj.plugin(["AMap.ToolBar"],function(){     
		        toolBar = new AMap.ToolBar();
		        mapObj.addControl(toolBar);    
		    });
			var lngLatCache;
			var currentMaker;
			/*设置标记点*/
			var setMarker = function (lngLat){
				currentMaker && currentMaker.hide();
				lngLatCache = lngLat;
				var marker = new AMap.Marker({
			        map:mapObj,
			        icon: new AMap.Icon({
			            image: "./img/mark.png",
			            size: new AMap.Size(30,30)
			        }),
			        position: lngLat
			    });
			    currentMaker = marker;
			}
			setMarker(initLngLat);
			var setCenter = function(lon,lat){
	    		var lngLat = new AMap.LngLat(lon,lat);
	    		mapObj.setCenter(lngLat);
	        	setMarker(lngLat);
	    	}
			//为地图注册click事件获取鼠标点击出的经纬度坐标
		    var clickEventListener=AMap.event.addListener(mapObj,'click',function(e){
		    	console.log('map click');
		        var lon = e.lnglat.getLng(),
		        	lat = e.lnglat.getLat();
		        	console.log(lon,lat);
		        // setCenter(lon,lat);
		        var lngLat = new AMap.LngLat(lon,lat);
		        // setMarker(lngLat);
		        refresh(lon,lat);
		    });
		    return {
		    	clearLayer: function(){
		    		mapObj.clearMap();
		    		setMarker(lngLatCache);
		    	},
		    	setMarker: function(lon,lat){
		    		var lngLat = new AMap.LngLat(lon,lat);
		    		setMarker(lngLat);
		    	},
		    	resetCenter: setCenter
		    }
		}
		
		/*根据经纬度得到地名*/
		var lnglatToAddress = function(lon,lat,callback){
			//加载地理编码插件
		    mapObj.plugin(["AMap.Geocoder"], function() {       
		        var MGeocoder = new AMap.Geocoder({
		            radius: 1000,
		            extensions: "all"
		        });
		        //返回地理编码结果
		        AMap.event.addListener(MGeocoder, "complete", function(result){
		        	//返回地址描述
   					var address = result.regeocode.formattedAddress;
		        	callback && callback(address,result);
		        });
		        //逆地理编码
		        MGeocoder.getAddress(new AMap.LngLat(lon,lat));
		    });
		}
		// lnglatToAddress(116.405285,39.904989,function(){
		// 	console.log(arguments);
		// });
		/*根据地名得到经纬度*/
		// var addressToLnglat = function (text,callback) {
		//     var MGeocoder;
		//     //加载地理编码插件
		//     mapObj.plugin(["AMap.Geocoder"], function() {       
		//         MGeocoder = new AMap.Geocoder({
		//             city:"010", //城市，默认：“全国”
		//             radius:1000 //范围，默认：500
		//         });
		//         //返回地理编码结果
		//         AMap.event.addListener(MGeocoder, "complete", function(data){
		//         	console.log(text,data);
		//         	callback && callback(data.geocodes[0].location);
		//         });
		//         //地理编码
		//         MGeocoder.getLocation(text);
		//     });
		// }
		var amapSign = {status: 1, sign: "E764CAC53B2401E16FAEB7FD2DA351AD", ts: 1404440573, channel: "openapi_pc"};
		var getSign = function(){
			getJSONP(prefix_req+"sign.php",function(result){
				if(result.status){
                	amapSign = result;
            	}
			});
		}
		getSign();
		var addressToLnglat = function(text,callback){
			var time = new Date().getTime()%1000;
			getJSONP(prefix_req+'search.php?sign='+amapSign.sign+'&channel='+amapSign.channel+'&ts='+amapSign.ts+'&keywords='+text,function(data){
				try{
					var poi_list = data.poi_list;
					poi_list || (poi_list = data.locres.poi_list);
					var locate = poi_list[0];
					var data = {lng: locate.longitude,lat: locate.latitude};
				}catch(e){
					
				}
				callback && callback(data);
			});
		}
		var _search = function(text){
			if(!text){
				return alert('请输入要查询的地点！');
			}
			addressToLnglat(text,function(data){
				if(data){
					mapTool.resetCenter(data.lng,data.lat);
					refresh(data.lng,data.lat);
				}else{
					alert('哎呀！地图君忘了“'+text+'”在哪里了！我们等下再问问他？');
				}
				$search_input.val('').blur();
			});
		}
		$('#form_search').on('submit',function(){
			_search($search_input.val());
			return false;
		});
		$('#btn_locate').click(function(){
			getGeoInfo(function(result){
	        	initLat = result.lat;
	        	initLon = result.lon;
	        	afterGeo();
	        },afterGeo);
		});
		var data_server_time = 0;
		var radar_desc = '';
		var $win = $(window);
		var win_width = $win.width(),
			win_height = $win.height();

		function getServerTime(){
			var time = new Date(data_server_time*1000);
			var hours = time.getHours();
			if(hours < 10){
				hours = '0'+hours;
			}
			var minutes = time.getMinutes();
			if(minutes < 10){
				minutes = '0'+minutes;
			}
			time = hours+':'+minutes;
			return time;
		}
		var share = function(){}
		if(OS.isNativeApp){
			$('#btn_share').click(function(){
				U.command('toast',{
					msg: '正在处理...'
				});
				var fn = function(){
					html2canvas(document.body, {
			            onrendered: function(canvas) {
			            	var newCanvas = document.createElement('canvas');
					        newCanvas.width = win_width;
					        newCanvas.height = win_height;
					        ctx = newCanvas.getContext("2d");
					        var imgData = canvas.getContext("2d").getImageData(0, 0, win_width, win_height);
					        ctx.putImageData(imgData, 0, 0);
			            	var img = newCanvas.toDataURL();
			            	
			            	U.command('share',{
								url: 'http://decision.tianqi.cn/randar/'+location.hash,
								img: img,
								imgLen: img.length,
								time: getServerTime(),
								desc: radar_desc,
								address: $('.locate').text()
							});
			            }
			        });
				}
				if(typeof html2canvas == 'undefined'){
					$.getScript('js/html2canvas.js',fn);
				}else{
					fn();
				}
			});
		}else{
			var initShare = false;
			share = function(){
				var url = encodeURIComponent('http://decision.tianqi.cn/randar/'+location.hash);
				var desc = encodeURIComponent('天气管家'+getServerTime()+'播报,'+($('.locate').text().trim())+'('+url+'):'+radar_desc);
				var title = document.title;
				$('#btn_share').attr('target','_blank').attr('href','http://www.jiathis.com/send/?webid=shareID&url='+url+'&title=&summary='+desc+'&uid=$uid');
			}
		}
		
		$('#btn_back').click(function(){
			U.command('back');
		});
		var $search_input = $('#search_input');
		// .on('input',function(){
		// 	_search($(this).val());
		// });
		/*初始化数据*/
		var $desc = $('.desc');
		var errorReason = {
			too_old: '数据延迟超过30分钟',
			too_sparse: '前后两帧数据中间有超过20分钟的数据缺失',
			outside_station: '不在雷达站范围内',
			no_latlon: '缺少经纬度参数'
		};
		
		errorReason['data_too_sparse'] = errorReason['too_sparse'];
		errorReason['data_too_old'] = errorReason['too_old'];
		var ajax_data;
		var refreshTT;
		var title = document.title || '天气管家';
		var showOpacity = 0.6;
		var imgLayerConf = {
			'cloud': {
				name: '云图',
				url: prefix_req+'imgs.php?type=cloud',
				isSelected: true
			},
			'radar': {
				name: '雷达图',
				url: prefix_req+'imgs.php?type=radar',
			},
			'precipitation': {
				name: '降水图',
				url: prefix_req+'imgs.php?type=precipitation',
			},
			'leidian': {
				name: '雷电',
				url: prefix_req+'imgs.php?type=leidian',
			}
		};
		var defaultSetting = '';
		var currentImgArr = [];
		function renderImgLayer(imgs){
			if(!imgs){
				imgs = currentImgArr;
			}else{
				currentImgArr = imgs;
			}
			
			mapTool.clearLayer();
			randar_layers = [];
			$.each(currentImgArr,function(i,v){
				// var posArr = v[2];
				// var leftTop = new AMap.LngLat(posArr[1], posArr[0]),
				// 	rightBottom = new AMap.LngLat(posArr[3], posArr[2]),
				// 	bounds = new AMap.Bounds(leftTop, rightBottom);

				// var img = domain + v[0];
				var img = v.l2;
				// img = "http://10.14.85.116/000.png";
				var leftTop = new AMap.LngLat(73.0, 12.2),
					rightBottom = new AMap.LngLat(137.0,54.2 ),
				// var leftTop = new AMap.LngLat(73.0, 12.9),
				// 	rightBottom = new AMap.LngLat(137.0,54.9 ),
					bounds = new AMap.Bounds(leftTop, rightBottom);
				var new_layer = new AMap.GroundImage(img, bounds, {
					map: mapObj,
					clickable: false
				});
				new_layer.setMap(mapObj)
				new_layer.setOpacity(i==0?showOpacity:0);
				var time = new Date(v[1]*1000);
				// var hours = time.getHours();
				// if(hours < 10){
				// 	hours = '0'+hours;
				// }
				// var minutes = time.getMinutes();
				// if(minutes < 10){
				// 	minutes = '0'+minutes;
				// }
				// new_layer.time = hours+':'+minutes;
				new_layer.time = v.l1.substr(11);
				randar_layers.push(new_layer);
			});
			$play_time.text(randar_layers.slice(-1)[0].time);
		}
		function initImgLayer(type){
			type = type || defaultSetting;
			Player.reset();
			// Player.play();
			$.getJSON(imgLayerConf[type]['url'],function(data){
				var imgs = data.l.reverse();
				renderImgLayer(imgs);
				// Player.reset();
				// Player.play();
			});
		}
		var $tool_bar = $('.tool_bar').click(function(e){
			var $target = $(e.target);
			if($target.is('span')){
				initImgLayer($target.data('type'));
				$target.parent().addClass('on').siblings().removeClass('on');
			}
		});
		for(var i in imgLayerConf){
			var item = imgLayerConf[i];
			var $div = $('<div><span data-type="'+i+'">'+item.name+'</span></div>').data('type',i);
			if(item.isSelected){
				$div.addClass('on');
				defaultSetting = i;
			}
			$tool_bar.append($div);
		}
		function refresh (lon,lat) {
			var urlnow = document.URL;
		    urlnow = urlnow.split("#")[0];
		    var newUrl = urlnow+"#"+(Number(lon).toFixed(4))+","+(Number(lat).toFixed(4));
			history.pushState({},title,newUrl);
			clearTimeout(refreshTT);
			mapTool.resetCenter(lon,lat);
			$desc.html('&nbsp;');
			lnglatToAddress(lon,lat,function(result){
				$('.locate').text(result);
			});
			ajax_data && ajax_data.abort();
			var url = prefix_req+'data.php?lonlat='+[lon,lat].join(',');
			getJSONP(url,function(data){
				if(data_server_time > data.server_time){
					return;
				}
				data_server_time = data.server_time;
				if(data.status != 'ok'){
					alert(errorReason[data.error_type[0]]);
					return;
				}
				// var imgs = data.radar_img;
				// mapTool.clearLayer();
				// randar_layers = [];
				// $.each(imgs,function(i,v){
				// 	var posArr = v[2];
				// 	var leftTop = new AMap.LngLat(posArr[1], posArr[0]),
				// 		rightBottom = new AMap.LngLat(posArr[3], posArr[2]),
				// 		bounds = new AMap.Bounds(leftTop, rightBottom);

				// 	var img = domain + v[0];
				// 	img = 'http://10.14.85.116/map_1.png';
				// 	var leftTop = new AMap.LngLat(73.0, 12.2),
				// 		rightBottom = new AMap.LngLat(137.0,54.2 ),
				// 		bounds = new AMap.Bounds(leftTop, rightBottom);
				// 	var new_layer = new AMap.GroundImage(img, bounds, {
				// 		map: mapObj,
				// 		clickable: false
				// 	});
				// 	new_layer.setMap(mapObj)
				// 	new_layer.setOpacity(i==0?1:0);
				// 	var time = new Date(v[1]*1000);
				// 	var hours = time.getHours();
				// 	if(hours < 10){
				// 		hours = '0'+hours;
				// 	}
				// 	var minutes = time.getMinutes();
				// 	if(minutes < 10){
				// 		minutes = '0'+minutes;
				// 	}
				// 	new_layer.time = hours+':'+minutes;
				// 	randar_layers.push(new_layer);
				// });
				radar_desc = data.summary;
				console.log(radar_desc);
				$desc.text(data.summary);
				drawSector(data.dataseries);
				share();
				// Player.reset();
				// Player.play();

				refreshTT = setTimeout(function(){
					refresh(lon,lat);
				},1000*60);
			},function(){
				U.command('isCanUseNetwork',function(flag){
					if(!flag){
						showNetWorkStatus();
					}

					refreshTT = setTimeout(function(){
						refresh(lon,lat);
					},1000*60);
				});
			});
		}
        function afterGeo(){
        	console.log('afterGeo:initLon = '+initLon+',initLat = '+initLat);
        	refresh(initLon,initLat);
        }
        var callbackName = 'cb_'+new Date().getTime();
        var mapTool;
        window[callbackName] = function(){
	        U.command('hideRadar');
	        U.command('checkVersion');
        	mapTool = mapInit();
        	initImgLayer(defaultSetting);
        	var lonlat = U.command('getLonlat');
        	console.log('getLonlat:'+lonlat);
        	if(!lonlat){
        		var urlnow = document.URL;
				var urlArr = urlnow.split("#");
				lonlat = urlArr[1];
        	}
        	
        	if(lonlat){
        		lonlat = lonlat.split(',');
        		if(lonlat.length == 2){
					initLon = lonlat[0];
					initLat = lonlat[1];
					afterGeo();
					return;
				}
        	}
			getGeoInfo(function(result){
	        	initLat = result.lat;
	        	initLon = result.lon;
	        	afterGeo();
	        },afterGeo);
        }
        $.getScript('http://webapi.amap.com/maps?v=1.3&key=d0e895a4c4b5f0c632f8ed3985f0247f&callback='+callbackName).fail(showNetWorkStatus);
	})
}();

