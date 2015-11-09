function log(a) {
	// ga("send", "pageview", a)
}

function event(a) {
	// ga("send", "event", a + " UA:" + navigator.userAgent)
}
L.TileLayer.Multi = L.TileLayer.extend({
		_tileDefs: [],
		initialize: function(a, b) {
			L.TileLayer.prototype.initialize.call(this, void 0, b);
			var c = this.options.minZoom;
			for (var d in a)
				for (var e = this._fixTileDef(a[d]); d >= c; c++) this._tileDefs[c] = e
		},
		_fixTileDef: function(a) {
			var b = L.extend({}, {
				subdomains: L.TileLayer.prototype.options.subdomains
			}, a);
			return "string" == typeof b.subdomains && (b.subdomains = b.subdomains.split("")), b
		},
		_getSubdomain: function(a, b) {
			var c = (a.x + a.y) % b.length;
			return b[c]
		},
		setUrl: function() {},
		getTileUrl: function(a) {
			var b = this._getZoomForUrl(),
				c = this._tileDefs[b];
			return this._adjustTilePoint(a), L.Util.template(c.url, L.extend({
				s: this._getSubdomain(a, c.subdomains),
				z: b,
				x: a.x,
				y: a.y
			}, this.options))
		}
	}), L.TileLayer.multi = function(a, b) {
		return new L.TileLayer.Multi(a, b)
	},
	function() {
		var a = L.Marker.prototype.onAdd,
			b = L.Marker.prototype.onRemove;
		L.Marker.mergeOptions({
			bounceOnAdd: !1,
			bounceOnAddOptions: {
				duration: 1e3,
				height: -1
			},
			bounceOnAddCallback: function() {}
		}), L.Marker.include({
			_toPoint: function(a) {
				return this._map.latLngToContainerPoint(a)
			},
			_toLatLng: function(a) {
				return this._map.containerPointToLatLng(a)
			},
			_motionStep: function(a) {
				var b = this,
					c = new Date;
				b._intervalId = setInterval(function() {
					var d = new Date - c,
						e = d / a.duration;
					e > 1 && (e = 1);
					var f = a.delta(e);
					a.step(f), 1 === e && (a.end(), clearInterval(b._intervalId))
				}, a.delay || 10)
			},
			_bounceMotion: function(a, b, c) {
				var d = L.latLng(this._origLatlng),
					e = this._dropPoint.y,
					f = this._dropPoint.x,
					g = this._point.y - e,
					h = this;
				this._motionStep({
					delay: 10,
					duration: b || 1e3,
					delta: a,
					step: function(a) {
						h._dropPoint.y = e + g * a - (h._map.project(h._map.getCenter()).y - h._origMapCenter.y), h._dropPoint.x = f - (h._map.project(h._map.getCenter()).x - h._origMapCenter.x), h.setLatLng(h._toLatLng(h._dropPoint))
					},
					end: function() {
						h.setLatLng(d), "function" == typeof c && c()
					}
				})
			},
			_easeOutBounce: function(a) {
				return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
			},
			bounce: function(a, b) {
				this._origLatlng = this.getLatLng(), this._bounce(a, b)
			},
			_bounce: function(a, b) {
				"function" == typeof a && (b = a, a = null), a = a || {
					duration: 1e3,
					height: -1
				}, "number" == typeof a && (a.duration = arguments[0], a.height = arguments[1]), this._origMapCenter = this._map.project(this._map.getCenter()), this._dropPoint = this._getDropPoint(a.height), this._bounceMotion(this._easeOutBounce, a.duration, b)
			},
			_getDropPoint: function(a) {
				this._point = this._toPoint(this._origLatlng);
				var b;
				return b = void 0 === a || 0 > a ? this._toPoint(this._map.getBounds()._northEast).y : this._point.y - a, new L.Point(this._point.x, b)
			},
			onAdd: function(b) {
				this._map = b, this._origLatlng = this._latlng, this.options.bounceOnAdd === !0 && ("undefined" != typeof this.options.bounceOnAddDuration && (this.options.bounceOnAddOptions.duration = this.options.bounceOnAddDuration), "undefined" != typeof this.options.bounceOnAddHeight && (this.options.bounceOnAddOptions.height = this.options.bounceOnAddHeight), this._dropPoint = this._getDropPoint(this.options.bounceOnAddOptions.height), this.setLatLng(this._toLatLng(this._dropPoint))), a.call(this, b), this.options.bounceOnAdd === !0 && this._bounce(this.options.bounceOnAddOptions, this.options.bounceOnAddCallback)
			},
			onRemove: function(a) {
				clearInterval(this._intervalId), b.call(this, a)
			}
		})
	}();
