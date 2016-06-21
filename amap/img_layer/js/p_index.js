//https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.min.js
! function(a) {
	"function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
}(function(a) {
	function b(b) {
		var g = b || window.event,
			h = i.call(arguments, 1),
			j = 0,
			l = 0,
			m = 0,
			n = 0,
			o = 0,
			p = 0;
		if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
			if (1 === g.deltaMode) {
				var q = a.data(this, "mousewheel-line-height");
				j *= q, m *= q, l *= q
			} else if (2 === g.deltaMode) {
				var r = a.data(this, "mousewheel-page-height");
				j *= r, m *= r, l *= r
			}
			if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
				var s = this.getBoundingClientRect();
				o = b.clientX - s.left, p = b.clientY - s.top
			}
			return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
		}
	}

	function c() {
		f = null
	}

	function d(a, b) {
		return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
	}
	var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
		h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
		i = Array.prototype.slice;
	if (a.event.fixHooks)
		for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
	var k = a.event.special.mousewheel = {
		version: "3.1.12",
		setup: function() {
			if (this.addEventListener)
				for (var c = h.length; c;) this.addEventListener(h[--c], b, !1);
			else this.onmousewheel = b;
			a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
		},
		teardown: function() {
			if (this.removeEventListener)
				for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1);
			else this.onmousewheel = null;
			a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
		},
		getLineHeight: function(b) {
			var c = a(b),
				d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
			return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
		},
		getPageHeight: function(b) {
			return a(b).height()
		},
		settings: {
			adjustOldDeltas: !0,
			normalizeOffset: !0
		}
	};
	a.fn.extend({
		mousewheel: function(a) {
			return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
		},
		unmousewheel: function(a) {
			return this.unbind("mousewheel", a)
		}
	})
});
/*根据定位得到城市信息*/
! function() {
	var test_ip = '10.14.85.116';
	var prefix_req = location.host == test_ip ? "http://" + test_ip + "/php/radar/" : 'http://radar.tianqi.cn/radar/';

	var U = {};
	window.Util = U;
	var OS = (function() {
		var os = {};
		var n = navigator.userAgent;
		if (~n.indexOf('Android')) {
			os.isAndroid = true;
		} else if ($.browser.safari) { //这里粗略通过浏览器是不是safrari来判断是否是IOS操作系统
			/*小米的手机$.browser.safari竟然为true*/
			if (/iphone|ipad/i.test(n)) {
				os.isIOS = true;
			}
		}
		os.isNativeApp = navigator.userAgent.indexOf('nativeApp') == 0;
		return os;
	})();
	var initLon = 116.3274,
		initLat = 39.9451;
	/*本地存储*/
	if (typeof localStorage != 'undefined') {
		var store = localStorage;
		var prefix = 'w_';
		var formateName = function(name) {
			return prefix + name;
		}
		var _localstorage = {
			set: function(name, val) {
				if (val === undefined || val === null) {
					return _localstorage.rm(name);
				}
				try {
					var json = JSON.stringify(val);
					store.setItem(formateName(name), json);
					return true;
				} catch (e) {
					console.log(e);
				}
			},
			get: function(name) {
				var val = localStorage[formateName(name)];
				if (val != undefined && val != null) {
					try {
						val = JSON.parse(val);
					} catch (e) {}
					return val;
				}
			},
			rm: function(name) {
				name = formateName(name);
				if (name) {
					store.removeItem(name);
				} else {
					store.clear();
				}
			},
			rmAll: function() {
				for (var i in store) {
					if (i.indexOf(prefix) == 0) {
						store.removeItem(i);
					}
				}
			}
		}
	};
	! function() {
		var unique_id = 0;
		var callback_cache = {};
		/*调用本地方法*/
		U.command = OS.isNativeApp ? function(fnName, param, callback) {
			var args = [].slice.call(arguments);
			if (args.length == 2 && typeof param == 'function') {
				callback = param;
				param = null;
			}
			var paramArr = [];
			if (!param) {
				param = {};
			}


			if (callback) {
				var u_id = new Date().getTime() + '_' + unique_id++;
				callback_cache[u_id] = function() {
					callback.apply(this, arguments);
					delete callback_cache[u_id];
				};
				param['cb'] = u_id;
			}
			var promptFn = function() {
				var val = prompt(fnName, JSON.stringify(param || ''));
				// console.log("fnName:"+fnName+",val:"+val+",typeof(val)"+(typeof val)+"_  ,u_id:"+u_id);
				return val;
			}
			if (u_id) {
				setTimeout(function() {
					var val = promptFn();
					if (null != val && '' != val) {
						U.command.callback(u_id, val);
					}
				}, 0);
			} else {
				return promptFn();
			}

		} : function() {};
		/*本地方法的回调*/
		U.command.callback = function(callback_name, param) {
			var callback = callback_cache[callback_name];
			if (isNaN(param)) {
				param = param.replace(/\r/g, '').replace(/\n/g, '\\n');
				try {
					param = JSON.parse(param);
				} catch (e) {}
			}

			callback && callback(param);
		}
	}();


	/*根据定位得到城市信息*/
	var getGeoInfo = function(cb_sucess, cb_error) {
		cb_sucess && cb_sucess({
			lat: initLat,
			lng: initLon
		});
	}

	var getJSONP = function(url, fn_success, fn_error) {
		$.ajax({
			type: "get",
			url: url,
			timeout: 5000,
			dataType: "jsonp",
			jsonp: "cb", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
			success: fn_success,
			error: fn_error
		});
	}
	var showNetWorkStatus = function() {
		U.command('toast', {
			msg: '网络连接异常！'
		});
	}
	U.command('isCanUseNetwork', function(flag) {
		if (!flag) {
			showNetWorkStatus();
		}
	});
	// mt->maptype
	// auto_play
	// it -> img type
	// a_img -> is show all image
	// zoom -> map zoom
	// bg_white -> bg_null
	// use_my -> is_use_myself_data
	var str_search_from_command;
	var getParam = function() {
		str_search_from_command = U.command('getLocationSearch');
		var searchStr = decodeURIComponent(str_search_from_command || location.search.substr(1));
		var arr = searchStr.split('#');
		var searchArr = arr[0].split('&');

		// var searchArr = decodeURIComponent(location.search).split('&');
		var params = {};
		for (var i = 0, j = searchArr.length; i < j; i++) {
			var v = searchArr[i].split('=');
			if (v.length == 2) {
				params[v[0]] = v[1];
			}
		}
		return function(name, defaultVal) {

			var v = params[name];
			if (!isNaN(v)) {
				v = Number(v);
			}
			if (!v && v !== '' && v != 0) {
				v = defaultVal;
			}
			return v;
		}
	}();
	var MAP_TYPE_SATELLITE = 1;
	var mapType = getParam('mt');
	$(function() {
		var isBgWhite = !!getParam('bg_white');
		if (isBgWhite) {
			$('body').addClass('bg_null');
		}
		var init_canvas_size = function() {
			// console.log($('#hour_rain').width(),$('#hour_rain').outerWidth());
			var info_width = $('#hour_rain').width(),
				into_height = $('#hour_rain').height();
			var width = info_width > 600 ? info_width - 40 : info_width;
			$('#rain_line').attr('width', width).attr('height', into_height).css({
				width: width,
				height: into_height
			});
		}
		init_canvas_size();
		var resize_tt;
		window.onresize = function() {
			resize_tt = setTimeout(function() {
				clearTimeout(resize_tt);
				init_canvas_size();
				drawSector();
			}, 100);
		}

		var color = ["rgba(255,255,255,.3)", "#03a9f4", "#0288d1", "#01579b"]; //0.05-0.15是小雨，0.15-0.35是中雨, 0.35以上是大雨


		window.requestAnimFrame = (function(callback) {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();
		var rainfall_data;

		function draw_canvas(c, startTime) {
			if (rainfall_data != undefined) {

				// update

				var time = (new Date()).getTime() - startTime;


				var data = Array.apply(null, new Array(rainfall_data.length)).map(Number.prototype.valueOf, 0);;
				var data_len = data.length;
				var canvas_len = c.width;
				var canvas_height = c.height
				var cxt = c.getContext("2d"); //console.log(rainfall_data,canvas_len,canvas_height);

				speed = 2.2 * 0.5
				wave_length = 6
				wave_size = 0.4


				for (i = 0; i < data_len; i++) {
					// speed=2.2*0.5
					//   wave_length=6
					//   wave_size=8
					//   data[i]=rainfall_data[i]+wave_size*Math.sin((i/data_len)*wave_length*Math.PI*3+2*Math.PI*time/(1000*speed))/canvas_height/10
					speed = 2.6 * 0.5
					wave_length = 4
					wave_size = 6
					data[i] = rainfall_data[i] + wave_size * Math.cos((i / data_len) * wave_length * Math.PI * 3 - 3.2 * Math.PI * time / (1000 * speed)) / canvas_height / 10

				}

				//clear
				cxt.clearRect(0, 0, canvas_len, canvas_height);

				//draw
				var interval = canvas_len / (data_len - 1);

				for (i = 0; i < data_len - 1; i++) {
					cxt.fillStyle = "#1878f0";
					//cxt.fillStyle="#0066FF";
					//cxt.fillStyle="#000000";
					cxt.beginPath();

					cxt.moveTo(i * interval, canvas_height)
					cxt.lineTo(i * interval, canvas_height * (1 - data[i]))
					cxt.lineTo((i + 1.2) * interval, canvas_height * (1 - data[i + 1]))
					cxt.lineTo((i + 1.2) * interval, canvas_height)
					cxt.lineTo(i * interval, canvas_height)

					cxt.closePath();
					cxt.fill();
				}
			}

			requestAnimFrame(function() {
				draw_canvas(c, startTime);
			});
		}

		function drawSector(callback) {
			draw_canvas($('#rain_line').get(0), (new Date()).getTime());
		}

		var randar_layers = [];
		var domain = 'http://rain.swarma.net'
		var $play_time = $('#play_time');

		/*播放器*/
		var Player = (function() {

			var isPlaying = false;
			var $btn_play = $('#btn_play').click(function() {
				var $this = $(this);
				if ($this.hasClass('pause')) {
					pause();
					$this.removeClass('pause');
				} else {
					play();
					$this.addClass('pause');
				}
			});
			var delay = 100;
			var delay_stop = 3000;
			var currentIndex = 0;
			var newLayer, oldLayer;
			var playTT;
			var play = function() {
				isPlaying = true;
				oldLayer = randar_layers[currentIndex];
				oldLayer.setOpacity(0);
				var len = randar_layers.length;
				var nextIndex = currentIndex + 1 < len ? currentIndex + 1 : 0;
				newLayer = randar_layers[nextIndex];

				newLayer.setOpacity(showOpacity);
				$play_time.text(newLayer.time);
				oldLayer = newLayer;
				currentIndex = nextIndex;
				var isStop = currentIndex == len - 1;
				if (isStop) {
					$btn_play.removeClass('pause');
				} else {
					$btn_play.addClass('pause');
				}
				playTT = setTimeout(play, isStop ? delay_stop : delay);
			}
			var pause = function() {
				isPlaying = false;
				clearTimeout(playTT);
			}
			return {
				reset: function() {
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

		function mapInit() {
			var initLngLat = new AMap.LngLat(initLon, initLat);
			var mousewheelTT;
			$('#map').on('mousewheel', function(e) {
				// 防止鼠标滚轮太灵敏
				mousewheelTT = setTimeout(function() {
					clearTimeout(mousewheelTT);
					if (e.deltaY == 1) {
						mapObj.zoomIn();
					} else if (e.deltaY == -1) {
						mapObj.zoomOut();
					}
				}, 300);
			});
			mapObj = new AMap.Map("map", {
				scrollWheel: false, //可通过鼠标滚轮缩放地图
				doubleClickZoom: true, //可以双击鼠标放大地图
				//修改地图默认图层为卫星图
				// layers:[new AMap.TileLayer.Satellite()],
				view: new AMap.View2D({
						center: initLngLat,
						zoom: parseInt(getParam('zoom')) || 6,
						// touchZoom: true,
						crs: 'EPSG3857'
					}) //2D地图显示视口  
			});

			// mapObj = new AMap.Map('map',{resizeEnable: true, center: initLngLat, level: 5, touchZoom: true});
			AMap.event.addListener(mapObj, 'complete', function() {
				// console.log('map complete');
				//在地图中添加ToolBar插件
				mapObj.plugin(["AMap.ToolBar"], function() {
					var toolBar = new AMap.ToolBar();
					// console.log(toolBar);
					mapObj.addControl(toolBar);
				});

				mapObj.plugin(['AMap.Geolocation'], function() {
					var geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						timeout: 5000, //超过10秒后停止定位，默认：无穷大
						buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
						zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
						buttonPosition: 'RB'
					});
					var cb_geo_complete;
					AMap.event.addListener(geolocation, 'complete', function(data) {
						if (data && data.type == 'complete' && data.info == "SUCCESS") {
							var pos = data.position;
							var lat = pos.lat;
							var lng = pos.lng;
							cb_geo_complete && cb_geo_complete(null, {
								lat: lat,
								lon: lng
							});
						} else {
							cb_geo_complete && cb_geo_complete('定位失败!');
						}
					});

					getGeoInfo = function(cb_sucess, cb_error) {
						$locate.text('正在定位...');
						cb_geo_complete = function(err, data) {
							if (err) {
								cb_error && cb_error(err);
							} else {
								cb_sucess && cb_sucess(data);
							}
							cb_geo_complete = null;
						}
						geolocation.getCurrentPosition();
					}

					if (!is_have_location) {
						getGeoInfo(function(result) {
							initLat = result.lat;
							initLon = result.lon;
							afterGeo();
						}, afterGeo);
					}
				});
			});

			if (mapType == MAP_TYPE_SATELLITE) {
				mapObj.setLayers([new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()]);
			} else {
				//地图类型切换
				mapObj.plugin(["AMap.MapType"], function() {
					var type = new AMap.MapType({
						defaultType: 0,
						showRoad: true
					}); //初始状态使用2D地图
					mapObj.addControl(type);
					// 地图类型改变时强制重绘
					$('.amap-maptype-con').click(function() {
						renderImgLayer();
					});
				});
			}

			// mapObj = new AMap.Map('map',{resizeEnable: true, center: initLngLat, level: 5, touchZoom: true});

			var lngLatCache;
			var currentMaker;
			/*设置标记点*/
			var setMarker = function(lngLat) {
				currentMaker && currentMaker.hide();
				lngLatCache = lngLat;
				var marker = new AMap.Marker({
					map: mapObj,
					icon: new AMap.Icon({
						image: "./img/mark.png",
						size: new AMap.Size(30, 30)
					}),
					position: lngLat
				});
				currentMaker = marker;
			}
			setMarker(initLngLat);
			var setCenter = function(lon, lat) {
				var lngLat = new AMap.LngLat(lon, lat);
				mapObj.setCenter(lngLat);
				setMarker(lngLat);
			}

			var isSupportTouch = 'ontouchstart' in window;
			var mousedownTT;
			var oldPixel;
			//为地图注册click事件获取鼠标点击出的经纬度坐标
			var clickEventListener = AMap.event.addListener(mapObj, isSupportTouch ? 'touchstart' : 'mousedown', function(e) {
				oldPixel = e.pixel;
				mousedownTT = setTimeout(function() {
					if (isSupportTouch) {
						// alert(e.touches)
					}
					initLon = e.lnglat.getLng(),
						initLat = e.lnglat.getLat();
					// setCenter(lon,lat);
					var lngLat = new AMap.LngLat(initLon, initLat);
					// setMarker(lngLat);
					refresh(initLon, initLat);
				}, 600);
			});
			var MIN_DIS = 30;
			AMap.event.addListener(mapObj, isSupportTouch ? 'touchmove' : 'mousemove', function(e) {
				if (oldPixel) {
					var newPixed = e.pixel;
					var x = Math.abs(newPixed.x - oldPixel.x);
					var y = Math.abs(newPixed.y - oldPixel.y);
					if (x > MIN_DIS || y > MIN_DIS) {
						clearTimeout(mousedownTT);
					}
				}

			});
			AMap.event.addListener(mapObj, isSupportTouch ? 'touchend' : 'mouseup', function(e) {
				clearTimeout(mousedownTT);
			});
			return {
				clearLayer: function() {
					mapObj.clearMap();
					setMarker(lngLatCache);
				},
				setMarker: function(lon, lat) {
					var lngLat = new AMap.LngLat(lon, lat);
					setMarker(lngLat);
				},
				resetCenter: setCenter
			}
		}

		/*根据经纬度得到地名*/
		var lnglatToAddress = function(lon, lat, callback) {
			var geocoder = new AMap.Geocoder({
				radius: 1000,
				extensions: "all"
			});
			var lnglatXY = [lon, lat];
			geocoder.getAddress(lnglatXY, function(status, result) {
				if (status === 'complete' && result.info === 'OK') {
					var address = result.regeocode.formattedAddress;
				} else {
					var address = '未知地点';
				}
				callback && callback(address);
			});
		}
		var addressToLnglat = function(text, callback) {
			var placeSearch = new AMap.PlaceSearch({
				pageSize: 1,
				pageIndex: 1
			});
			placeSearch.search(text, function(status, result) {
				if (status === 'complete' && result.info === 'OK') {
					try {
						var pois = result.poiList.pois[0];
						var locate = pois.location;
						var data = {
							lng: locate.lng,
							lat: locate.lat,
							address: pois.address
						};
						return callback && callback(data);
					} catch (e) {
						console.log(e);
					}
				}

				alert('未找到您输入的地址，请重新输入！');
			});
		}
		var _search = function(text) {
			if (!text) {
				return alert('请输入要查询的地点！');
			}
			addressToLnglat(text, function(data) {
				if (data) {
					mapTool.resetCenter(data.lng, data.lat);
					refresh(data.lng, data.lat, data.address);
				} else {
					alert('哎呀！地图君忘了“' + text + '”在哪里了！我们等下再问问他？');
				}
				$search_input.val('').blur();
			});
		}
		$('#form_search').on('submit', function() {
			_search($search_input.val());
			return false;
		});
		$('#btn_locate').click(function() {
			getGeoInfo(function(result) {
				initLat = result.lat;
				initLon = result.lon;
				afterGeo();
			}, afterGeo);
		});
		var data_server_time = 0;
		var radar_desc = '';
		var $win = $(window);
		var win_width = $win.width(),
			win_height = $win.height();

		function getServerTime() {
			var time = new Date(data_server_time * 1000);
			var hours = time.getHours();
			if (hours < 10) {
				hours = '0' + hours;
			}
			var minutes = time.getMinutes();
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			time = hours + ':' + minutes;
			return time;
		}
		var share = function() {}
		if (OS.isNativeApp) {
			$('#btn_share').click(function() {
				U.command('toast', {
					msg: '正在处理...'
				});
				var fn = function() {
					html2canvas(document.body, {
						onrendered: function(canvas) {
							var newCanvas = document.createElement('canvas');
							newCanvas.width = win_width;
							newCanvas.height = win_height;
							ctx = newCanvas.getContext("2d");
							var imgData = canvas.getContext("2d").getImageData(0, 0, win_width, win_height);
							ctx.putImageData(imgData, 0, 0);
							var img = newCanvas.toDataURL();

							U.command('share', {
								url: 'http://decision.tianqi.cn/randar/' + location.hash,
								img: img,
								imgLen: img.length,
								time: getServerTime(),
								desc: radar_desc,
								address: $('.locate').text()
							});
						}
					});
				}
				if (typeof html2canvas == 'undefined') {
					$.getScript('js/html2canvas.js', fn);
				} else {
					fn();
				}
			});
		} else {
			var initShare = false;
			share = function() {
				var url = encodeURIComponent('http://decision.tianqi.cn/randar/' + location.hash);
				var desc = encodeURIComponent('天气管家' + getServerTime() + '播报,' + ($('.locate').text().trim()) + '(' + url + '):' + radar_desc);
				var title = document.title;
				$('#btn_share').attr('target', '_blank').attr('href', 'http://www.jiathis.com/send/?webid=shareID&url=' + url + '&title=&summary=' + desc + '&uid=$uid');
			}
		}

		$('#btn_back').click(function() {
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
				url: prefix_req + 'imgs.php?type=cloud',
				isSelected: true,
			},
			'radar': {
				name: '雷达图',
				url: prefix_req + 'imgs.php?type=radar',
				isShowJS: true
			},
			'precipitation': {
				name: '降水图',
				url: prefix_req + 'imgs.php?type=precipitation',
				isShowJS: true
			},
			'leidian': {
				name: '雷电',
				url: prefix_req + 'imgs.php?type=leidian',
			}
		};
		var defaultSetting = '';
		var currentImgArr = [];
		var EXRE_IMG_URL = /loncenter=([-\d.]+)&latcenter=([-\d.]+)&lonspan=([-\d.]+)&latspan=([-\d.]+)/;

		function renderImgLayer(imgs) {
			if (!imgs) {
				imgs = currentImgArr;
			} else {
				currentImgArr = imgs;
			}

			mapTool.clearLayer();
			randar_layers = [];
			$.each(currentImgArr, function(i, v) {
				// var posArr = v[2];
				// var leftTop = new AMap.LngLat(posArr[1], posArr[0]),
				// 	rightBottom = new AMap.LngLat(posArr[3], posArr[2]),
				// 	bounds = new AMap.Bounds(leftTop, rightBottom);

				// var img = domain + v[0];
				var img = v.l2;
				var pos = v.pos;
				if (pos) {
					var leftTop = new AMap.LngLat(pos[1], pos[0]);
					var rightBottom = new AMap.LngLat(pos[3], pos[2]);
				} else {
					var m = EXRE_IMG_URL.exec(img);
					var center_lng = parseFloat(m[1]),
						center_lat = parseFloat(m[2]),
						span_lng = parseFloat(m[3]) / 2,
						span_lat = parseFloat(m[4]) / 2;

					var leftTop = new AMap.LngLat(center_lng, 12.2),
						rightBottom = new AMap.LngLat(137.0, 54.2),

						leftTop = new AMap.LngLat(center_lng - span_lng, center_lat - span_lat),
						rightBottom = new AMap.LngLat(center_lng + span_lng, center_lat + span_lat);
				}
				
				var bounds = new AMap.Bounds(leftTop, rightBottom);
				var new_layer = new AMap.GroundImage(img, bounds, {
					map: mapObj,
					clickable: false
				});
				new_layer.setMap(mapObj);

				new_layer.setOpacity(i == 0 ? showOpacity : 0);
				var time = new Date(v[1] * 1000);
				var time = v.l1;
				if (typeof time == 'string') {
					time = time.substr(11, 5);
				} else {
					var hours = time.getHours();
					if(hours < 10){
						hours = '0'+hours;
					}
					var minutes = time.getMinutes();
					if(minutes < 10){
						minutes = '0'+minutes;
					}

					time = hours+':'+minutes;
				}
				new_layer.time = time;
				randar_layers.push(new_layer);
			});
			$play_time.text(randar_layers.slice(-1)[0].time);
		}
		var currentImgType;
		var $info = $('.info'),
			$body = $('body');
		var $locate = $('.locate').text('正在定位');
		function initImgLayer(type, lnglat, isFromRefresh) {
			type = type || defaultSetting;
			currentImgType = type;

			if (!isFromRefresh) {
				if ($info.css('position') == 'absolute') {
					var isShowJS = imgLayerConf[type]['isShowJS'];
					if (isShowJS) {
						$body.removeClass('no_js');
						// $info.show();
						refresh(initLon, initLat);
						// init_canvas_size();
						// drawSector();
					} else {
						$body.addClass('no_js');
						// $info.hide();
					}
				}
			}

			Player.reset();
			// Player.play();
			var url = imgLayerConf[type]['url'];
			if (lnglat && !is_show_all_img) {
				url += (url.indexOf('?') > -1 ? "&" : "?") + "lnglat=" + lnglat;
			}

			$.getJSON(url, function(data) {
				if (type == 'radar') {
					var imgs = data.radar_img;
					if (imgs) {
						var imgs_new = [];
						$.each(imgs, function(i, d) {
							imgs_new.push({
								l1: new Date(d[1]*1000),
								l2: d[0],
								pos: d[2]
							});
						});
						imgs = imgs_new;
					}
				} else {
					var imgs = data.l.reverse();
				}
				renderImgLayer(imgs);
				var auto_play = !!getParam('auto_play', false);
				if (auto_play) {
					Player.reset();
					Player.play();
				}
			});
		}
		var $tool_bar = $('.tool_bar').click(function(e) {
			var $target = $(e.target);
			if ($target.is('span')) {
				initImgLayer($target.data('type'), [initLon, initLat].join());
				$target.parent().addClass('on').siblings().removeClass('on');
			}
		});
		var img_type = getParam('it');

		if (img_type) {
			defaultSetting = img_type;
		} else {
			for (var i in imgLayerConf) {
				var item = imgLayerConf[i];
				if (img_type == i) {
					defaultSetting = i;
					break;
				} else {
					var $div = $('<div><span data-type="' + i + '">' + item.name + '</span></div>').data('type', i);
					if (item.isSelected) {
						$div.addClass('on');
						defaultSetting = i;
					}
					$tool_bar.append($div);
				}
			}
		}
		// console.log(defaultSetting,imgLayerConf[defaultSetting].isShowJS);
		if (imgLayerConf[defaultSetting].isShowJS) {
			$('body').removeClass('no_js');
		} else {
			$('#map').height(win_height - 180);
		}
		var REG_DATA_TIME = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
		var DATA_TYPE_MYSELF = 1,
			DATA_TYPE_OTHER = 2;

		function formatMySelfData(data) {
			var list = data.l;
			var data_arr = [];
			for (var i in list) {
				data_arr.push([i, parseFloat(list[i]) / 60]);
			}
			data_arr.sort(function(a, b) {
				return a[0] < b[0] ? 1 : -1;
			});
			var dataseries = [];
			$.each(data_arr, function(i, v) {
				dataseries.push(v[1]);
			});
			var m = REG_DATA_TIME.exec(data.t1);
			return {
				type: DATA_TYPE_MYSELF,
				status: 'ok',
				temp: 10,
				server_time: new Date(m[1] + "-" + m[2] + "-" + m[3] + " " + m[4] + ":" + m[5] + ":" + m[6]).getTime() / 1000,
				descript_now: '',
				summary: '　',
				dataseries: dataseries
			};
		}
		var last_data; //最后的可用数据
		var last_data_type;
		var delay_refresh = 1000 * 60 * 10;

		function refresh(lon, lat, address) {
			var lnglat = (Number(lon).toFixed(4)) + "," + (Number(lat).toFixed(4));
			if (!str_search_from_command) {
				var urlnow = document.URL;
				urlnow = urlnow.split("#")[0];
				var newUrl = urlnow + "#" + lnglat;
				history.pushState({}, title, newUrl);
			}

			clearTimeout(refreshTT);
			mapTool.resetCenter(lon, lat);
			if (address) {
				$locate.text(address);
			} else {
				lnglatToAddress(lon, lat, function(result) {
					$locate.text(result);
				});
			}
			if (imgLayerConf[currentImgType || defaultSetting].isShowJS) {
				$desc.html('&nbsp;');
				ajax_data && ajax_data.abort();

				if (is_use_myself_data) {
					var url = prefix_req + "data_test.php?lonlat=" + [lon, lat].join(',');
					var formatData = formatMySelfData;
				} else {
					var url = prefix_req + 'data.php?lonlat=' + [lon, lat].join(',');
					var formatData = function(d) {
						return d;
					};
				}

				$desc.text('正在加载降水预报数据。。');
				getJSONP(url, function(data) {
					data = formatData(data);

					// if (data_server_time > data.server_time) {
					// 	return;
					// }
					// data_server_time = data.server_time;
					// if (data.status != 'ok') {
					// 	// console.log(errorReason[data.error_type[0]]);
					// 	return;
					// }
					var result = data.result;
					if (!result) {
						return;
					}
					data = result.minutely;
					radar_desc = data.description;
					$desc.text(radar_desc);
					rainfall_data = data.precipitation.slice(0, 60);
					var t = result.hourly.temperature[0].value < -2 ? '雪' : '雨';
					$('.level_c .leve_1 .type_flag').text(t);
					init_canvas_size();
					drawSector();
					share();
					// Player.reset();
					// Player.play();

					refreshTT = setTimeout(function() {
						refresh(lon, lat);
					}, delay_refresh);
				}, function() {
					$desc.text('分钟级降水数据加载错误！');
					U.command('isCanUseNetwork', function(flag) {
						if (!flag) {
							showNetWorkStatus();
						}

						refreshTT = setTimeout(function() {
							refresh(lon, lat);
						}, delay_refresh);
					});
				});
			} else {
				refreshTT = setTimeout(function() {
					refresh(lon, lat);
				}, delay_refresh);
			}

			initImgLayer(currentImgType, lnglat, true);
		}

		function afterGeo() {
			console.log('afterGeo:initLon = ' + initLon + ',initLat = ' + initLat);
			refresh(initLon, initLat);
		}
		var callbackName = 'cb_' + new Date().getTime();
		var mapTool;
		var is_have_location = false;
		window[callbackName] = function() {
			U.command('hideRadar');
			console.log('after hideRadar');
			U.command('checkVersion');
			mapTool = mapInit();
			// initImgLayer(defaultSetting);
			var lonlat = U.command('getLonlat');
			console.log('getLonlat:' + lonlat);
			if (!lonlat) {
				var urlnow = document.URL;
				var urlArr = urlnow.split("#");
				lonlat = urlArr[1];
			}

			if (lonlat) {
				lonlat = lonlat.split(',');
				if (lonlat.length == 2) {
					var lng = lonlat[0];
					var lat = lonlat[1];
					if (!isNaN(lng) && !isNaN(lat)) {
						initLon = lng;
						initLat = lat;
						afterGeo();
						is_have_location = true;
						return;
					}
				}
			}
		}
		$.getScript('http://webapi.amap.com/maps?v=1.3&plugin=AMap.Geocoder,AMap.PlaceSearch&key=d0e895a4c4b5f0c632f8ed3985f0247f&callback=' + callbackName).fail(showNetWorkStatus);

		var is_show_all_img = !!getParam('a_img', false),
			is_use_myself_data = false; //!!getParam('use_my',true);
		if (location.href.indexOf('debug') > -1) {
			$('.tab_bar').show();
			// console.log(is_show_all_img,is_use_myself_data);
			is_show_all_img = $('[name=all_img]').prop('checked', is_show_all_img).on('click', function() {
				is_show_all_img = $(this).prop('checked');
				initImgLayer(currentImgType, [initLon, initLat].join());
			}).prop('checked');
			// is_use_myself_data = $('[name=data]').prop('checked',is_use_myself_data).on('click',function(){
			// 	is_use_myself_data = $(this).prop('checked');
			// 	refresh(initLon,initLat);
			// }).prop('checked');
		}
	})
}();