var global = {
	server: "https://www.windyty.com/",
	suffix: "-tiny",
	levels: ["surface", "975h", "950h", "925h", "900h", "850h", "800h", "750h", "700h", "450h", "300h", "200h", "150h"],
	overlays: ["wind", "temp", "pressure", "clouds", "rh"],
	texts: ["DETAILED", "WEBCAMS", "TEMP", "PRESS", "NEXT"],
	embed: !0,
	numberOfDays: 8,
	version: "1.0"
};
window.onerror = function(a, b, c, d, e) {
	event("Version:" + global.version + " Error:" + a + " url:" + b + " line:" + c + " column:" + d + " error:" + e + " UA:" + navigator.userAgent)
};
var myApp = angular.module("myApp", ["pascalprecht.translate"]).config(["$locationProvider", "transProvider", "$compileProvider", function(a, b, c) {
	a.html5Mode(!0), c.debugInfoEnabled(!1), b.init()
}]).service('proxy', ["$http", function(http){
	return {
		get: function(url){
			return http.get('http://10.14.85.116/php/proxy.php?url='+url);
		}
	}
}]).run(["$rootScope", "$location", "$http", "$translate", "trans", "maps", "proxy", function(a, b, c, d, e, f, proxy) {
	{
		var g, h = b.search();
		b.path()
	}
	if (h)
		for (var i in h) break;
	i && i.match(/\S+,\S+,\S+/) && (a.url = i, g = i.split(",")), g && g.length > 5 && (a.level = global.levels.indexOf(g[0]) > -1 ? g[0] : "surface", a.overlay = global.overlays.indexOf(g[1]) > -1 ? g[1] : "wind", a.date = g[2].match(/^(\d\d\d\d)-(\d\d)-(\d\d)-(\d\d)$/) ? g[2].replace(/-/g, "/") : null, a.sharedCoords = g[5] ? {
		lat: parseFloat(g[3]),
		lon: parseFloat(g[4]),
		zoom: parseInt(g[5])
	} : null, g[7] && "menu" == g[7] && (a.menu = !0), g[8] && "message" == g[8] && (a.message = !0), g[9] && "ip" == g[9] && (a.ip = !0)), a.initCoords = {
		lat: 39,
		lon: -100,
		zoom: 3
	}, f.initTiles(10), a.ip || !a.sharedCoords ? c.get("https://www.windyty.com/node/geoip").success(function(a) {
		a && a.ll && f.center({
			lat: a.ll[0],
			lon: a.ll[1],
			zoom: 5
		})
	}) : f.center(a.sharedCoords), !a.ip && a.marker && L.marker([a.sharedCoords.lat, a.sharedCoords.lon]).addTo(f), d.use(h.lang ? h.lang : d.preferredLanguage()), a.$emit("$translateChangeSuccess")

	proxy.get('http://api.tianqi.cn:8070/v1/img.py').success(function(data){
		console.log(data);
	});
}]);
myApp.service("conversions", [function() {
	function a(a, b, c, d) {
		function e(a) {
			return a * (Math.PI / 180)
		}
		var f = 6371,
			g = e(c - a),
			h = e(d - b),
			i = Math.sin(g / 2) * Math.sin(g / 2) + Math.cos(e(a)) * Math.cos(e(c)) * Math.sin(h / 2) * Math.sin(h / 2),
			j = 2 * Math.atan2(Math.sqrt(i), Math.sqrt(1 - i)),
			k = f * j;
		return k
	}
	return {
		bft: {
			label: "bft",
			conversion: function(a) {
				return .3 > a ? 0 : 1.5 > a ? 1 : 3.3 > a ? 2 : 5.5 > a ? 3 : 8 > a ? 4 : 10.8 > a ? 5 : 13.9 > a ? 6 : 17.2 > a ? 7 : 20.7 > a ? 8 : 24.5 > a ? 9 : 28.4 > a ? 10 : 32.6 > a ? 11 : 12
			},
			precision: 0
		},
		"m/s": {
			label: "m/s",
			conversion: function(a) {
				return a
			},
			precision: 1
		},
		"km/h": {
			label: "km/h",
			conversion: function(a) {
				return 3.6 * a
			},
			precision: 0
		},
		kt: {
			label: "kt",
			conversion: function(a) {
				return 1.943844 * a
			},
			precision: 0
		},
		mph: {
			label: "mph",
			conversion: function(a) {
				return 2.236936 * a
			},
			precision: 0
		},
		C: {
			label: "°C",
			conversion: function(a) {
				return a - 273.15
			},
			precision: 1
		},
		F: {
			label: "°F",
			conversion: function(a) {
				return 9 * a / 5 - 459.67
			},
			precision: 1
		},
		K: {
			label: "K",
			conversion: function(a) {
				return a
			},
			precision: 1
		},
		rh: {
			label: "%",
			conversion: function(a) {
				return a
			},
			precision: 0
		},
		hpa: {
			label: "hPa",
			conversion: function(a) {
				return a / 100
			},
			precision: 0
		},
		mmhg: {
			label: "mmHg",
			conversion: function(a) {
				return a / 133.322387415
			},
			precision: 0
		},
		inhg: {
			label: "inHg",
			conversion: function(a) {
				return a / 3386.389
			},
			precision: 2
		},
		"in": {
			label: "in/h",
			conversion: function(a) {
				return (a - 200) / 60 * .039
			},
			precision: 2
		},
		mm: {
			label: "mm/h",
			conversion: function(a) {
				return (a - 200) / 60
			},
			precision: 1
		},
		cm: {
			label: "cm/h",
			conversion: function(a) {
				return a / 60
			},
			precision: 1
		},
		insnow: {
			label: "in/h",
			conversion: function(a) {
				return .039 * a
			},
			precision: 0
		},
		cmsnow: {
			label: "cm",
			conversion: function(a) {
				return a / 10
			},
			precision: 0
		},
		inrain: {
			label: "in",
			conversion: function(a) {
				return .039 * a
			},
			precision: 1
		},
		mmrain: {
			label: "mm",
			conversion: function(a) {
				return a
			},
			precision: 0
		},
		getDistance: a
	}
}]), L.CanvasOverlay = L.Class.extend({
	initialize: function(a, b) {
		this._userDrawFunc = a, L.setOptions(this, b)
	},
	drawing: function(a) {
		return this._userDrawFunc = a, this
	},
	params: function(a) {
		return L.setOptions(this, a), this
	},
	canvas: function(a) {
		return 1 == a ? this._canvas1 : 2 == a ? this._canvas2 : this._canvas3
	},
	redraw: function() {
		return this._frame || (this._frame = L.Util.requestAnimFrame(this._redraw, this)), this
	},
	onAdd: function(a) {
		this._map = a, this._canvas1 = L.DomUtil.create("canvas", "leaflet-canvas1"), this._canvas2 = L.DomUtil.create("canvas", "leaflet-canvas2"), this._canvas3 = L.DomUtil.create("canvas", "leaflet-canvas3");
		var b = this._map.getSize();
		this._canvas1.width = this._canvas2.width = this._canvas3.width = b.x, this._canvas1.height = this._canvas2.height = this._canvas3.height = b.y;
		var c = this._map.options.zoomAnimation && L.Browser.any3d;
		L.DomUtil.addClass(this._canvas1, "leaflet-zoom-" + (c ? "animated" : "hide")), L.DomUtil.addClass(this._canvas2, "leaflet-zoom-" + (c ? "animated" : "hide")), L.DomUtil.addClass(this._canvas3, "leaflet-zoom-" + (c ? "animated" : "hide")), a._panes.overlayPane.appendChild(this._canvas1), a._panes.overlayPane.appendChild(this._canvas2), a._panes.overlayPane.appendChild(this._canvas3), a.on("moveend", this._reset, this), a.on("resize", this._resize, this), a.options.zoomAnimation && L.Browser.any3d && a.on("zoomanim", this._animateZoom, this), this._reset()
	},
	onRemove: function(a) {
		a.getPanes().overlayPane.removeChild(this._canvas1), a.getPanes().overlayPane.removeChild(this._canvas2), a.off("moveend", this._reset, this), a.off("resize", this._resize, this), a.options.zoomAnimation && a.off("zoomanim", this._animateZoom, this), this_canvas = null
	},
	addTo: function(a) {
		return a.addLayer(this), this
	},
	_resize: function(a) {
		this._canvas1.width = this._canvas2.width = this._canvas3.width = a.newSize.x, this._canvas1.height = this._canvas2.height = this._canvas3.height = a.newSize.y
	},
	_reset: function() {
		var a = this._map.containerPointToLayerPoint([0, 0]);
		L.DomUtil.setPosition(this._canvas1, a), L.DomUtil.setPosition(this._canvas2, a), L.DomUtil.setPosition(this._canvas3, a), this._redraw()
	},
	_redraw: function() {
		var a = this._map.getSize(),
			b = this._map.getBounds(),
			c = 180 * a.x / (20037508.34 * (b.getEast() - b.getWest())),
			d = this._map.getZoom();
		this._userDrawFunc && this._userDrawFunc(this, {
			canvas1: this._canvas1,
			canvas2: this._canvas2,
			canvas3: this._canvas3,
			bounds: b,
			size: a,
			zoomScale: c,
			zoom: d,
			options: this.options
		}), this._frame = null
	},
	_animateZoom: function(a) {
		var b = this._map.getZoomScale(a.zoom),
			c = this._map._getCenterOffset(a.center)._multiplyBy(-b).subtract(this._map._getMapPanePos());
		this._canvas1.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")", this._canvas2.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")", this._canvas3.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")"
	}
}), L.canvasOverlay = function(a, b) {
	return new L.CanvasOverlay(a, b)
}, languages = {
	en: {
		MON: "Monday",
		TUE: "Tuesday",
		WED: "Wednesday",
		THU: "Thursday",
		FRI: "Friday",
		SAT: "Saturday",
		SUN: "Sunday",
		TODAY: "Today",
		TOMORROW: "Tomorrow",
		MON2: "Mon",
		TUE2: "Tue",
		WED2: "Wed",
		THU2: "Thu",
		FRI2: "Fri",
		SAT2: "Sat",
		SUN2: "Sun",
		TODAY2: "Today",
		TOMORROW2: "Tomor",
		WIFCST: "wind forecast",
		WEFCST: "weather forecast",
		CHANGE: "Change language",
		FOLLOW: "FOLLOW US",
		FOLLOWUS: "follow us on Facebook",
		TWEET: "share on Twitter",
		ABOUT: "About (in english only)",
		EMBED: "Embed Windyty on your page",
		MENU: "Menu",
		MENU_CLOSE: "Close<br>menu",
		MENU_MAP: "Change background map",
		MENU_FB1: "Follow us on Facebook",
		MENU_FB2: "Share on Facebook",
		MENU_TW: "Share on Twitter",
		MENU_ABOUT: "About",
		MENU_MAP2: "...in very detailed zoom levels",
		OVERLAY: "OVERLAY",
		WIND: "Wind",
		GUST: "Wind gusts",
		WAVERAGES: "W. averages",
		TEMP: "Temperature",
		PRESS: "Pressure",
		CLOUDS: "Clouds, rain",
		LCLOUDS: "Low clouds",
		RAIN: "Rain or snow",
		SNOW: "Snow",
		SHOW_GUST: "force of wind gusts",
		RH: "Humidity",
		RACCU: "R. accumulation",
		RAINACCU: "RAIN ACCUMULATION",
		SNOWACCU: "SNOW ACCUMULATION",
		WINDAVERAGES: "AVERAGE WIND SPEED",
		SNOWCOVER: "Actual Snow Cover",
		ACC_LAST_DAYS: "Last {{num}} days",
		ACC_LAST_HOURS: "Last {{num}} hours",
		ACC_NEXT_DAYS: "Next {{num}} days",
		ACC_NEXT_HOURS: "Next {{num}} hours",
		WIND_AT: "and wind directions for",
		ALTITUDE: "ALTITUDE",
		SFC: "Surface",
		O_DISABLED: "Overlays are not shown on detailed maps",
		DATE_AND_TIME: "TIME",
		CLICK_ON_LEGEND: "Click to change metric",
		SEARCH: "Search location...",
		NEXT: "Next results...",
		RECENTS: "Recent searches",
		DAYS_AGO: "{{daysago}} days ago:",
		SHOW_ACTUAL: "Show actual forecast",
		DETAILED: "Detailed forecast...",
		DETAILEDMETAR: "Weather trend and forecast...",
		WEBCAMS: "and nearest webcams",
		MESSAGE1: "Click on the map for awesome local weather forecast",
		MESSAGE2: "Webmaster? Journalist? Embed Windyty on your page.",
		MESSAGE3: "Pilot? Try KICT in search box.",
		D_CLOSE: "Close<br>detail",
		D_SHOW_ON: "show on",
		D_GMAPS: "Google Maps",
		D_COURTESY: 'More forecast products for this spot at <a href=" https://www.meteoblue.com/en/weather/latlon/call?lat={{lat}}&lon={{lon}}">Meteoblue.com</a>',
		D_FCST: "Forecast for this location",
		D_TEMP_IN: "Temperature in",
		D_WIND_IN: "wind in",
		D_FCST_IN: "forecast in",
		D_LT: "Local timezone",
		D_AIRGRAM1: "For experts:",
		D_AIRGRAM2: "Air meteogram for this location",
		D_WEBCAMS: "Webcams in vicinity",
		D_NO_WEBCAMS: "There are no webcams around this location (or we don't know about them)",
		D_ACTUAL: "actual image",
		D_DAYLIGHT: "image during daylight",
		D_SHOW_ANIM: "Show 24h animation",
		D_EXTERNAL: "external link to lookr.com",
		D_DISTANCE: "distance",
		D_MILES: "miles",
		D_MORE_THAN_HOUR: "more than hour ago",
		D_MIN_AGO: "{{duration}} minutes ago",
		D_SUNRISE: "Sunrise",
		D_SUNSET: "sunset",
		D_DUSK: "dusk",
		D_SUN_NEVER_SET: "Sun never set",
		D_POLAR_NIGHT: "Polar night",
		D_LT2: "local time",
		D_FAVORITES: "Add to Favorites",
		D_FAVORITES2: "Remove from Favorites",
		E_MESSAGE: "Awesome weather forecast at"
	}
}, "object" == typeof module && module.exports && (module.exports = languages), languages.zh = {
	MON: "周一",
	TUE: "周二",
	WED: "周三",
	THU: "周四",
	FRI: "周五",
	SAT: "周六",
	SUN: "周日",
	TODAY: "今天",
	TOMORROW: "明天",
	MON2: "周一",
	TUE2: "周二",
	WED2: "周三",
	THU2: "周四",
	FRI2: "周五",
	SAT2: "周六",
	SUN2: "周日",
	TODAY2: "今天",
	TOMORROW2: "明天",
	WIFCST: "风力预报",
	WEFCST: "天气预报",
	CHANGE: "更改语言",
	FOLLOW: "关注我们",
	FOLLOWUS: "在Facebook上关注我们",
	TWEET: "在Twitter上分享",
	ABOUT: "关于（仅限英语）",
	EMBED: "将windyty嵌入你的页面",
	MENU: "菜单",
	MENU_CLOSE: "选择<br>菜单",
	MENU_MAP: "更改背景地图",
	MENU_FB1: "在Facebook上关注我们",
	MENU_FB2: "在Facebook上分享",
	MENU_TW: "在Twitter上分享",
	MENU_ABOUT: "关于",
	MENU_MAP2: "...在每个详细缩放级别上",
	OVERLAY: "叠加",
	WIND: "风",
	GUST: "阵风",
	WAVERAGES: "平均风力",
	TEMP: "温度",
	PRESS: "气压",
	CLOUDS: "云、雨",
	LCLOUDS: "低云",
	RAIN: "雨或雪",
	SNOW: "雪",
	SHOW_GUST: "阵风风力",
	RH: "湿度",
	RACCU: "积雨",
	RAINACCU: "积雨",
	SNOWACCU: "积雪",
	WINDAVERAGES: "平均风速",
	SNOWCOVER: "实际积雪",
	ACC_LAST_DAYS: "最后{{num}}天",
	ACC_LAST_HOURS: "最后{{num}}小时",
	ACC_NEXT_DAYS: "接下来{{num}}天",
	ACC_NEXT_HOURS: "接下来{{num}}小时",
	WIND_AT: "和风向",
	ALTITUDE: "海拔",
	SFC: "地面",
	O_DISABLED: "详细地图上未显示叠加",
	DATE_AND_TIME: "时间",
	CLICK_ON_LEGEND: "点击更改公制/英制",
	SEARCH: "搜索地点...",
	NEXT: "后续结果...",
	RECENTS: "最近搜索",
	DAYS_AGO: "{{daysago}}天前：",
	SHOW_ACTUAL: "显示实际预报",
	DETAILED: "详细预报...",
	DETAILEDMETAR: "天气趋势和预报...",
	WEBCAMS: "以及最近的网络摄像头",
	MESSAGE1: "点击地图查看精准的当地天气预报",
	MESSAGE2: "站长？新闻记者？将windyty嵌入你的页面。",
	MESSAGE3: "飞行员？在搜索框中尝试KICT。",
	D_CLOSE: "关闭<br>详情",
	D_SHOW_ON: "显示于",
	D_GMAPS: "Google Maps",
	D_COURTESY: '关于这一地点的更多天气预报产品，请访问<a href=" https://www.meteoblue.com/en/weather/latlon/call?lat={{lat}}&lon={{lon}}">Meteoblue.com</a>',
	D_FCST: "该地点的预报",
	D_TEMP_IN: "温度：",
	D_WIND_IN: "风力：",
	D_FCST_IN: "预报：",
	D_LT: "当地时区",
	D_AIRGRAM1: "面向专家：",
	D_AIRGRAM2: "该地点的Air meteogram",
	D_WEBCAMS: "附近的网络摄像头",
	D_NO_WEBCAMS: "该地点附近没有网络摄像头（或者未知）",
	D_ACTUAL: "实际图像",
	D_DAYLIGHT: "白天图像",
	D_SHOW_ANIM: "显示24小时动画",
	D_EXTERNAL: "指向lookr.com的外部链接",
	D_DISTANCE: "距离",
	D_MILES: "英里",
	D_MORE_THAN_HOUR: "一个多小时前",
	D_MIN_AGO: "{{duration}}分钟前",
	D_SUNRISE: "日出",
	D_SUNSET: "日落",
	D_DUSK: "黄昏",
	D_SUN_NEVER_SET: "日不落",
	D_POLAR_NIGHT: "极地夜",
	D_LT2: "当地时间",
	D_FAVORITES: "添加到收藏夹",
	D_FAVORITES2: "从收藏夹中删除",
	E_MESSAGE: "精准的天气预报，就在："
}, myApp.service("progressBar", ["$rootScope", "settings", function(a, b) {
	"use strict";

	function c() {
		var a;
		(a = r.getClientRects()[0]) && (m = a.left, n = a.width)
	}

	function d(a, b, c, d) {
		return null == b && (b = Math.max(0, Math.min(1, (a.clientX - m) / n))), c.style.left = 100 * b + "%", d.innerHTML = x(parseInt(b * p) % 24), b
	}

	function e() {
		v.style.transition = s.style.transition = "all ease-in-out 250ms"
	}

	function f() {
		window.setTimeout(function() {
			v.style.transition = s.style.transition = "none"
		}, 300)
	}

	function g(a) {
		var b = d(a, null, v, w);
		return s.style.width = 100 * b + "%", b
	}

	function h(a) {
		var b = d(a.changedTouches[0], null, v, w);
		return s.style.width = 100 * b + "%", a.preventDefault(), b
	}

	function i(b) {
		q = !1, a.$emit("indexChanged", g(b)), r.addEventListener("click", k), window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", i)
	}

	function j(b) {
		q = !1, t.style.opacity = 0, a.$emit("indexChanged", h(b)), r.addEventListener("click", k), window.removeEventListener("touchmove", h), window.removeEventListener("touchend", j)
	}

	function k(b) {
		e(), a.$emit("indexChanged", g(b)), f()
	}

	function l(a, b) {
		b || e(), s.style.width = 100 * d(null, a, v, w) + "%", b || f()
	}
	var m, n, o, p, q = !1,
		r = document.getElementById("progress"),
		s = document.getElementById("progress-line"),
		t = document.getElementById("ghost-timecode"),
		u = document.getElementById("ghost-box"),
		v = document.getElementById("timecode"),
		w = document.getElementById("timecode-box");
	o = global.numberOfDays, p = 24 * o, c();
	var x = b.getHoursFunction();
	return a.$on("redrawFinished", c), v.addEventListener("mousedown", function() {
		q = !0, r.removeEventListener("click", k), window.addEventListener("mousemove", g), window.addEventListener("mouseup", i)
	}), v.addEventListener("touchstart", function() {
		q = !0, r.removeEventListener("click", k), window.addEventListener("touchmove", h), window.addEventListener("touchend", j)
	}), r.addEventListener("click", k), r.addEventListener("mouseenter", function() {
		q || (t.style.opacity = 1)
	}), r.addEventListener("mousemove", function(a) {
		q ? t.style.opacity = 0 : d(a, null, t, u)
	}), r.addEventListener("mouseleave", function() {
		t.style.opacity = 0
	}), {
		setIndex: l
	}
}]), myApp.service("maps", ["$rootScope", "storage", function(a, b) {
	var c = (new Date).getTimezoneOffset() / 4;
	a.initCoords = b.get("initCoords") || {
		lat: 30,
		lon: 0 > c ? -c : -180 + c,
		zoom: 3
	};
	var d, e = {
		hereterrain: "https://{s}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=2yTlzUbMV1TBRGbV4gku&app_code=TZTnvk1XubIKNT35MCbYgQ",
		heresat: "https://{s}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?app_id=2yTlzUbMV1TBRGbV4gku&app_code=TZTnvk1XubIKNT35MCbYgQ",
		esritopo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
	};
	return d = L.map("map_container", {
		center: [a.initCoords.lat, a.initCoords.lon],
		zoom: a.initCoords.zoom,
		zoomControl: !1
	}),L.control.zoom({
		position: "topright"
	}).addTo(d), d.initTiles = function(a, b) {
		var c = e[b] || e.esritopo;
		L.TileLayer.multi({
			10: {
				// url: "https://tiles{s}.windyty.com/tiles/" + (L.Browser.retina ? "rtnv3" : "v5") + "/{z}/{x}/{y}.jpg",
				url: 'http://api.tiles.mapbox.com/v4/ludawei.mj8ienmm/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVkYXdlaSIsImEiOiJldzV1SVIwIn0.-gaUYss5MkQMyem_IOskdA',
				url: e.heresat,
				subdomains: "1234"
			},
			17: {
				url: c,
				subdomains: "1234"
			}
		}, {
			detectRetina: !0,
			minZoom: 3,
			maxZoom: a
		}).addTo(d)
	}, d.dragMe = L.icon({
		iconUrl: "img/marker-dragme.png",
		shadowUrl: "img/marker-shadow.png",
		shadowSize: [41, 41],
		shadowAnchor: [15, 41],
		iconSize: [51, 70],
		iconAnchor: [26, 70]
	}), d.webcam = L.icon({
		iconUrl: "img/marker-webcam.png",
		shadowUrl: "img/marker-shadow.png",
		shadowSize: [41, 41],
		shadowAnchor: [15, 41],
		iconSize: [26, 36],
		iconAnchor: [13, 36]
	}), d.hit = L.icon({
		iconUrl: "img/marker-yellow-small.png",
		shadowUrl: "img/marker-shadow.png",
		shadowSize: [41, 41],
		shadowAnchor: [15, 41],
		iconSize: [26, 35],
		iconAnchor: [13, 35]
	}), d.center = function(a) {
		if ((a.lat || a.lon) && d.setView([a.lat, a.lon], a.zoom, {
				reset: !0
			}), a.panto) {
			var b = d.getSize().x;
			d.panBy([(b - a.panto) / 2 - b / 2, 0], {
				animate: !0
			})
		}
	}, d.getMyBounds = function() {
		var a = d.getBounds();
		return a._northEast = a._northEast.wrap(), a._southWest = a._southWest.wrap(), {
			left: a._southWest.lng,
			right: a._northEast.lng,
			top: a._northEast.lat,
			bottom: a._southWest.lat
		}
	}, d.on("contextmenu", function() {
		d.zoomOut()
	}), d
}]);
var overlayColors = {
	temp: {
		bounds: [193, 328],
		steps: 200,
		gradient: [
			[193, [37, 4, 42, 120]],
			[206, [41, 10, 130, 120]],
			[219, [81, 40, 40, 120]],
			[233.15, [192, 37, 149, 120]],
			[255.372, [70, 215, 215, 120]],
			[273.15, [21, 84, 187, 120]],
			[275.15, [24, 132, 14, 120]],
			[291, [247, 251, 59, 120]],
			[298, [235, 167, 21, 120]],
			[311, [230, 71, 39, 120]],
			[328, [88, 27, 67, 120]]
		]
	},
	rh: {
		bounds: [0, 110],
		steps: 30,
		gradient: [
			[0, [0, 0, 0, 80]],
			[25, [0, 0, 95, 80]],
			[60, [40, 44, 92, 60]],
			[75, [21, 13, 193, 80]],
			[90, [75, 63, 235, 100]],
			[100, [255, 53, 255, 100]],
			[110, [15, 53, 255, 100]]
		]
	},
	pressure: {
		bounds: [92e3, 108e3],
		steps: 200,
		gradient: [
			[92e3, [169, 212, 215, 120]],
			[98e3, [177, 197, 215, 120]],
			[99e3, [65, 155, 169, 120]],
			[1e5, [119, 195, 98, 120]],
			[100500, [197, 216, 56, 120]],
			[101e3, [246, 216, 36, 120]],
			[101500, [244, 140, 34, 120]],
			[102e3, [234, 102, 162, 120]],
			[103e3, [169, 96, 167, 120]],
			[105e3, [169, 47, 193, 120]],
			[108e3, [180, 60, 200, 120]]
		]
	},
	clouds: {
		bounds: [0, 1e3],
		steps: 1e3,
		gradient: [
			[10, [0, 0, 0, 80]],
			[30, [127, 127, 127, 80]],
			[100, [255, 255, 255, 90]],
			[180, [255, 255, 255, 90]],
			[200, [230, 240, 255, 90]],
			[240, [0, 108, 192, 90]],
			[270, [0, 188, 0, 90]],
			[300, [156, 220, 0, 90]],
			[350, [224, 220, 0, 90]],
			[400, [252, 132, 0, 90]],
			[500, [252, 0, 0, 90]],
			[700, [160, 0, 0, 90]],
			[1e3, [160, 0, 0, 90]]
		]
	},
	snow: {
		bounds: [0, 8e3],
		steps: 8e3,
		gradient: [
			[0, [0, 0, 0, 80]],
			[40, [0, 0, 0, 80]],
			[100, [118, 175, 222, 80]],
			[200, [108, 193, 154, 90]],
			[300, [180, 213, 85, 90]],
			[500, [242, 227, 41, 90]],
			[800, [250, 171, 50, 90]],
			[1500, [243, 116, 97, 90]],
			[3e3, [213, 133, 170, 90]],
			[8e3, [166, 142, 194, 90]]
		]
	},
	rain: {
		bounds: [0, 8e3],
		steps: 8e3,
		gradient: [
			[0, [0, 0, 0, 80]],
			[1, [0, 0, 0, 80]],
			[5, [118, 175, 222, 80]],
			[10, [108, 193, 154, 90]],
			[30, [180, 213, 85, 90]],
			[40, [242, 227, 41, 90]],
			[120, [250, 171, 50, 90]],
			[500, [243, 116, 97, 90]],
			[1e3, [213, 133, 170, 90]],
			[8e3, [166, 142, 194, 90]]
		]
	},
	snowcover: {
		bounds: [0, 3],
		steps: 30,
		gradient: [
			[0, [0, 0, 0, 100]],
			[1, [0, 212, 255, 100]],
			[3, [0, 212, 255, 100]]
		]
	},
	lclouds: {
		bounds: [0, 200],
		steps: 50,
		gradient: [
			[0, [0, 0, 0, 80]],
			[10, [0, 0, 0, 80]],
			[30, [255, 255, 255, 20]],
			[100, [255, 255, 255, 90]]
		]
	},
	wind: {
		bounds: [0, 100],
		steps: 300,
		gradient: [
			[0, [37, 74, 255, 80]],
			[1, [0, 100, 254, 80]],
			[3, [0, 200, 254, 80]],
			[5, [37, 193, 146, 80]],
			[7, [0, 230, 0, 80]],
			[9, [0, 250, 0, 80]],
			[11, [254, 225, 0, 80]],
			[13, [254, 174, 0, 80]],
			[15, [220, 74, 29, 80]],
			[17, [180, 0, 50, 80]],
			[19, [254, 0, 150, 80]],
			[21, [151, 50, 222, 80]],
			[24, [86, 54, 222, 80]],
			[27, [42, 132, 222, 80]],
			[29, [64, 199, 222, 80]],
			[100, [150, 0, 254, 80]]
		]
	},
	gust: {
		bounds: [0, 100],
		steps: 300,
		gradient: [
			[0, [37, 74, 255, 100]],
			[1, [0, 100, 254, 100]],
			[3, [0, 200, 254, 100]],
			[5, [37, 193, 146, 100]],
			[7, [0, 230, 0, 100]],
			[9, [0, 250, 0, 100]],
			[11, [254, 225, 0, 100]],
			[13, [254, 174, 0, 100]],
			[15, [220, 74, 29, 100]],
			[17, [180, 0, 50, 80]],
			[19, [254, 0, 150, 80]],
			[21, [151, 50, 222, 80]],
			[24, [86, 54, 222, 80]],
			[27, [42, 132, 222, 80]],
			[29, [64, 199, 222, 80]],
			[100, [150, 0, 254, 80]]
		]
	},
	waverages: {
		bounds: [0, 100],
		steps: 300,
		gradient: [
			[0, [37, 74, 255, 100]],
			[1, [0, 100, 254, 100]],
			[3, [0, 200, 254, 100]],
			[5, [37, 193, 146, 100]],
			[7, [0, 230, 0, 100]],
			[9, [0, 250, 0, 100]],
			[11, [254, 225, 0, 100]],
			[13, [254, 174, 0, 100]],
			[15, [220, 74, 29, 100]],
			[17, [180, 0, 50, 80]],
			[19, [254, 0, 150, 80]],
			[21, [151, 50, 222, 80]],
			[24, [86, 54, 222, 80]],
			[27, [42, 132, 222, 80]],
			[29, [64, 199, 222, 80]],
			[100, [150, 0, 254, 80]]
		]
	}
};
// NOTE: 风底图颜色
overlayColors.wind = {
		bounds: [0, 100],
		steps: 300,
		gradient: [
			[0, [152, 219, 248, 80]],
			[8.49, [50, 100, 255, 80]],
			[15.79, [254, 0, 3, 80]],
			[30, [209, 103, 211, 80]],
			[70, [238, 200, 239, 80]],
			[100, [55, 255, 255, 80]]
		]
	}
"object" == typeof module && module.exports && (module.exports = overlayColors), myApp.provider("trans", ["$translateProvider", function(a) {
	this.init = function() {
		var b, c, d, e, f = [];
		for (b in languages) a.translations(b, languages[b]), f.push(b);
		d = window.navigator, c = d.languages ? d.languages[0] : d.language || d.browserLanguage || d.systemLanguage || d.userLanguage || "en", c && f.indexOf(c) > -1 ? e = c : c && (c = c.replace(/-\S+$/, ""), e = f.indexOf(c) > -1 ? c : "en"), c != e && log("langmissing/" + c), a.preferredLanguage(e).fallbackLanguage("en")
	}, this.$get = ["$translate", "$rootScope", function(a, b) {
		var c = {};
		return b.$on("$translateChangeSuccess", function() {
			a(global.texts).then(function(a) {
				angular.copy(a, c)
			})
		}), c
	}]
}]), myApp.service("colors", [function() {
	"use strict;";

	function a(a) {
		function b(a, b) {
			var c = a[0],
				d = a[1],
				e = a[2],
				f = a[3],
				g = b[0] - c,
				h = b[1] - d,
				i = b[2] - e,
				j = b[3] - f;
			return function(a) {
				return [Math.floor(c + a * g), Math.floor(d + a * h), Math.floor(e + a * i), Math.floor(f + a * j)]
			}
		}

		function c(a, b, c) {
			return (Math.max(b, Math.min(a, c)) - b) / (c - b)
		}
		for (var d = [], e = [], f = [], g = 0; g < a.length - 1; g++) d.push(a[g + 1][0]), e.push(b(a[g][1], a[g + 1][1])), f.push([a[g][0], a[g + 1][0]]);
		return function(a) {
			var b;
			for (b = 0; b < d.length - 1 && !(a <= d[b]); b++);
			var g = f[b];
			return e[b](c(a, g[0], g[1]))
		}
	}! function() {
		var b, c;
		for (b in overlayColors) {
			var d, e = overlayColors[b],
				f = e.bounds[0],
				g = e.steps,
				h = (e.bounds[1] - f) / g,
				i = [],
				j = [],
				k = a(e.gradient);
			for (c = 0; g > c; c++) d = k(f + h * c), i[c] = d, j[c] = d.concat(d).concat(d).concat(d);
			e.preparedColors = i, e.colorsArray = j, e.step = h, e.startingValue = f
		}
	}()
	console.log(overlayColors);
}]), myApp.service("calendar", ["settings", function(a) {
	function b(a) {
		var b = Math.round(a * i),
			d = l.reduce(function(a, c) {
				return Math.abs(c - b) < Math.abs(a - b) ? c : a
			});
		return k[d] ? k[d] : c(a)
	}

	function c(a) {
		var b, c;
		a > .6 ? (b = 12, c = 6) : (b = 3, c = 0);
		var d, e = h.add(a * i),
			f = e.getUTCHours(),
			g = f % b;
		return d = .3 * b > g ? f - g + c : g >= .3 * b ? f + b - g + c : f, e.setUTCHours(d), e.toUTCPath()
	}

	function d(a) {
		var b = new Date;
		return b = b.add(6 - b.getUTCHours() % 6 + a, "hours"), b.toUTCPath()
	}

	function e() {
		return (new Date - h) / (j - h)
	}
	Date.prototype.add = function(a, b) {
		var c = new Date(this.getTime());
		return c.setTime(this.getTime() + ("days" == b ? 24 : 1) * a * 60 * 60 * 1e3), c
	}, Date.prototype.toUTCPath = function() {
		return this.toISOString().replace(/^(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$1/$2/$3/$4")
	};
	var f = global.numberOfDays,
		g = ["SUN2", "MON2", "TUE2", "WED2", "THU2", "FRI2", "SAT2"],
		h = new Date;
	h.setHours(0), h.setMinutes(0);
	var i = 24 * f,
		j = h.add(f, "days"),
		k = {},
		l = [-1e3],
		m = {},
		n = [{
			display: "TODAY",
			day: "",
			index: 0
		}, {
			display: "TOMORROW",
			day: "",
			index: 1
		}];
	return function() {
		function b(a) {
			var b = parseInt(a / 24);
			return {
				text: n[b].display,
				day: n[b].day,
				hour: o(h.add(a).getHours()),
				index: a / i
			}
		}
		var d, e, j, e, o = a.getHoursFunction();
		for (d = 2; f > d; d++) n[d] = {
			display: g[h.add(d, "days").getDay()],
			day: h.add(d, "days").getDate(),
			index: d,
			month: h.add(d, "days").getMonth() + 1
		};
		if ("object" == typeof minifest && Object.keys(minifest).length > 10) {
			for (d = -9; i + 12 > d; d++) j = h.add(d), e = j.toUTCPath(), minifest[e.replace(/^\d+\/\d+\/(\d+)\/(\d+)$/, "$1$2")] && (k[d] = e, l.push(d));
			for (d = 0; i > d; d++)(e = k[d]) && (m[e] = b(d))
		} else
			for (d = 0; i > d; d++) e = c(d / i), m[e] || (m[e] = b(d))
	}(), {
		dayHours: m,
		calendar: n,
		getPath: b,
		giveMeDate: d,
		startIndex: e
	}
}]), myApp.service("loader", ["$http", "$q", "$cacheFactory", "maps", function(a, b, c) {
	function d(a, b) {
		var c = [];
		if (0 == b) return {
			left: -180,
			right: 180,
			top: 90,
			bottom: -90,
			tiles: ["0/0"]
		};
		var d = m[b],
			e = Math.floor(a.left / d.size),
			f = Math.floor(a.right / d.size),
			g = Math.floor((90 - a.top) / d.size),
			h = Math.floor((90 - a.bottom) / d.size);
		for (e = 0 > e ? d.width + e : e, f = 0 > f ? d.width + f : f, e > f && (f += d.width), i = g; h >= i; i++)
			for (j = e; f >= j; j++) c.push(i + "/" + (j > d.width - 1 ? j - d.width : j));
		return {
			left: e,
			right: f,
			top: g,
			bottom: h,
			tiles: c
		}
	}

	function e(a, b, c) {
		var e, f = d(b, c).tiles;
		for (e = 0; e < f.length; e++)
			if (-1 == a.indexOf(f[e])) return !1;
		return !0
	}

	function f(c) {
		var e, f = b.defer(),
			i = [],
			j = [],
			m = function() {
				for (var a = 0; a < j.length; a++) j[a].resolve();
				f.reject("Cancelled")
			};
		if (0 === c.zoom) {
			var n = c.fullDirectory + c.filename,
				o = l.get(n);
			o ? f.resolve(o) : (j[0] = b.defer(), a.get(n, {
				cache: !1,
				timeout: j[0].promise
			}).success(function(a) {
				var b = g(a, c);
				l.put(n, b), f.resolve(b)
			}).error(function() {
				f.reject("Error loading a grid")
			}))
		} else {
			var p = d(c.bounds, c.zoom);
			p.tiles.forEach(function(d) {
				e = b.defer(), j.push(e), i.push(a.get(c.fullDirectory + "t" + c.zoom + "/" + d + "/" + c.filename, {
					cache: k,
					timeout: e.promise
				}))
			}), b.all(i).then(function(a) {
				var b = h(p, a, c);
				b ? f.resolve(b) : f.reject("Error loading a grid")
			}, function() {
				f.reject("Error loading a grid")
			})
		}
		return {
			promise: f.promise,
			cancel: m
		}
	}

	function g(a, b) {
		var c, d, e, f = [],
			g = 0,
			h = a[0].data,
			i = a[1] && a[1].data,
			j = a[0].header.dx,
			k = a[0].header.nx,
			l = a[0].header.ny;
		for (d = 0; l > d; d++) {
			for (e = [], c = 0; k > c; c++, g++) e[c] = "wind" == b.overlay ? [h[g] / 10, i[g] / 10] : "gust" == b.overlay ? h[g] / 10 : h[g];
			Math.floor(k * j) >= 360 && e.push(e[0]), f[d] = e
		}
		return {
			tiles: ["0/0"],
			zoom: b.zoom,
			name: b.overlay,
			level: b.level,
			product: b.product,
			nx: k,
			ny: l,
			lo1: a[0].header.lo1,
			la1: a[0].header.la1,
			lo2: a[0].header.lo2,
			la2: a[0].header.la2,
			dx: a[0].header.dx,
			dy: a[0].header.dy,
			refTime: a[0].header.refTime,
			data: f
		}
	}

	function h(a, b, c) {
		var d, e, f, g, h, i, j, d, e, k, l, n, o = 120,
			p = a.right - a.left + 1,
			q = a.bottom - a.top + 1,
			r = 0,
			s = 0,
			t = [],
			u = m[c.zoom];
		for (s = 0; q > s; s++)
			for (k = 0, d = 0; o > d; d++) {
				for (f = [], j = s * o + d, r = a.left; r < a.left + p; r++)
					for (i = b[s * p + r - a.left].data, g = i[0].data || i[0], h = i[1], e = 0; o > e; e++) l = k + e, f.push("wind" == c.overlay ? [g[l] / 10, h[l] / 10] : "gust" == c.overlay ? g[l] / 10 : g[l]);
				k += o, n = f[f.length - 1], f.push(n), f.push(n), f.push(n), f.push(n), f.push(n), f.push(n), t.push(f)
			}
		if (t.push(f), t.push(f), t.push(f), t.push(f), t.push(f), t.push(f), t && 0 != t.length) {
			var v = (1 + a.right) * u.size - u.resolution,
				w = a.left * u.size;
			return {
				tiles: a.tiles,
				zoom: c.zoom,
				name: c.overlay,
				product: c.product,
				level: c.level,
				nx: t[0].length,
				ny: t.length,
				lon1: w > 180 ? w - 360 : w,
				lon2: v > 180 ? v - 360 : v,
				lo1: w,
				lo2: v > 360 ? v - 360 : v,
				la2: 90 - a.top * u.size,
				la1: 90 - (1 + a.bottom) * u.size - u.resolution,
				dx: u.resolution,
				dy: u.resolution,
				refTime: null,
				data: t
			}
		}
		return null
	}
	var k = c("myCache", {
			capacity: 20
		}),
		l = c("gfsData", {
			capacity: 40
		}),
		m = [{
			size: 360,
			width: 1,
			resolution: 1
		}, {
			size: 30,
			width: 12,
			resolution: .25
		}, {
			size: 15,
			width: 24,
			resolution: .125
		}, {
			size: 7.5,
			width: 48,
			resolution: .0625
		}, {
			size: 3.75,
			width: 96,
			resolution: .03125
		}, {
			size: 1.875,
			width: 192,
			resolution: .015625
		}];
	return {
		load: f,
		checkTiles: e
	}
}]), myApp.service("products", ["loader", "windyty", function(a, b) {
	function c(a, b) {
		if ("undefined" == typeof minifest) return "";
		var c = a.replace(/^\d+\/\d+\/(\d+)\/(\d+)$/, "$1$2") + (b ? "t" : ""),
			d = minifest[c];
		return d ? "?" + d : ""
	}
	var d = {
			wind: "gfs",
			temp: "gfs",
			pressure: "gfs",
			clouds: "gfs",
			rh: "gfs",
			gust: "gfs",
			snow: "accumulations",
			lclouds: "gfs",
			rain: "accumulations",
			waverages: "accumulations",
			snowcover: "snowcover"
		},
		e = {
			gfs: {},
			accumulations: {},
			snowcover: {}
		};
	e.getProductString = function(a) {
		return d[a]
	};
	var f = (new Date).toISOString().replace(/^\d+-(\d+)-(\d+)T.*$/, "$1$2");
	return e.gfs = {
		level2reduce: {
			"975h": .98,
			"950h": .96,
			"925h": .93,
			"900h": .9,
			"850h": .85,
			"750h": .8,
			"700h": .75,
			"550h": .7,
			"450h": .65,
			"350h": .6,
			"300h": .55,
			"250h": .5,
			"200h": .45,
			"150h": .4
		},
		getTasks: function(b) {
			var d = this.zoom2zoom[b.mapsZoom],
				e = 0 === d ? global.suffix : "",
				f = [a.load({
					fullDirectory: global.server + "gfs/" + b.path + "/",
					filename: "wind-" + b.level + e + ".json" + c(b.path, b.detailed),
					level: b.level,
					zoom: d,
					product: "gfs",
					overlay: "wind",
					bounds: b.bounds
				})];
			return "wind" != b.overlay && (f[1] = a.load({
				fullDirectory: global.server + "gfs/" + b.path + "/",
				filename: b.overlay + "-surface" + e + ".json" + c(b.path, b.detailed),
				level: "surface",
				zoom: d,
				product: "gfs",
				overlay: b.overlay,
				bounds: b.bounds
			})), f
		},
		checkCoverage: function(b, c) {
			return b.zoom == this.zoom2zoom[c.mapsZoom] && a.checkTiles(b.tiles, c.bounds, b.zoom) ? "ok" : "no-data"
		},
		display: function(a, c, d, e) {
			b.interpolate(c, d, {
				disableOverlay: a.mapsZoom > 10,
				reduceVelocity: this.level2reduce[a.level] || 1
			}, e)
		},
		zoom2zoom: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	}, e.accumulations = {
		getTasks: function(b) {
			return [a.load({
				fullDirectory: global.server + "gfs/" + b.path + "/",
				filename: "wind-surface.json" + c(b.path, b.detailed),
				level: "surface",
				zoom: this.zoom2zoom[b.mapsZoom],
				product: "accumulations",
				overlay: "wind",
				bounds: b.bounds
			}), a.load({
				fullDirectory: global.server + "accumulations/",
				filename: b.overlay + "-" + b.acTime + ".json?" + f,
				level: "surface",
				zoom: this.zoom2zoom[b.mapsZoom],
				product: "accumulations",
				overlay: b.overlay,
				bounds: b.bounds
			})]
		},
		checkCoverage: function(b, c) {
			return b.zoom == this.zoom2zoom[c.mapsZoom] && a.checkTiles(b.tiles, c.bounds, b.zoom) ? "ok" : "no-data"
		},
		display: function(a, c, d, e) {
			b.interpolate(c, d, {
				disableOverlay: a.mapsZoom > 10
			}, e)
		},
		zoom2zoom: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	}, e.snowcover = {
		getTasks: function(b) {
			return [a.load({
				fullDirectory: global.server + "snowcover/latest/",
				filename: "snowcover.json?" + f,
				level: "surface",
				zoom: this.zoom2zoom[b.mapsZoom],
				product: "snowcover",
				overlay: "snowcover",
				bounds: b.bounds
			})]
		},
		display: function(a, c, d, e) {
			b.interpolate(c, c, {
				product: "snowcover",
				overlayOnly: !0,
				disableOverlay: a.mapsZoom > 14
			}, e)
		},
		checkCoverage: function(b, c) {
			var d = this.zoom2zoom[c.mapsZoom];
			return d > 0 && c.bounds.bottom < -29 ? "out-of-bounds" : b.zoom == d && a.checkTiles(b.tiles, c.bounds, b.zoom) ? "ok" : "no-data"
		},
		display: function(a, c, d, e) {
			b.interpolate(c, c, {
				overlayOnly: !0,
				disableOverlay: !1
			}, e)
		},
		zoom2zoom: [0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
	}, e
}]), myApp.service("legends", ["settings", function(a) {
	"use strict;";
	var b = {
		temp: {
			metric: 0,
			description: ["°C", "°F"],
			lines: [
				[237, -35, -31],
				[242, -30, -22],
				[247, -25, -13],
				[252, -20, -4],
				[257, -15, 5],
				[262, -10, 14],
				[267, -5, 23],
				[272, 0, 32],
				[277, 5, 41],
				[282, 10, 50],
				[287, 15, 59],
				[292, 20, 68],
				[297, 25, 77],
				[302, 30, 86],
				[307, 35, 95]
			]
		},
		rh: {
			metric: 0,
			description: ["%"],
			lines: [
				[75, 75],
				[80, 80],
				[85, 85],
				[90, 90],
				[95, 95],
				[100, 100]
			]
		},
		pressure: {
			metric: 0,
			description: ["hPa", "inHg"],
			lines: [
				[98e3, 980, 28.93],
				[98500, 985, 29.08],
				[99e3, 990, 29.23],
				[99500, 995, 29.38],
				[1e5, 1e3, 29.52],
				[100500, 1005, 29.67],
				[101e3, 1010, 29.82],
				[101500, 1015, 29.97],
				[102e3, 1020, 30.12],
				[102500, 1025, 30.26],
				[103e3, 1030, 30.41]
			]
		},
		wind: {
			metric: 0,
			description: ["kt", "bft", "m/s", "mph", "km/h"],
			lines: [
				[0, 0, 0, 0, 0, 0],
				[2, 4, 2, 2, 4, 7],
				[4, 8, 3, 4, 9, 14],
				[6, 12, 4, 6, 13, 22],
				[8, 16, 5, 8, 18, 29],
				[10, 20, 5, 10, 22, 36],
				[12, 24, 6, 12, 27, 43],
				[14, 28, 7, 14, 31, 50],
				[16, 32, 7, 16, 36, 58],
				[18, 36, 8, 18, 40, 65],
				[20, 44, 9, 20, 45, 72],
				[24, 48, 9, 24, 55, 88],
				[27, 52, 10, 27, 60, 96],
				[29, 56, 11, 29, 64, 103]
			]
		},
		gust: {
			metric: 0,
			description: ["kt", "bft", "m/s", "mph", "km/h"],
			lines: [
				[0, 0, 0, 0, 0, 0],
				[2, 4, 2, 2, 4, 7],
				[4, 8, 3, 4, 9, 14],
				[6, 12, 4, 6, 13, 22],
				[8, 16, 5, 8, 18, 29],
				[10, 20, 5, 10, 22, 36],
				[12, 24, 6, 12, 27, 43],
				[14, 28, 7, 14, 31, 50],
				[16, 32, 7, 16, 36, 58],
				[18, 36, 8, 18, 40, 65],
				[20, 40, 9, 20, 45, 72],
				[24, 48, 9, 24, 55, 88],
				[27, 52, 10, 27, 60, 96],
				[29, 56, 11, 29, 64, 103]
			]
		},
		waverages: {
			metric: 0,
			description: ["kt", "bft", "m/s", "mph", "km/h"],
			lines: [
				[0, 0, 0, 0, 0, 0],
				[2, 4, 2, 2, 4, 7],
				[4, 8, 3, 4, 9, 14],
				[6, 12, 4, 6, 13, 22],
				[8, 16, 5, 8, 18, 29],
				[10, 20, 5, 10, 22, 36],
				[12, 24, 6, 12, 27, 43],
				[14, 28, 7, 14, 31, 50],
				[16, 32, 7, 16, 36, 58],
				[18, 36, 8, 18, 40, 65],
				[20, 40, 9, 20, 45, 72],
				[24, 48, 9, 24, 55, 88],
				[27, 52, 10, 27, 60, 96],
				[29, 56, 11, 29, 64, 103]
			]
		},
		clouds: {
			metric: 0,
			description: ["mm", "in"],
			lines: [
				[230, .5, ".02"],
				[260, 1, ".04"],
				[290, 1.5, ".06"],
				[320, 2, ".08"],
				[380, 3, ".12"],
				[440, 4, ".16"],
				[500, 5, ".2"],
				[620, 7, ".3"],
				[800, 10, ".4"]
			]
		},
		snow: {
			metric: 0,
			description: ["cm", "in"],
			lines: [
				[80, 8, 3.1],
				[100, 10, 3.9],
				[200, 20, 8],
				[300, 30, 11],
				[500, 50, 20],
				[1e3, "1m", "3f"],
				[2e3, "2m", "6f"],
				[3e3, "3m", "9f"]
			]
		},
		rain: {
			metric: 0,
			description: ["mm", "in"],
			lines: [
				[5, 5, ".2"],
				[10, 10, ".4"],
				[20, 20, ".8"],
				[30, 30, "1.2"],
				[40, 40, 1.5],
				[100, 100, 3.9],
				[1e3, "1m", "3f"],
				[3e3, "3m", "9f"]
			]
		}
	};
	return function(c, d) {
		var e = [];
		if (!b[c]) return {
			desc: null,
			data: null
		};
		if (legend = b[c], colorTable = overlayColors[c].preparedColors, startingValue = overlayColors[c].startingValue, step = overlayColors[c].step, d) legend.metric = legend.description[legend.metric + 1] ? legend.metric + 1 : 0, a.setMetric(c, legend.description[legend.metric]);
		else {
			var f = a.getMetric(c);
			f && (legend.metric = legend.description.indexOf(f), legend.metric < 0 && (legend.metric = 0))
		}
		return legend.lines.forEach(function(a) {
			color = colorTable[Math.floor((a[0] - startingValue) / step)], e.push({
				value: a[0],
				desc: a[1 + legend.metric],
				color: "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] / 200 + ")"
			})
		}), {
			desc: legend.description[legend.metric],
			data: e
		}
	}
}]), myApp.service("storage", [function() {
	var a = !0;
	try {
		localStorage.test = 2
	} catch (b) {
		a = !1, event("localStorage not supported")
	}
	var c = {};
	return c.put = function(b, c) {
		try {
			a && localStorage && angular.isDefined(c) && localStorage.setItem(b, angular.toJson(c))
		} catch (d) {
			event("Error writing to localStorage:" + d)
		}
	}, c.get = function(b) {
		return a && localStorage ? angular.fromJson(localStorage.getItem(b)) : void 0
	}, c
}]), myApp.service("settings", ["storage", "maps", "$location", function(a, b, c) {
	function d(a, b, c) {
		return b = parseFloat(b), c = parseFloat(c), a || b.toFixed(3) + "/" + c.toFixed(3)
	}
	meteoblue2metric = {
		CELSIUS: "°C",
		FAHRENHEIT: "°F",
		KNOT: "kt",
		BEAUFORT: "bft",
		METER_PER_SECOND: "m/s",
		MILE_PER_HOUR: "mph",
		KILOMETER_PER_HOUR: "km/h"
	}, metric2meteoblue = {
		"°C": "CELSIUS",
		"°F": "FAHRENHEIT",
		kt: "KNOT",
		bft: "BEAUFORT",
		"m/s": "METER_PER_SECOND",
		mph: "MILE_PER_HOUR",
		"km/h": "KILOMETER_PER_HOUR"
	};
	var e = {},
		f = a.get("favs") || {},
		g = [];
	String.prototype.trunc = function(a) {
		return this.length > a ? this.substr(0, a - 1) + "&hellip;" : this
	};
	var h = {
		US: {
			wind: "kt",
			rain: "in",
			pressure: "inHg",
			snow: "in",
			temp: "°F",
			hours: "12h"
		},
		other: {
			wind: "kt",
			rain: "mm",
			pressure: "hPa",
			snow: "cm",
			temp: "°C",
			hours: "24h"
		}
	};
	return defaults = c.search().locale ? h[c.search().locale] : /AM|PM/.test((new Date).toLocaleTimeString()) ? h.US : h.other, e.setMetric = function(b, c) {
		("gust" == b || "waverages" == b) && (b = "wind"), c && a.put("settings_" + b, c)
	}, e.getMetric = function(b) {
		("gust" == b || "waverages" == b) && (b = "wind");
		var c = a.get("settings_" + b);
		return c || defaults[b]
	}, e.setMetricMB = function(a, b) {
		e.setMetric(a, meteoblue2metric[b])
	}, e.getMetricMB = function(a) {
		return metric2meteoblue[e.getMetric(a)]
	}, e.getHoursFunction = function() {
		return "12h" == e.getMetric("hours") ? function(a) {
			return (a + 11) % 12 + 1 + (a >= 12 ? " PM" : " AM")
		} : function(a) {
			return a + ":00"
		}
	}, e.addFav = function(b, c, g, h) {
		f[d(b, c, g)] = {
			icao: b,
			lat: parseFloat(c),
			lon: parseFloat(g),
			name: h
		}, a.put("favs", f), e.displayFavs()
	}, e.isFav = function(a, b, c) {
		return angular.isDefined(f[d(a, b, c)])
	}, e.removeFav = function(b, c, g) {
		var h = d(b, c, g);
		angular.isDefined(f[h]) && delete f[h], a.put("favs", f), e.displayFavs()
	}, e.allFavs = function() {
		return f
	}, e.displayFavs = function() {
		var a, c, d, e, h, i;
		for (h = 0; h < g.length; h++) b.removeLayer(g[h]);
		for (a in f) c = f[a], i = (global.mobileApp ? "#" : "") + "spot/" + (c.icao ? "ad/" + c.icao : "location"), d = L.divIcon({
			className: "favs-icon",
			html: '<span>&#x2022;</span><a href="' + i + "/" + c.lat + "/" + c.lon + (c.icao ? "" : "/name/" + c.name) + '">' + c.name.trunc(13) + "</a>",
			iconSize: [25, 25],
			iconAnchor: [5, 13]
		}), e = L.marker([c.lat, c.lon], {
			icon: d
		}).addTo(b), g.push(e)
	}, e
}]), myApp.service("windyty", ["$rootScope", "maps", "colors", function(a, b) {
	// "use strict";

	function c() {
		window.clearTimeout(z), 
		window.clearTimeout(A), 
		q = [], 
		H.clearRect(0, 0, G.width, G.height), 
		J[K].clearRect(0, 0, G.width, G.height)
	}

	function d(b, c) {
		var d, e, f = 1;
		window.clearTimeout(z), 
		E = !0, 
		f = window.devicePixelRatio, 
		G && f > 1 && (
			d = c.size.x, 
			e = c.size.y, 
			G.width = d * f, 
			G.height = e * f, 
			G.style.width = d + "px", 
			G.style.height = e + "px", 
			G.getContext("2d").scale(f, f)
		), o = {
			south: h(c.bounds._southWest.lat),
			southD: c.bounds._southWest.lat,
			north: h(c.bounds._northEast.lat),
			northD: c.bounds._northEast.lat,
			east: h(c.bounds._northEast.lng),
			eastD: c.bounds._northEast.lng,
			west: h(c.bounds._southWest.lng),
			westD: c.bounds._southWest.lng
		}, n = {
			x: 0,
			y: 0,
			width: c.size.x,
			height: c.size.y
		}, 
		D = !0, 
		// NOTE: 流线的线宽
		k = [1, 1, 1, 1, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3][c.zoom], 
		l = 1 / (50 * Math.pow(1.8, c.zoom - 3)), 
		m = 1 / (70 * Math.pow(1.6, c.zoom - 3)), // NOTE: 控制线长和流速
		C = c.zoom > 10, 
		v = [3, 3, 3, 3, 5, 5, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12][c.zoom], 
		w = [4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 10, 10, 10, 10, 10, 10, 10, 10][c.zoom],
		a.$emit("windytyRedraw")
	}

	function e(a, b) {
		if (!x) return null;
		var c, d = x.data,
			e = y,
			f = x.dx,
			g = x.dy,
			h = Math.max(x.la1, x.la2),
			j = x.lo1,
			k = i(b - j, 360) / f,
			l = (h - a) / g,
			m = Math.floor(k),
			n = Math.floor(l),
			o = m + 1,
			p = n + 1,
			q = k - m,
			r = l - n,
			s = 1 - q,
			t = 1 - r,
			u = s * t,
			v = q * t,
			w = s * r,
			z = q * r,
			A = e && e.name;
		try {
			var B = d[n][m],
				C = d[n][o],
				D = d[p][m],
				E = d[p][o],
				F = B[0] * u + C[0] * v + D[0] * w + E[0] * z,
				G = B[1] * u + C[1] * v + D[1] * w + E[1] * z;
			e && (c = e.data[n][m] * u + e.data[n][o] * v + e.data[p][m] * w + e.data[p][o] * z)
		} catch (H) {}
		return {
			wind: Math.sqrt(F * F + G * G),
			angle: 10 * Math.floor(18 + 18 * Math.atan2(F, G) / Math.PI),
			overlayName: A,
			overlayValue: c
		}
	}

	function f(a, b, c, d) {
		function e(a) {
			return Math.log(Math.tan(a / 2 + fb))
		}

		function f(a, b) {
			var c = (h(b) - M) * mb,
				d = (lb - e(h(a))) * nb;
			return [c, d]
		}

		function k(a, b, c, d) {
			var e = 0 > a ? ob : -ob,
				g = 0 > b ? ob : -ob,
				h = f(b, a + e),
				i = f(b + g, a),
				j = Math.cos(b / 360 * 2 * Math.PI);
			return [(h[0] - c) / e / j, (h[1] - d) / e / j, (i[0] - c) / g, (i[1] - d) / g]
		}

		function l(a, b) {
			var c = i(a - Z, 360) / U,
				d = (Y - b) / V,
				e = Math.floor(c),
				f = Math.floor(d),
				g = c - e,
				h = d - f,
				j = 1 - g,
				k = 1 - h,
				l = j * k,
				m = g * k,
				n = j * h,
				o = g * h;
			return [e, f, l, m, n, o]
		}

		function p(a, b, c, d, e) {
			var f = c[0] * e,
				g = c[1] * e;
			return c[0] = d[0] * f + d[2] * g, c[1] = d[1] * f + d[3] * g, c
		}

		function u(a, b, c, d, e) {
			var f = e[0],
				g = e[1],
				h = f + 1,
				i = g + 1,
				j = e[2],
				k = e[3],
				l = e[4],
				m = e[5];
			if (h >= W || i >= X) return [0 / 0, 0 / 0, null, null];
			var n = c[g][f],
				o = c[g][h],
				p = c[i][f],
				q = c[i][h],
				r = n[0] * j + o[0] * k + p[0] * l + q[0] * m,
				s = n[1] * j + o[1] * k + p[1] * l + q[1] * m,
				t = d ? d[g][f] * j + d[g][h] * k + d[i][f] * l + d[i][h] * m : null;
			return [r, s, Math.sqrt(r * r + s * s), t]
		}

		function A(a, b, c, d, e) {
			var f = e[0],
				g = e[1],
				h = f + 1,
				i = g + 1,
				j = e[2],
				k = e[3],
				l = e[4],
				m = e[5];
			return h >= W || i >= X ? [0 / 0, 0 / 0, null, null] : [0 / 0, 0 / 0, null, d[g][f] * j + d[g][h] * k + d[i][f] * l + d[i][h] * m]
		}

		function C(a, b, c, d, e) {
			var f, g, h, i, j = e[0],
				k = e[1],
				l = e[2],
				m = e[3];
			g = 4;
			do {
				h = 4, i = a;
				do f = 4 * (b * d + i), c[f] = j, c[f + 1] = k, c[f + 2] = l, c[f + 3] = m, i++; while (h--);
				b++
			} while (g--)
		}

		function F(a) {
			var b, d, e, f, g, h, i, j, m, n = [],
				o = [],
				r = [],
				s = null,
				v = null,
				w = a / L,
				x = c.overlayOnly ? A : u;
			for (f = db * (2 * Math.atan(Math.exp((jb - a) / hb)) - eb), G && (t[a] = (1 - .01 * Math.abs(f)) * Q), d = 0, e = 0; P >= d; d += L, e++)
				if (G ? (g = N + d / P * gb, s = n[e] = k(g, f, d, a), v = o[e] = l(g, f)) : (v = R[w][e], s = S[w][e]), i = x(d, a, T, $, v), i = p(d, a, i, s, t[a]), j = $ ? i[3] : i[2], r[d + 3] = r[d + 2] = r[d + 1] = r[d] = i || [0 / 0, 0 / 0, null], h = H ? null : ab[Math.floor((j - bb) / cb)], h && rb)
					if (m = d - (P - 4), m > 0 && (h = h.slice(0, 4 * (4 - m))), a > O - 4)
						for (b = 0; 4 > b; b++) O > a + b && qb.set(h, 4 * ((a + b) * P + d));
					else qb.set(h, 4 * (a * P + d)), qb.set(h, 4 * ((a + 1) * P + d)), qb.set(h, 4 * ((a + 2) * P + d)), qb.set(h, 4 * ((a + 3) * P + d));
			else h && C(d, a, qb, P, h);
			q[a + 3] = q[a + 2] = q[a + 1] = q[a] = r, G && (S[w] = n, R[w] = o)
		}
		window.clearTimeout(z), E = !1;
		var G = D || !x || x.dx !== a.dx || x.dy !== a.dy || x.la1 !== a.la1 || x.la2 !== a.la2 || x.lo1 !== a.lo1 || x.lo2 !== a.lo2,
			H = c.disableOverlay,
			L = 4,
			M = o.west,
			N = o.westD,
			O = n.height,
			P = n.width,
			Q = m,
			R = s,
			S = r,
			T = a.data,
			U = Math.abs(a.dx),
			V = Math.abs(a.dy),
			W = T[0].length,
			X = T.length,
			Y = Math.max(a.la1, a.la2),
			Z = a.lo1,
			$ = b && b.data,
			_ = $ ? b.name : "wind",
			ab = overlayColors[_].colorsArray,
			bb = overlayColors[_].startingValue,
			cb = overlayColors[_].step,
			db = 180 / Math.PI,
			eb = Math.PI / 2,
			fb = Math.PI / 4,
			gb = o.eastD - o.westD,
			hb = n.width / gb * 360 / (2 * Math.PI),
			ib = hb / 2 * Math.log((1 + Math.sin(o.south)) / (1 - Math.sin(o.south))),
			jb = n.height + ib,
			kb = e(o.south),
			lb = e(o.north),
			mb = n.width / (o.east - o.west),
			nb = n.height / (lb - kb),
			ob = 36e-6;
		c.reduceVelocity && (Q *= c.reduceVelocity), K = K ? 0 : 1;
		var pb = J[K].getImageData(0, 0, P, O),
			qb = pb.data,
			rb = qb.set ? !0 : !1,
			sb = G ? 300 : 50,
			tb = 0;
		! function ub() {
			for (var c = Date.now(); O > tb;) {
				if (F(tb), tb += L, B++, E) return;
				if (B > 20 && (B = 0, Date.now() - c > sb)) return void(z = setTimeout(ub, 50))
			}
			E || (G && (D = !1), x = a, y = b, j && (j.postMessage({
				imageData: pb,
				width: P,
				height: O,
				radius: _.match(/clouds|lcouds/) ? v : w
			}), j.onmessage = function(a) {
				E || J[K].putImageData(a.data, 0, 0)
			}), J[K].putImageData(pb, 0, 0), I[K].style.opacity = 1, I[K ? 0 : 1].style.opacity = 0, G && g(), d())
		}()
	}

	function g() {
		function a() {
			var a, b, c, h, i, j, k = H,
				l = p,
				m = 6 * f,
				n = q,
				o = d,
				r = e,
				s = g;
			for (h = 0; m > h; h += 6) 
				l[h + 4] > 100 && (l[h + 4] = 0, 
				l[h] = Math.round(Math.floor(Math.random() * o)), 
				l[h + 1] = Math.round(Math.floor(Math.random() * r))), 
				a = l[h], 
				b = l[h + 1], 
				j = n[Math.round(b)], 
				c = j && j[Math.round(a)] || [0 / 0, 0 / 0, null], 
				null === c[2] ? (l[h + 4] = 101, l[h + 5] = 10) : (l[h + 2] = a + c[0], 
				l[h + 3] = b + c[1], 
				l[h + 4]++, 
				l[h + 5] = Math.min(3, Math.floor(c[2] / 4)));
			for (k.globalCompositeOperation = "destination-in", k.fillRect(0, 0, d, e), k.globalCompositeOperation = "source-over", h = 0; 4 > h; h++) {
				for (k.beginPath(), k.strokeStyle = s[h], i = 0; m > i; i += 6) 
					l[i + 5] == h && (k.moveTo(l[i], l[i + 1]), 
					k.lineTo(l[i + 2], l[i + 3]), 
					l[i] = l[i + 2], l[i + 1] = l[i + 3]);
				k.stroke()
			}
		}
		window.clearTimeout(A);
		var b, c = 100,
			d = n.width,
			e = n.height,
			f = Math.min(15e3, Math.round(d * e * l)), // NOTE: 控制粒子个数
			g = C ? ["rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)"] : ["rgba(200,200,200,1)", "rgba(215,215,215,1)", "rgba(235,235,235,1)", "rgba(255,255,255,1)"];
		// NOTE: g为风流场颜色	
		H.lineWidth = k, H.fillStyle = "rgba(0, 0, 0, 0.9)";
		var h = p;
		for (b = 0; 6 * f > b; b += 6) 
			h[b] = Math.round(Math.floor(Math.random() * d)), 
			h[b + 1] = Math.round(Math.floor(Math.random() * e)), 
			h[b + 2] = 0, 
			h[b + 3] = 0, 
			h[b + 4] = Math.floor(Math.random() * c), h[b + 5] = 0;
		! function i() {
			A = setTimeout(function() {
				a(), i()
			}, 40) // NOTE: 这里控制流线移动速度
		}()
	}

	function h(a) {
		return a / 180 * Math.PI
	}

	function i(a, b) {
		var c = a - b * Math.floor(a / b);
		return c === b ? 0 : c
	}
	var j = null;
	window.Worker ? j = new Worker("./js/blur.js") : event("Web Worker not supported");
	var k, l, m, n, o, p, q = [],
		r = [],
		s = [],
		t = [];
	try {
		p = new Float32Array(9e4)
	} catch (u) {
		event("Typed array not supported");
		try {
			p = new Array(9e4)
		} catch (u) {
			p = []
		}
	}
	var v, w, x = null,
		y = null,
		z = null,
		A = null,
		B = 0,
		C = !1,
		D = !0,
		E = !1,
		F = L.canvasOverlay().drawing(d).addTo(b),
		G = F.canvas(1),
		H = G.getContext("2d"),
		I = [F.canvas(2), F.canvas(3)],
		J = [F.canvas(2).getContext("2d"), F.canvas(3).getContext("2d")],
		K = 0;
	window.F = F;
	return I[0].style.opacity = 0, I[1].style.opacity = 0, b.on("dragend", c), b.on("zoomstart", c), b.on("resize", c), {
		interpolateValues: e,
		interpolate: f,
		animate: g
	}
}]), myApp.controller("WindytyCtrl", ["$http", "$scope", "$rootScope", "$location", "maps", "calendar", "legends", "$timeout", "progressBar", "products", "$q", function(a, b, c, d, e, f, g, h, i, j, k) {
	"use strict";

	function l(a) {
		var c = f.getPath(a);
		window.clearTimeout(D), b.animationRunning = !1, E = !1, F = !1, i.setIndex(a), t = a, c != b.rqstdDir && (b.rqstdDir = c, b.dayLoader = !0, n(), log("fcst/" + (b.historical ? "historical" : Math.round(t * C) + "day")))
	}

	function m() {
		c.zoom = b.zoom = e.getZoom();
		var a = e.getCenter(),
			f = a.lat.toFixed(3),
			g = a.wrap().lng.toFixed(3),
			h = [f, g, b.zoom];
		"accumulations" == b.product && "next24h" != b.acTime ? h.unshift(b.acTime) : (u != w || b.historical || c.date) && h.unshift(u.replace(/\//g, "-")), "snowcover" === b.product ? h.unshift(b.product) : "wind" !== b.overlay && h.unshift(b.overlay), "surface" != b.level && "gfs" == b.product && h.unshift(b.level), d.search(h.join(",")), b.$evalAsync(), c.$emit("changeParams", {
			zoom: b.zoom,
			lat: f,
			lon: g
		})
	}

	function n(a) {
		a = a || function() {};
		var c;
		switch (b.product) {
			case "gfs":
				c = b.rqstdDir;
				break;
			case "accumulations":
				c = f.giveMeDate(K[b.acTime]), b.windNote = c.replace(/\d+\/(\d+)\/(\d+)\/(\d+)/, "$1/$2 $3:00")
		}
		o({
			product: j[b.product],
			productString: b.product,
			path: c,
			mapsZoom: e.getZoom(),
			bounds: e.getMyBounds(),
			level: b.level,
			overlay: b.overlay,
			acTime: b.acTime
		}, {
			cancelTasks: !0
		}, function(c) {
			c && "Cancelled" !== c ? (u = v, r = s, b.level = x, b.overlay = y, b.acTime = z, i.setIndex(r), b.dayLoader = b.overlayLoader = b.levelLoader = !1) : c || (u = v = b.rqstdDir, x = b.level, y = b.overlay, z = b.acTime, r = s = t, b.dayLoader = b.overlayLoader = b.levelLoader = !1), a(c)
		})
	}

	function o(a, b, d) {
		d = d || function() {};
		var e = [];
		b.cancelTasks && J.length && J.forEach(function(a) {
			"function" == typeof a && a()
		}), J = [], a.product.getTasks(a).forEach(function(a) {
			e.push(a.promise), J.push(a.cancel)
		}), I = a, c.overAllLoader = !0, k.all(e).then(function(b) {
			J = [], G = b[0], H = b[1], E = !1, F = !1, p(!1, function() {
				d(null, a)
			})
		}, function(b) {
			d(b, a)
		})
	}

	function p(a, b) {
		if (b = b || function() {}, I && G) {
			var d = "ok";
			switch (a && (I.mapsZoom = e.getZoom(), I.bounds = e.getMyBounds(), d = I.product.checkCoverage(G, I)), d) {
				case "ok":
					I.product.display(I, G, H, function() {
						b(), L = 0, c.overAllLoader = !1, c.$emit("redrawFinished")
					});
					break;
				case "no-data":
					L++ > 10 ? console.error("displayAnimation was cycled") : o(I, {
						cancelTasks: !1
					}, b);
					break;
				case "out-of-bounds":
					break;
				case "out-of-timeline":
			}
		}
	}

	function q() {
		if (r >= 1 || "gfs" !== b.product) return b.animationRunning = !1, E = !1, F = !1, void b.$evalAsync();
		F || (r += B, i.setIndex(r, !0));
		var a = f.getPath(r);
		a != u && (E ? (b.dayLoader = !0, b.$evalAsync(), F = !0) : (E = !0, b.rqstdDir = u = a, o({
			path: a,
			level: b.level,
			overlay: b.overlay,
			product: j[b.product],
			mapsZoom: e.getZoom(),
			bounds: e.getMyBounds()
		}, {
			cancelTasks: !1
		}, function() {
			b.dayLoader && (b.dayLoader = !1, b.$evalAsync())
		}))), D = setTimeout(q, A)
	}
	var r, s, t, u, v, w, x, y, z, A = 100,
		B = 5e-4,
		C = global.numberOfDays,
		D = null,
		E = !1,
		F = !1,
		G = null,
		H = null,
		I = null,
		J = [],
		K = {
			past: -360,
			past10d: -120,
			past3d: -36,
			past24h: -12,
			next24h: 12,
			next3d: 36,
			next: 120
		},
		L = 0;
	b.calendar = f.calendar, b.dayHours = f.dayHours, b.zoom = e.getZoom(), b.init = function(a) {
		if (b.historical = !1, a && b.dayHours[a]) r = b.dayHours[a].index;
		else if (a) {
			var d = a.split("/");
			b.daysAgo = Math.round((Date.now() - Date.UTC(d[0], d[1] - 1, d[2], d[3])) / 864e5), b.historical = !0, b.histDate = d[0] + "-" + d[1] + "-" + d[2] + " " + d[3] + ":00 UTC", r = f.startIndex()
		} else r = f.startIndex();
		i.setIndex(r), "snowcover" === c.overlay && (c.overlay = "snow", c.product = "snowcover"), s = t = r, b.rqstdDir = u = v = w = a || f.getPath(r), b.overlay = y = c.overlay || "wind", b.level = x = c.level || "surface", b.acTime = z = c.acTime || "next24h", b.product = c.product || j.getProductString(b.overlay) || "gfs", b.animationRunning = !1, b.dayLoader = !0, b.overlayLoader = b.levelLoader = b.overAllLoader = !1, n(function() {
			c.$emit("windytyReady")
		}), b.legend = g(b.overlay, !1)
	}, b.init(c.date), b.selectDay = function(a) {
		l(parseInt(a) / C + .52 / C)
	}, b.selectHour = function(a) {
		l(parseFloat(a))
	}, c.$on("indexChanged", function(a, b) {
		l(b)
	}), b.toggleAnimation = function() {
		b.animationRunning ? (l(r), log("animation/stopped")) : (b.animationRunning = !0, q(r), log("animation/started"))
	}, b.changeParams = function(a, c) {
		switch (a) {
			case "overlay":
				c && (b.overlay = c), b.overlayLoader = !0, b.legend.desc = "", h(function() {
					b.legend = g(b.overlay, !1)
				}, 250), b.product = j.getProductString(b.overlay), "snow" !== b.overlay && "waverages" !== b.overlay || "past" !== b.acTime && "past10d" !== b.acTime || (b.acTime = "next24h");
				break;
			case "acTime":
				c && (b.acTime = c), b.dayLoader = !0, "snowcover" == b.product && (b.product = "accumulations");
				break;
			case "level":
				c && (b.level = c), b.levelLoader = !0;
				break;
			case "product":
				b.product = c
		}
		n(), log(a + "/" + ("overlay" == a ? b.overlay : "acTime" == a ? b.acTime : b.level))
	}, b.cycleLegend = function() {
		b.legend = g(b.overlay, !0)
	}, c.$on("redrawFinished", m), c.$on("reset", function() {
		b.init(null)
	}), c.$on("windytyRedraw", function() {
		p(!0)
	})
}]);