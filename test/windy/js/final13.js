function log(a) {
	ga("send", "pageview", a)
}

function event(a) {
	ga("send", "event", a + " UA:" + navigator.userAgent)
}
"undefined" == typeof Number.prototype.toRadians && (Number.prototype.toRadians = function() {
	return this * Math.PI / 180
}), "undefined" == typeof Number.prototype.toDegrees && (Number.prototype.toDegrees = function() {
	return 180 * this / Math.PI
});
var INTERSECT_LNG = 179.999;
L.Geodesic = L.MultiPolyline.extend({
		options: {
			color: "blue",
			steps: 10,
			dash: 1,
			wrap: !0
		},
		initialize: function(a, b) {
			this.options = this._merge_options(this.options, b), this.datum = {}, this.datum.ellipsoid = {
				a: 6378137,
				b: 6356752.3142,
				f: 1 / 298.257223563
			}, L.MultiPolyline.prototype.initialize.call(this, a, this.options)
		},
		setLatLngs: function(a) {
			this._latlngs = this.options.dash < 1 ? this._generate_GeodesicDashed(a) : this._generate_Geodesic(a), L.MultiPolyline.prototype.setLatLngs.call(this, this._latlngs)
		},
		getStats: function() {
			var a, b, c = {
				distance: 0,
				points: 0,
				polygons: this._latlngs.length
			};
			for (a = 0; a < this._latlngs.length; a++)
				for (c.points += this._latlngs[a].length, b = 0; b < this._latlngs[a].length - 1; b++) c.distance += this._vincenty_inverse(this._latlngs[a][b], this._latlngs[a][b + 1]).distance;
			return c
		},
		createCircle: function(a, b) {
			var c, d = [],
				e = 0,
				f = {
					lat: 0,
					lng: 0,
					brg: 0
				};
			d[e] = [];
			var g = this._vincenty_direct(L.latLng(a), 0, b, this.options.wrap);
			for (f = L.latLng(g.lat, g.lng), d[e].push(f), c = 1; c <= this.options.steps;) {
				g = this._vincenty_direct(L.latLng(a), 360 / this.options.steps * c, b, this.options.wrap);
				var h = L.latLng(g.lat, g.lng);
				if (Math.abs(h.lng - f.lng) > 180) {
					var i = this._vincenty_inverse(f, h),
						j = this._intersection(f, i.initialBearing, {
							lat: -89,
							lng: h.lng - f.lng > 0 ? -INTERSECT_LNG : INTERSECT_LNG
						}, 0);
					j ? (d[e].push(L.latLng(j.lat, j.lng)), e++, d[e] = [], f = L.latLng(j.lat, -j.lng), d[e].push(f)) : (e++, d[e] = [], d[e].push(h), f = h, c++)
				} else d[e].push(h), f = h, c++
			}
			this._latlngs = d, L.MultiPolyline.prototype.setLatLngs.call(this, this._latlngs)
		},
		_generate_Geodesic: function(a) {
			var b, c, d, e = [],
				f = 0;
			for (c = 0; c < a.length; c++) {
				for (e[f] = [], d = 0; d < a[c].length - 1; d++) {
					var g = this._vincenty_inverse(L.latLng(a[c][d]), L.latLng(a[c][d + 1])),
						h = L.latLng(a[c][d]);
					for (e[f].push(h), b = 1; b <= this.options.steps;) {
						var i = this._vincenty_direct(L.latLng(a[c][d]), g.initialBearing, g.distance / this.options.steps * b, this.options.wrap),
							j = L.latLng(i.lat, i.lng);
						if (Math.abs(j.lng - h.lng) > 180) {
							var k = this._intersection(L.latLng(a[c][d]), g.initialBearing, {
								lat: -89,
								lng: j.lng - h.lng > 0 ? -INTERSECT_LNG : INTERSECT_LNG
							}, 0);
							k ? (e[f].push(L.latLng(k.lat, k.lng)), f++, e[f] = [], h = L.latLng(k.lat, -k.lng), e[f].push(h)) : (f++, e[f] = [], e[f].push(j), h = j, b++)
						} else e[f].push(j), h = j, b++
					}
				}
				f++
			}
			return e
		},
		_generate_GeodesicDashed: function(a) {
			var b, c, d, e = [],
				f = 0;
			for (c = 0; c < a.length; c++) {
				for (e[f] = [], d = 0; d < a[c].length - 1; d++) {
					var g = this._vincenty_inverse(L.latLng(a[c][d]), L.latLng(a[c][d + 1])),
						h = L.latLng(a[c][d]);
					for (e[f].push(h), b = 1; b <= this.options.steps;) {
						var i = this._vincenty_direct(L.latLng(a[c][d]), g.initialBearing, g.distance / this.options.steps * b - g.distance / this.options.steps * (1 - this.options.dash), this.options.wrap),
							j = L.latLng(i.lat, i.lng);
						if (Math.abs(j.lng - h.lng) > 180) {
							var k = this._intersection(L.latLng(a[c][d]), g.initialBearing, {
								lat: -89,
								lng: j.lng - h.lng > 0 ? -INTERSECT_LNG : INTERSECT_LNG
							}, 0);
							k ? (e[f].push(L.latLng(k.lat, k.lng)), f++, e[f] = [], h = L.latLng(k.lat, -k.lng), e[f].push(h)) : (f++, e[f] = [], e[f].push(j), h = j, b++)
						} else {
							e[f].push(j), f++;
							var l = this._vincenty_direct(L.latLng(a[c][d]), g.initialBearing, g.distance / this.options.steps * b, this.options.wrap);
							e[f] = [], e[f].push(L.latLng(l.lat, l.lng)), b++
						}
					}
				}
				f++
			}
			return e
		},
		_vincenty_direct: function(a, b, c, d) {
			var e, f = a.lat.toRadians(),
				g = a.lng.toRadians(),
				h = b.toRadians(),
				i = c,
				j = this.datum.ellipsoid.a,
				k = this.datum.ellipsoid.b,
				l = this.datum.ellipsoid.f,
				m = Math.sin(h),
				n = Math.cos(h),
				o = (1 - l) * Math.tan(f),
				p = 1 / Math.sqrt(1 + o * o),
				q = o * p,
				r = Math.atan2(o, n),
				s = p * m,
				t = 1 - s * s,
				u = t * (j * j - k * k) / (k * k),
				v = 1 + u / 16384 * (4096 + u * (-768 + u * (320 - 175 * u))),
				w = u / 1024 * (256 + u * (-128 + u * (74 - 47 * u))),
				x = i / (k * v),
				y = 0;
			do {
				var z = Math.cos(2 * r + x),
					A = Math.sin(x),
					B = Math.cos(x),
					C = w * A * (z + w / 4 * (B * (-1 + 2 * z * z) - w / 6 * z * (-3 + 4 * A * A) * (-3 + 4 * z * z)));
				e = x, x = i / (k * v) + C
			} while (Math.abs(x - e) > 1e-12 && ++y);
			var D = q * A - p * B * n,
				E = Math.atan2(q * B + p * A * n, (1 - l) * Math.sqrt(s * s + D * D)),
				F = Math.atan2(A * m, p * B - q * A * n),
				G = l / 16 * t * (4 + l * (4 - 3 * t)),
				H = F - (1 - G) * l * s * (x + G * A * (z + G * B * (-1 + 2 * z * z)));
			if (d) var I = (g + H + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
			else var I = g + H;
			var J = Math.atan2(s, -D);
			return {
				lat: E.toDegrees(),
				lng: I.toDegrees(),
				finalBearing: J.toDegrees()
			}
		},
		_vincenty_inverse: function(a, b) {
			var c, d = a.lat.toRadians(),
				e = a.lng.toRadians(),
				f = b.lat.toRadians(),
				g = b.lng.toRadians(),
				h = this.datum.ellipsoid.a,
				i = this.datum.ellipsoid.b,
				j = this.datum.ellipsoid.f,
				k = g - e,
				l = (1 - j) * Math.tan(d),
				m = 1 / Math.sqrt(1 + l * l),
				n = l * m,
				o = (1 - j) * Math.tan(f),
				p = 1 / Math.sqrt(1 + o * o),
				q = o * p,
				r = k,
				s = 0;
			do {
				var t = Math.sin(r),
					u = Math.cos(r),
					v = p * t * p * t + (m * q - n * p * u) * (m * q - n * p * u),
					w = Math.sqrt(v);
				if (0 == w) return 0;
				var x = n * q + m * p * u,
					y = Math.atan2(w, x),
					z = m * p * t / w,
					A = 1 - z * z,
					B = x - 2 * n * q / A;
				isNaN(B) && (B = 0);
				var C = j / 16 * A * (4 + j * (4 - 3 * A));
				c = r, r = k + (1 - C) * j * z * (y + C * w * (B + C * x * (-1 + 2 * B * B)))
			} while (Math.abs(r - c) > 1e-12 && ++s < 100);
			if (s >= 100) return console.log("Formula failed to converge. Altering target position."), this._vincenty_inverse(a, {
				lat: b.lat,
				lng: b.lng - .01
			});
			var D = A * (h * h - i * i) / (i * i),
				E = 1 + D / 16384 * (4096 + D * (-768 + D * (320 - 175 * D))),
				F = D / 1024 * (256 + D * (-128 + D * (74 - 47 * D))),
				G = F * w * (B + F / 4 * (x * (-1 + 2 * B * B) - F / 6 * B * (-3 + 4 * w * w) * (-3 + 4 * B * B))),
				H = i * E * (y - G),
				I = Math.atan2(p * t, m * q - n * p * u),
				J = Math.atan2(m * t, -n * p + m * q * u);
			return H = Number(H.toFixed(3)), {
				distance: H,
				initialBearing: I.toDegrees(),
				finalBearing: J.toDegrees()
			}
		},
		_intersection: function(a, b, c, d) {
			var e = a.lat.toRadians(),
				f = a.lng.toRadians(),
				g = c.lat.toRadians(),
				h = c.lng.toRadians(),
				i = Number(b).toRadians(),
				j = Number(d).toRadians(),
				k = g - e,
				l = h - f,
				m = 2 * Math.asin(Math.sqrt(Math.sin(k / 2) * Math.sin(k / 2) + Math.cos(e) * Math.cos(g) * Math.sin(l / 2) * Math.sin(l / 2)));
			if (0 == m) return null;
			var n = Math.acos((Math.sin(g) - Math.sin(e) * Math.cos(m)) / (Math.sin(m) * Math.cos(e)));
			isNaN(n) && (n = 0);
			var o = Math.acos((Math.sin(e) - Math.sin(g) * Math.cos(m)) / (Math.sin(m) * Math.cos(g)));
			if (Math.sin(h - f) > 0) var p = n,
				q = 2 * Math.PI - o;
			else var p = 2 * Math.PI - n,
				q = o;
			var r = (i - p + Math.PI) % (2 * Math.PI) - Math.PI,
				s = (q - j + Math.PI) % (2 * Math.PI) - Math.PI;
			if (0 == Math.sin(r) && 0 == Math.sin(s)) return null;
			if (Math.sin(r) * Math.sin(s) < 0) return null;
			var t = Math.acos(-Math.cos(r) * Math.cos(s) + Math.sin(r) * Math.sin(s) * Math.cos(m)),
				u = Math.atan2(Math.sin(m) * Math.sin(r) * Math.sin(s), Math.cos(s) + Math.cos(r) * Math.cos(t)),
				v = Math.asin(Math.sin(e) * Math.cos(u) + Math.cos(e) * Math.sin(u) * Math.cos(i)),
				w = Math.atan2(Math.sin(i) * Math.sin(u) * Math.cos(e), Math.cos(u) - Math.sin(e) * Math.sin(v)),
				x = f + w;
			return x = (x + 3 * Math.PI) % (2 * Math.PI) - Math.PI, {
				lat: v.toDegrees(),
				lng: x.toDegrees()
			}
		},
		_merge_options: function(a, b) {
			var c = {};
			for (var d in a) c[d] = a[d];
			for (var d in b) c[d] = b[d];
			return c
		}
	}), L.geodesic = function(a, b) {
		return new L.Geodesic(a, b)
	}, L.TileLayer.Multi = L.TileLayer.extend({
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
	}(), L.CanvasOverlay = L.Class.extend({
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
			MENU_F_MODEL: "Data",
			MENU_U_INTERVAL: "Update interval",
			MENU_D_UPDATED: "Updated",
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
			D_MBLUE: "Meteogram",
			D_AIRGRAM3: "Airgram",
			D_WAVE_FCST: "Wind and Waves",
			D_SETTINGS: "settings",
			D_SETTINGS_WAVES: "Detailed wave & sea forecast",
			D_SETTINGS_LEFT: "Left side",
			D_SETTINGS_RIGHT: "Right side",
			D_SETTINGS_TIME1: "Local time of your computer",
			D_SETTINGS_TIME2: "Local time of selected destination",
			D_SETTINGS_PROVIDER: "Provider",
			E_MESSAGE: "Awesome weather forecast at",
			METAR_VAR: "Variable",
			METAR_MIN_AGO: "{DURATION}m ago",
			METAR_HOUR_AGO: "an hour ago",
			METAR_MORE_INFO: "more info"
		}
	}, "object" == typeof module && module.exports && (module.exports = languages);
var supportedLanguages = ["en", "zh-TW", "zh", "ja", "fr", "de", "pt", "ko", "it", "ru", "nl", "cs", "tr", "pl", "sv", "fi", "el", "hu", "da", "ar", "sk", "th", "nb", "es"];
Array.prototype.getNextItem = function(a, b) {
	var c = this.indexOf(a);
	return b && c < this.length - 1 ? c++ : !b && c > 0 && c--, this[c]
}, Date.prototype.add = function(a, b) {
	var c = new Date(this.getTime());
	return c.setTime(this.getTime() + ("days" == b ? 24 : 1) * a * 60 * 60 * 1e3), c
}, Date.prototype.toUTCPath = function() {
	return this.toISOString().replace(/^(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$1/$2/$3/$4")
}, String.prototype.trunc = function(a) {
	return this.length > a ? this.substr(0, a - 1) + "&hellip;" : this
};
var global = {
	server: "https://www.windyty.com/",
	server2: "",
	tileServer: "https://tiles{s}.windyty.com/tiles/",
	// tileServer: 'http://api.tiles.mapbox.com/v4/ludawei.mj8ienmm/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVkYXdlaSIsImEiOiJldzV1SVIwIn0.-gaUYss5MkQMyem_IOskdA',
	version: "3.6.3",
	suffix: "",
	numberOfDays: 14,
	levels: ["surface", "975h", "950h", "925h", "900h", "850h", "750h", "700h", "550h", "450h", "350h", "300h", "250h", "200h", "150h"],
	overlays: ["wind", "temp", "pressure", "clouds", "rh", "gust", "snow", "lclouds", "rain", "waverages", "snowcover"],
	acTimes: ["past", "past10d", "past3d", "past24h", "next24h", "next3d", "next"],
	texts: ["DETAILED", "WEBCAMS", "TEMP", "PRESS", "NEXT", "RAIN", "SHOW_GUST", "SNOW", "METAR_VAR", "METAR_MIN_AGO", "METAR_HOUR_AGO", "METAR_MORE_INFO"],
	isTouch: L.Browser.touch,
	isMobile: L.Browser.mobile,
	keyChars: [40, 38, 9, 13, 27, 37, 39, 33, 34]
};
window.onerror = function(a, b, c, d, e) {
	event("Version:" + global.version + " Error:" + a + " url:" + b + " line:" + c + " column:" + d + " error:" + e + " UA:" + navigator.userAgent)
};
var myApp = angular.module("myApp", ["ngRoute", "ngAnimate", "pascalprecht.translate"]).config(["$routeProvider", "$locationProvider", "transProvider", "$sceProvider", "$compileProvider", function(a, b, c, d, e) {
	d.enabled(!1), a.when("/about/", {
		reloadOnSearch: !1,
		templateUrl: "about.html?" + global.version,
		controller: "AboutCtrl"
	}).when("/spot/:type/:lat/:lon", {
		reloadOnSearch: !1,
		templateUrl: "detail.html?" + global.version,
		controller: "DetailCtrl"
	}).when("/spot/:type/:lat/:lon/name/:name?", {
		reloadOnSearch: !1,
		templateUrl: "detail.html?" + global.version,
		controller: "DetailCtrl"
	}).when("/spot/:type/:icao/:lat/:lon", {
		reloadOnSearch: !1,
		templateUrl: "detail.html?" + global.version,
		controller: "DetailCtrl"
	}).when("/intro", {
		reloadOnSearch: !1,
		templateUrl: "intro.html?" + global.version,
		controller: "AboutCtrl"
	}).when("/menu", {
		reloadOnSearch: !1,
		templateUrl: "menu.html?" + global.version,
		controller: "MenuCtrl"
	}).when("/:name/:type/:lat/:lon", {
		reloadOnSearch: !1,
		templateUrl: "detail.html?" + global.version,
		controller: "DetailCtrl"
	}).when("/:icao/:name/:type/:lat/:lon", {
		reloadOnSearch: !1,
		templateUrl: "detail.html?" + global.version,
		controller: "DetailCtrl"
	}), e.debugInfoEnabled(!1), b.html5Mode(!0), c.init()
}]).run(["$http", "$rootScope", "$location", "storage", "settings", "maps", "trans", "$translate", "popUp", "pois", function(a, b, c, d, e, f) {
	{
		var g, h = c.search();
		c.path()
	}
	if (f.initTiles(17, d.get("backgroundMap")), h)
		for (var i in h) break;
	if (i && i.match(/\S+,\S+,\S+/) && (b.url = i, g = i.split(",")), g && g.length >= 3) {
		for (var j = 0; j < g.length; j++) /^-?\d+\.\d+$/.test(g[j]) && /^-?\d+\.\d+$/.test(g[j + 1]) && /^\d+$/.test(g[j + 2]) && (b.sharedCoords = {
			lat: parseFloat(g[j]),
			lon: parseFloat(g[j + 1]),
			zoom: parseInt(g[j + 2])
		}, j += 2), global.levels.indexOf(g[j]) > -1 && (b.level = g[j]), global.overlays.indexOf(g[j]) > -1 && (b.overlay = g[j]), global.acTimes.indexOf(g[j]) > -1 && (b.acTime = g[j]), /^(\d\d\d\d)-(\d\d)-(\d\d)-(\d\d)$/.test(g[j]) && (b.date = g[j].replace(/-/g, "/"));
		b.sharedCoords && f.center(b.sharedCoords), log("share/" + (b.date ? "location_time" : "location"))
	}
	a.get("https://www.windyty.com/node/geoip").success(function(a) {
		a && a.ll && (b.initCoords = {
			lat: a.ll[0],
			lon: a.ll[1],
			zoom: 4
		}, d.put("initCoords", b.initCoords), b.sharedCoords || f.center(b.initCoords))
	}), b.$on("windytyReady", function() {
		setTimeout(e.displayFavs, 3e3)
	}), setTimeout(e.displayFavs, 8e3)
}]).controller("MainCtrl", ["$scope", "$rootScope", "$timeout", "storage", "settings", "maps", "$location", "$element", function(a, b, c, d, e, f, g, h) {
	a.message = !1, a.layout = {
		detail: !1,
		searchFocus: !1,
		zoom: f.getZoom()
	}, a.initPosition = function() {
		g.path("/"), b.initCoords && f.center(b.initCoords), b.level = null, b.date = null, b.overlay = null, b.$emit("reset")
	}, h.bind("keydown", function(c) {
		global.keyChars.indexOf(c.which) > -1 && (a.layout.searchFocus ? b.$emit("searchClick", c.which) : b.$emit("otherClick", c.which))
	});
	var i;
	a.intro = !1, (i = d.get("visitCounter1")) ? (i++, d.put("visitCounter1", i), (2 === i || 5 == i || 7 == i) && (c(function() {
		a.intro = !0
	}, 500), c(function() {
		a.intro = !1
	}, 8e3))) : d.put("visitCounter1", 1), d.put("visitCounter", 1), d.put("visitCounter2", 1), a.close = function() {
		g.path("/")
	}
}]).controller("MenuCtrl", ["$scope", "maps", "storage", "products", function(a, b, c) {
	a.maps = [{
		id: "heresat",
		title: "Satellite map",
		copy: "Courtesy & copyright by HERE Maps"
	}, {
		id: "hereterrain",
		title: "Terrain map",
		copy: "Courtesy & copyright by HERE Maps"
	}, {
		id: "esritopo",
		title: "Detailed topography map",
		copy: "Courtesy & copyright by ESRI"
	}], a.selectedMap = c.get("backgroundMap") || "esritopo", a.changeMap = function(d) {
		a.selectedMap = d, b.initTiles(16, d), c.put("backgroundMap", d), log("maptiles/" + d)
	}, log("menu")
}]).controller("AboutCtrl", [function() {
	log("about")
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
			label: "掳C",
			conversion: function(a) {
				return a - 273.15
			},
			precision: 1
		},
		F: {
			label: "掳F",
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
		zoomControl: !1,
		keyboard: !1,
		worldCopyJump: !0
	}), L.control.zoom({
		position: "topright"
	}).addTo(d), d.initTiles = function(a, b) {
		var c = e[b] || e.esritopo;
		L.TileLayer.multi({
			11: {
				// url: global.tileServer + (L.Browser.retina ? "rtnv3" : "v5") + "/{z}/{x}/{y}.jpg",
				url: 'http://api.tiles.mapbox.com/v4/ludawei.mj8ienmm/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVkYXdlaSIsImEiOiJldzV1SVIwIn0.-gaUYss5MkQMyem_IOskdA',
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
		if (a.panto) {
			var b = d.getSize().x;
			d.panTo([a.lat, a.lon], {
				animate: !1
			}).setZoom(a.zoom, {
				animate: !1
			}).panBy([(b - a.panto) / 2 - b / 2, 0], {
				animate: !0
			})
		} else d.setView([a.lat, a.lon], a.zoom, {
			animate: !0
		})
	}, d.getMyBounds = function(a) {
		var b = d.getBounds();
		return a || (b._northEast = b._northEast.wrap(), b._southWest = b._southWest.wrap()), {
			left: b._southWest.lng,
			right: b._northEast.lng,
			top: b._northEast.lat,
			bottom: b._southWest.lat
		}
	}, d.on("contextmenu", function() {
		d.zoomOut()
	}), d
}]), myApp.service("progressBar", ["$rootScope", "settings", function(a, b) {
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
}]), myApp.service("popUp", ["$rootScope", "$http", "maps", "windyty", "conversions", "trans", "settings", function(a, b, c, d, e, f, g) {
	function h() {
		v && c.closePopup(v), u && u(), window.clearTimeout(t)
	}

	function i() {
		function a(a, b) {
			r[a].forEach(function(a) {
				q[a] = e[a].conversion(b).toFixed(e[a].precision)
			})
		}
		var b = d.interpolateValues(p.lat, p.lng),
			c = "";
		switch (a("wind", b.wind), b.overlayName) {
			case "temp":
				a("temp", b.overlayValue), c = f.TEMP + ": " + q.C + "掳C, " + q.F + "掳F";
				break;
			case "pressure":
				a("pressure", b.overlayValue), c = f.PRESS + ": " + q.hpa + " hPa, " + q.inhg + " inHg";
				break;
			case "clouds":
				b.overlayValue > 200 && (a("clouds", b.overlayValue), c = f.RAIN + ": " + q.mm + " mm, " + q["in"] + " in");
				break;
			case "gust":
				a("wind", b.overlayValue), c = "<b>" + f.SHOW_GUST + "</b> ";
				break;
			case "snow":
				a("snow", b.overlayValue), c = q.cmsnow + " cm, " + q.insnow + " in";
				break;
			case "rain":
				a("rain", b.overlayValue), c = q.mmrain + " mm, " + q.inrain + " in";
				break;
			case "waverages":
				c = "We do not show average values, since they are not exact";
				break;
			case "snowcover":
				c = "Snow cover has no height information"
		}
		var h = global.embed ? 'target="wind" href="https://www.windyty.com/spot/location/' : 'href="spot/location/',
			i = g.getMetric("wind"),
			j = [];
		["bft", "m/s", "km/h", "kt", "mph"].forEach(function(a) {
			a != i && j.push(" " + q[a] + " " + a)
		});
		var k = "";
		k = /rain|snow|waverages|snowcover/.test(b.overlayName) ? '<div class="wind">' + c + "</div>" : '<div class="wind dbft' + q.bft + '">' + b.angle + "掳, " + q[i] + " " + i + '</div><div class="other-winds">' + j.join(",") + "</div>" + (c ? '<div class="overlay">' + c + "</div>" : ""), k += '<div class="detailed"><a ' + h + p.lat.toFixed(3) + "/" + p.wrap().lng.toFixed(3) + '">' + f.DETAILED + "<span>" + f.WEBCAMS + "&nbsp;</span></a></div>", v.setContent(k)
	}

	function j(b) {
		n = b.containerPoint.x, o = b.containerPoint.y, p = b.latlng, v = L.popup({
			maxWidth: 220,
			minWidth: 180,
			className: "estimate-popup",
			autoPanPaddingTopLeft: [100, 100],
			autoPanPaddingBottomRight: [100, 100]
		}).setLatLng(b.latlng).setContent("Loading...").openOn(c), u = a.$on("redrawFinished", i), c.once("dragend", h), c.once("zoomstart", h), i(), log("popup")
	}

	function k(a) {
		a.containerPoint.y < 60 || (window.clearTimeout(t), a.originalEvent.timeStamp - s > 800 && (s = a.originalEvent.timeStamp, t = setTimeout(function() {
			j(a)
		}, 1e3)))
	}

	function l() {
		c.off("click", k)
	}

	function m() {
		c.on("click", k)
	}
	var n, o, p, q = {},
		r = {
			wind: ["bft", "m/s", "km/h", "kt", "mph"],
			temp: ["C", "F"],
			pressure: ["hpa", "inhg"],
			clouds: ["mm", "in"],
			snow: ["cmsnow", "insnow"],
			rain: ["mmrain", "inrain"]
		},
		s = 0,
		t = null,
		u = null,
		v = null;
	return c.on("click", k), c.on("popupclose", function() {
		u && u()
	}), a.$on("closePopup", h), {
		disable: l,
		enable: m
	}
}]), myApp.service("pois", ["$http", "$rootScope", "$location", "maps", "windyty", "settings", "conversions", "trans", function(a, b, c, d, e, f, g, h) {
	function i() {
		var a;
		for (a = 0; a < n.length; a++) d.removeLayer(n[a])
	}

	function j(a, b, c) {
		var d, e, f = b.bounds;
		for (e = 0; e < c.length; e++) d = c[e], d.la < f.top && d.la > f.bottom && (d.lo < f.right && d.lo > f.left || f.right < f.left && (d.lo > f.left || d.lo < f.right)) && n.push(a.display(d))
	}
	var k, l, m, n = [],
		o = {},
		p = null;
	o.metars = {
		minZoom: 7,
		maxZoom: 18,
		metars: null,
		age: null,
		unix: null,
		icons: function() {
			var a = {};
			return ["U", "M", "V", "I", "L"].forEach(function(b) {
				a[b] = L.divIcon({
					className: "metar-icon" + b,
					iconSize: [13, 13]
				})
			}), a
		}(),
		download: function(b, c) {
			var d = Date.now();
			this.unix = Math.floor(Date.now() / 6e4), d - this.age > 3e5 || !this.metars ? a.get(global.server2 + "metar/metars2.json?timestamp=" + d).success(function(a, e) {
				a.age = d, a.metars = [];
				for (var f = 0; f < e.length; f += 9) a.metars.push({
					id: e[f],
					la: e[f + 1],
					lo: e[f + 2],
					ty: e[f + 3],
					ux: e[f + 4],
					dir: e[f + 5],
					speed: e[f + 6],
					gust: e[f + 7],
					temp: e[f + 8]
				});
				c(b, a.metars)
			}.bind(null, this)) : c(b, this.metars)
		},
		display: function(a) {
			var e = this.unix - a.ux,
				f = 60 > e ? h.METAR_MIN_AGO.replace(/\{DURATION\}/, e) : h.METAR_HOUR_AGO,
				i = "/spot/ad/" + a.id + "/" + a.la + "/" + a.lo,
				j = ("number" == typeof a.dir && a.speed > 0 ? '<div class="metar-arrow" style="transform: rotate(' + (a.dir - 225) + "deg); -webkit-transform:rotate(" + (a.dir - 225) + 'deg);">j</div>' : "") + '<a href="' + i + '"><div class="right"><b>' + a.id + '</b>&nbsp;<span class="adtype' + a.ty + '"></span><br/>' + ("V" == a.dir ? h.METAR_VAR + " " : "") + ("number" == typeof a.speed ? Math.round(g[k].conversion(a.speed)) + " " + k : "") + ("number" == typeof a.gust ? ", g:" + Math.round(g[k].conversion(a.gust)) + " " + k : "") + ("number" == typeof a.temp ? ("number" == typeof a.speed ? ", " : "") + Math.round("掳F" == l ? 1.8 * a.temp + 32 : a.temp) + l : "") + '<br /><span class="howold">' + f + "</span>" + (global.isTouch ? "<div>" + h.METAR_MORE_INFO + "</div>" : "") + "</div></a>",
				m = L.marker([a.la, a.lo], {
					icon: this.icons[a.ty]
				}).bindPopup(j, {
					className: "metar",
					offset: [20, -15],
					closeButton: !1,
					minWidth: 120,
					autoPan: !1
				}).addTo(d);
			return global.isTouch || m.on("click", function() {
				c.url(i), b.$evalAsync()
			}).on("mouseover", function() {
				this.openPopup()
			}).on("mouseout", function() {
				this.closePopup()
			}), m
		}
	}, o.pressure = {
		minZoom: 3,
		maxZoom: 11,
		metric: null,
		lowsHighs: {},
		hours: (new Date).getHours(),
		download: function(b, c) {
			function d(a, c, d) {
				var e, f, g, h, i = [];
				if (5 > a ? (e = 1e5, f = 102e3) : 6 > a ? (e = 100500, f = 101500) : 7 > a && (e = 101e3, f = 101300), e) {
					for (g = 0; g < c.length; g++) h = c[g], (h.value < e || h.value > f) && i.push(h);
					d(b, i)
				} else d(b, c)
			}
			this.lowsHighs[b.path] ? d(b.mapsZoom, this.lowsHighs[b.path], c) : a.get(global.server + "gfs/" + b.path + "/pressure-highs-lows.json?" + this.hours).success(function(a, e) {
				a.lowsHighs[b.path] = e, d(b.mapsZoom, e, c)
			}.bind(null, this))
		},
		display: function(a) {
			var b = "inHg" == m ? Math.floor(a.value / 33.86389) / 100 : Math.floor(a.value / 100);
			return color = a.value > 102700 ? "#AE716C" : a.value > 102400 ? "rgba(221, 157, 140, 1)" : a.value > 102100 ? "#C6A448" : a.value > 101800 ? "#B9C558" : a.value > 101500 ? "#689A48" : a.value > 100900 ? "#618BBE" : a.value > 100600 ? "#5EB0B7" : a.value > 100300 ? "#A992B0" : a.value > 1e5 ? "#A687B2" : a.value > 997 ? "#A285B3" : "#897DA8", L.marker([a.la, a.lo], {
				icon: L.divIcon({
					className: "temp-icon",
					iconSize: [25, 13],
					html: '<span style="color:' + color + ';">' + b + "</span>"
				})
			}).addTo(d)
		}
	}, o.cities = {
		minZoom: 5,
		maxZoom: 11,
		data: {
			6: null,
			7: null,
			8: null,
			9: null,
			10: null
		},
		zoom2zoom: {
			5: 6,
			6: 7,
			7: 7,
			8: 8,
			9: 9,
			10: 9,
			11: 9
		},
		download: function(b, c) {
			var d = this.zoom2zoom[b.mapsZoom];
			this.data[d] ? c(b, this.data[d]) : a.get(global.server + "cities/" + d + ".json").success(function(a, d, e) {
				a.data[d] = [];
				for (var f = 0; f < e.length; f += 2) a.data[d].push({
					la: e[f],
					lo: e[f + 1]
				});
				c(b, a.data[d])
			}.bind(null, this, d))
		},
		display: function(a) {
			var b = e.interpolateValues(a.la, a.lo).overlayValue,
				c = Math.floor("掳F" == l ? 9 * b / 5 - 459.67 : b - 273.15);
			b = Math.floor(b);
			var f = "#a6e0f2";
			return b > 303 ? f = "#f4bb9b" : b > 298 ? f = "#e8c79f" : b > 293 ? f = "#ead28f" : b > 288 ? f = "#e8e89b" : b > 283 ? f = "#dfef92" : b > 278 ? f = "#cefa97" : b > 273 ? f = "#bee8b1" : b > 268 ? f = "#bad4f9" : b > 263 && (f = "#abd1ec"), L.marker([a.la, a.lo], {
				icon: L.divIcon({
					className: "temp-icon",
					html: '<a href="spot/location/' + a.la + "/" + a.lo + '" style="color:' + f + ';">' + c + "掳</a>"
				})
			}).addTo(d)
		}
	}, b.$on("redrawFinished", function(a, b, c) {
		"temp" == b.overlay ? p = "cities" : "pressure" == b.overlay ? p = "pressure" : "metars" != p && "temp" != b.overlay && (p = "metars", c = !0);
		var d = o[p];
		d.minZoom <= b.mapsZoom && d.maxZoom >= b.mapsZoom ? (c || "metars" != p) && (i(), d.download(b, function(a, b) {
			m = f.getMetric("pressure"), l = f.getMetric("temp"), k = f.getMetric("wind"), j(d, a, b)
		})) : n.length > 0 && i()
	})
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
		function e(c, d) {
			var e = b.defer();
			return a.get(c, {
				cache: k,
				timeout: d
			}).success(function(a, b, c) {
				a.lastModified = c()["last-modified"], e.resolve(a)
			}).error(function() {
				console.warn("Grid not found, returning empty grid"), e.resolve(n)
			}), e.promise
		}
		var f, i = b.defer(),
			j = [],
			m = [],
			o = function() {
				for (var a = 0; a < m.length; a++) m[a].resolve();
				i.reject("Cancelled")
			};
		if (0 === c.zoom) {
			var p = c.fullDirectory + c.filename,
				q = l.get(p);
			q ? i.resolve(q) : (m[0] = b.defer(), a.get(p, {
				cache: !1,
				timeout: m[0].promise
			}).success(function(a, b, d) {
				c.lastModified = d()["last-modified"];
				var e = g(a, c);
				l.put(p, e), i.resolve(e)
			}).error(function() {
				i.reject("Error loading a grid")
			}))
		} else {
			var r = d(c.bounds, c.zoom);
			r.tiles.forEach(function(a) {
				f = b.defer(), m.push(f), j.push(e(c.fullDirectory + "t" + c.zoom + "/" + a + "/" + c.filename, f.promise))
			}), b.all(j).then(function(a) {
				var b = h(r, a, c);
				b ? i.resolve(b) : i.reject("Error loading a grid")
			}, function() {
				i.reject("Error loading a grid")
			})
		}
		return {
			promise: i.promise,
			cancel: o
		}
	}

	function g(a, b) {
		var c, d, e, f, g = [],
			h = 0,
			i = a[0].data,
			j = a[1] && a[1].data,
			k = a[0].header.dx,
			l = (a[0].header.dy, a[0].header.lo1, a[0].header.la1, a[0].header.nx),
			m = a[0].header.ny;
		for (d = 0; m > d; d++) {
			for (e = [], c = 0; l > c; c++, h++) f = i[h], e[c] = "wind" == b.overlay ? [f / 10, j[h] / 10] : "gust" == b.overlay ? f / 10 : f;
			Math.floor(l * k) >= 360 && e.push(e[0]), g[d] = e
		}
		return console.timeEnd("grid"), {
			tiles: ["0/0"],
			zoom: b.zoom,
			name: b.overlay,
			level: b.level,
			product: b.product,
			lastModified: b.lastModified,
			nx: l,
			ny: m,
			lo1: a[0].header.lo1,
			la1: a[0].header.la1,
			lo2: a[0].header.lo2,
			la2: a[0].header.la2,
			dx: a[0].header.dx,
			dy: a[0].header.dy,
			refTime: a[0].header.refTime,
			data: g
		}
	}

	function h(a, b, c) {
		var d, e, f, g, h, i, j, d, e, k, l, n, o = 120,
			p = a.right - a.left + 1,
			q = a.bottom - a.top + 1,
			r = 0,
			s = 0,
			t = [],
			u = null,
			v = m[c.zoom];
		for (s = 0; q > s; s++)
			for (k = 0, d = 0; o > d; d++) {
				for (f = [], j = s * o + d, r = a.left; r < a.left + p; r++)
					for (i = b[s * p + r - a.left], !u && i.lastModified && (u = i.lastModified), g = i[0].data || i[0], h = i[1] ? i[1].data || i[1] : null, e = 0; o > e; e++) l = k + e, value = g[l], f.push("wind" == c.overlay ? [value / 10, h[l] / 10] : "gust" == c.overlay ? value / 10 : value);
				k += o, n = f[f.length - 1], f.push(n), f.push(n), f.push(n), f.push(n), f.push(n), f.push(n), t.push(f)
			}
		if (t.push(f), t.push(f), t.push(f), t.push(f), t.push(f), t.push(f), t && 0 != t.length) {
			var w = (1 + a.right) * v.size - v.resolution,
				x = a.left * v.size;
			return {
				tiles: a.tiles,
				zoom: c.zoom,
				name: c.overlay,
				product: c.product,
				level: c.level,
				nx: t[0].length,
				ny: t.length,
				lastModified: u,
				lon1: x > 180 ? x - 360 : x,
				lon2: w > 180 ? w - 360 : w,
				lo1: x,
				lo2: w > 360 ? w - 360 : w,
				la2: 90 - a.top * v.size,
				la1: 90 - (1 + a.bottom) * v.size - v.resolution,
				dx: v.resolution,
				dy: v.resolution,
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
		}],
		n = function() {
			for (var a = {
					refTime: null,
					name: "Empty null table",
					scale_factor: 1,
					add_offset: 0,
					nx: 120,
					ny: 120,
					la1: null,
					lo1: null,
					la2: null,
					lo2: null,
					dx: null,
					dy: null
				}, b = [], c = 0; 14400 > c; c++) b[c] = null;
			return [{
				header: a,
				data: b
			}, {
				header: a,
				data: b
			}]
		}();
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
	var d, e, f = {
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
		g = {
			gfs: {},
			accumulations: {},
			snowcover: {}
		};
	g.getProductString = function(a) {
		return f[a]
	};
	var h = (new Date).toISOString().replace(/^\d+-(\d+)-(\d+)T.*$/, "$1$2");
	return g.gfs = {
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
		model: "GFS 12x12km",
		provider: "NOAA",
		interval: "6h",
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
		display: function(a, c, f, g) {
			b.interpolate(c, f, {
				disableOverlay: a.mapsZoom > 11,
				reduceVelocity: this.level2reduce[a.level] || 1
			}, g), e = c.lastModified, d = this
		},
		zoom2zoom: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	}, g.accumulations = {
		model: "GFS 12x12km",
		provider: "NOAA",
		interval: "12h",
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
				filename: b.overlay + "-" + b.acTime + ".json?" + h,
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
		display: function(a, c, f, g) {
			b.interpolate(c, f, {
				disableOverlay: a.mapsZoom > 11
			}, g), e = f.lastModified, d = this
		},
		zoom2zoom: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	}, g.snowcover = {
		model: "NSIDC 1x1km",
		provider: "NSIDC (nsidc.org)",
		interval: "24h",
		getTasks: function(b) {
			return [a.load({
				fullDirectory: global.server + "snowcover/latest/",
				filename: "snowcover.json?" + h,
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
		display: function(a, c, f, g) {
			b.interpolate(c, c, {
				overlayOnly: !0,
				disableOverlay: !1
			}, g), e = c.lastModified, d = this
		},
		zoom2zoom: [0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
	}, g
}]), myApp.provider("trans", ["$translateProvider", function(a) {
	var b = "en";
	this.init = function() {
		var c, d;
		a.translations("en", languages.en), d = window.navigator, c = d.languages ? d.languages[0] : d.language || d.browserLanguage || d.systemLanguage || d.userLanguage || "en", c && supportedLanguages.indexOf(c) > -1 ? b = c : c && (c = c.replace(/-\S+$/, ""), b = supportedLanguages.indexOf(c) > -1 ? c : "en"), a.preferredLanguage(b).fallbackLanguage("en"), c != b && log("langmissing/" + c)
	}, this.$get = ["$translate", "$rootScope", "$http", function(c, d, e) {
		function f() {
			c(global.texts).then(function(a) {
				angular.copy(a, g)
			})
		}
		var g = {};
		return f(), "en" !== b && e.get("/js/lang-" + b + ".json?" + global.version).success(function(c) {
			a.translations(b, c), f()
		}).error(function() {
			event("Error loading lang file:" + b)
		}), g
	}]
}]), myApp.service("legends", ["settings", function(a) {
	"use strict;";
	var b = {
		temp: {
			metric: 0,
			description: ["掳C", "掳F"],
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
				[99500, 995, 29.38],
				[99800, 998, 29.47],
				[100100, 1001, 29.56],
				[100400, 1004, 29.64],
				[100700, 1007, 29.73],
				[101e3, 1010, 29.82],
				[101300, 1013, 29.91],
				[101600, 1016, 30],
				[101900, 1019, 30.09],
				[102200, 1022, 30.17],
				[102500, 1025, 30.27],
				[102800, 1028, 30.36]
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
			[99e3, [37, 4, 42, 120]],
			[99500, [41, 10, 130, 120]],
			[1e5, [81, 40, 40, 120]],
			[100300, [192, 37, 149, 120]],
			[100600, [70, 215, 215, 120]],
			[100900, [21, 84, 187, 120]],
			[101500, [24, 132, 14, 120]],
			[101900, [247, 251, 59, 120]],
			[102200, [235, 167, 21, 120]],
			[102500, [230, 71, 39, 120]],
			[103e3, [88, 27, 67, 120]]
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
"object" == typeof module && module.exports && (module.exports = overlayColors), myApp.service("colors", [function() {
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
}]), myApp.service("calendar", ["settings", function(a) {
	function b(a) {
		var b = Math.round(a * i),
			c = l.reduce(function(a, c) {
				return Math.abs(c - b) < Math.abs(a - b) ? c : a
			});
		return k[c] ? k[c] : d(a)
	}

	function c(a) {
		return (a - h) / (j - h)
	}

	function d(a) {
		var b, c;
		a > .6 ? (b = 12, c = 6) : (b = 3, c = 0);
		var d, e = h.add(a * i),
			f = e.getUTCHours(),
			g = f % b;
		return d = .3 * b > g ? f - g + c : g >= .3 * b ? f + b - g + c : f, e.setUTCHours(d), e.toUTCPath()
	}

	function e(a) {
		var b = new Date;
		return b = b.add(6 - b.getUTCHours() % 6 + a, "hours"), b.toUTCPath()
	}
	var f = global.numberOfDays,
		g = ["SUN2", "MON2", "TUE2", "WED2", "THU2", "FRI2", "SAT2"],
		h = new Date;
	h.setHours(0), h.setMinutes(0), h.setSeconds(0), h.setMilliseconds(0);
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
			var b = parseInt(a / 24),
				c = h.add(a);
			return {
				text: n[b].display,
				day: n[b].day,
				hour: p(c.getHours()),
				index: a / i,
				sequence: o++,
				timestamp: c.getTime()
			}
		}
		var c, e, j, e, o = 0,
			p = a.getHoursFunction();
		for (c = 2; f > c; c++) n[c] = {
			display: g[h.add(c, "days").getDay()],
			day: h.add(c, "days").getDate(),
			index: c,
			month: h.add(c, "days").getMonth() + 1
		};
		if ("object" == typeof minifest && Object.keys(minifest).length > 10) {
			for (c = -9; i + 12 > c; c++) j = h.add(c), e = j.toUTCPath(), minifest[e.replace(/^\d+\/\d+\/(\d+)\/(\d+)$/, "$1$2")] && (k[c] = e, l.push(c));
			for (c = 0; i > c; c++)(e = k[c]) && (m[e] = b(c))
		} else
			for (c = 0; i > c; c++) e = d(c / i), m[e] || (m[e] = b(c))
	}(), {
		dayHours: m,
		calendar: n,
		getPath: b,
		giveMeDate: e,
		time2index: c
	}
}]), myApp.service("windyty", ["$rootScope", "maps", "colors", function(a, b) {
	"use strict";

	function c() {
		window.clearTimeout(z), window.clearTimeout(A), q = [], H.clearRect(0, 0, G.width, G.height), J[K].clearRect(0, 0, G.width, G.height)
	}

	function d(b, c) {
		var d, e, f = 1;
		window.clearTimeout(z), E = !0, f = window.devicePixelRatio, G && f > 1 && (d = c.size.x, e = c.size.y, G.width = d * f, G.height = e * f, G.style.width = d + "px", G.style.height = e + "px", G.getContext("2d").scale(f, f)), o = {
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
		}, D = !0, k = [1, 1, 1, 1, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3][c.zoom], l = 1 / (50 * Math.pow(1.8, c.zoom - 3)), m = 1 / (70 * Math.pow(1.6, c.zoom - 3)), C = c.zoom > 11, v = [3, 3, 3, 3, 5, 5, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12][c.zoom], w = [4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 10, 10, 10, 10, 10, 10, 10, 10][c.zoom], a.$emit("windytyRedraw")
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
			for (h = 0; m > h; h += 6) l[h + 4] > 100 && (l[h + 4] = 0, l[h] = Math.round(Math.floor(Math.random() * o)), l[h + 1] = Math.round(Math.floor(Math.random() * r))), a = l[h], b = l[h + 1], j = n[Math.round(b)], c = j && j[Math.round(a)] || [0 / 0, 0 / 0, null], null === c[2] ? (l[h + 4] = 101, l[h + 5] = 10) : (l[h + 2] = a + c[0], l[h + 3] = b + c[1], l[h + 4]++, l[h + 5] = Math.min(3, Math.floor(c[2] / 4)));
			for (k.globalCompositeOperation = "destination-in", k.fillRect(0, 0, d, e), k.globalCompositeOperation = "source-over", h = 0; 4 > h; h++) {
				for (k.beginPath(), k.strokeStyle = s[h], i = 0; m > i; i += 6) l[i + 5] == h && (k.moveTo(l[i], l[i + 1]), k.lineTo(l[i + 2], l[i + 3]), l[i] = l[i + 2], l[i + 1] = l[i + 3]);
				k.stroke()
			}
		}
		window.clearTimeout(A);
		var b, c = 100,
			d = n.width,
			e = n.height,
			f = Math.min(15e3, Math.round(d * e * l)),
			g = C ? ["rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)"] : ["rgba(200,200,200,1)", "rgba(215,215,215,1)", "rgba(235,235,235,1)", "rgba(255,255,255,1)"];
		H.lineWidth = k, H.fillStyle = "rgba(0, 0, 0, 0.9)";
		var h = p;
		for (b = 0; 6 * f > b; b += 6) h[b] = Math.round(Math.floor(Math.random() * d)), h[b + 1] = Math.round(Math.floor(Math.random() * e)), h[b + 2] = 0, h[b + 3] = 0, h[b + 4] = Math.floor(Math.random() * c), h[b + 5] = 0;
		! function i() {
			A = setTimeout(function() {
				a(), i()
			}, 40)
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
	window.Worker ? j = new Worker("/js/blur.js") : event("Web Worker not supported");
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
	return I[0].style.opacity = 0, I[1].style.opacity = 0, b.on("dragend", c), b.on("zoomstart", c), b.on("resize", c), {
		interpolateValues: e,
		interpolate: f,
		animate: g
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
		CELSIUS: "掳C",
		FAHRENHEIT: "掳F",
		KNOT: "kt",
		BEAUFORT: "bft",
		METER_PER_SECOND: "m/s",
		MILE_PER_HOUR: "mph",
		KILOMETER_PER_HOUR: "km/h"
	}, metric2meteoblue = {
		"掳C": "CELSIUS",
		"掳F": "FAHRENHEIT",
		kt: "KNOT",
		bft: "BEAUFORT",
		"m/s": "METER_PER_SECOND",
		mph: "MILE_PER_HOUR",
		"km/h": "KILOMETER_PER_HOUR"
	};
	var e = {},
		f = a.get("favs") || {},
		g = [],
		h = {
			US: {
				wind: "kt",
				rain: "in",
				pressure: "inHg",
				snow: "in",
				temp: "掳F",
				hours: "12h"
			},
			other: {
				wind: "kt",
				rain: "mm",
				pressure: "hPa",
				snow: "cm",
				temp: "掳C",
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
		for (a in f) c = f[a], i = "spot/" + (c.icao ? "ad/" + c.icao : "location"), d = L.divIcon({
			className: "favs-icon",
			html: '<span>&#x2022;</span><a href="' + i + "/" + c.lat + "/" + c.lon + (c.icao ? "" : "/name/" + c.name) + '">' + c.name.trunc(13) + "</a>",
			iconSize: [25, 25],
			iconAnchor: [5, 13]
		}), e = L.marker([c.lat, c.lon], {
			icon: d
		}).addTo(b), g.push(e)
	}, e
}]), myApp.controller("WindytyCtrl", ["$http", "$scope", "$rootScope", "$location", "maps", "calendar", "legends", "$timeout", "progressBar", "products", "$q", function(a, b, c, d, e, f, g, h, i, j, k) {
	"use strict";

	function l(a) {
		var c = f.getPath(a);
		window.clearTimeout(G), b.animationRunning = !1, H = !1, I = !1, i.setIndex(a), w = a, c != b.rqstdDir && (b.rqstdDir = c, b.dayLoader = !0, n(), log("fcst/" + (b.historical ? "historical" : Math.round(w * F) + "day")))
	}

	function m() {
		b.layout.zoom = e.getZoom();
		var a = e.getCenter(),
			f = a.lat.toFixed(3),
			g = a.wrap().lng.toFixed(3),
			h = [f, g, b.layout.zoom];
		"accumulations" == b.product && "next24h" != b.acTime ? h.unshift(b.acTime) : (x != z || b.historical || c.date) && h.unshift(x.replace(/\//g, "-")), "snowcover" === b.product ? h.unshift(b.product) : "wind" !== b.overlay && h.unshift(b.overlay), "surface" != b.level && "gfs" == b.product && h.unshift(b.level), d.search(h.join(",")), b.$evalAsync(), c.$emit("changeParams", {
			zoom: b.layout.zoom,
			lat: f,
			lon: g,
			overlay: b.overlay,
			timestamp: b.dayHours[x].timestamp
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
			cancelTasks: !0,
			dirtyFlag: !1
		}, function(c) {
			c && "Cancelled" !== c ? (x = y, u = v, b.level = A, b.overlay = B, b.acTime = C, i.setIndex(u), b.dayLoader = b.overlayLoader = b.levelLoader = !1) : c || (x = y = b.rqstdDir, A = b.level, B = b.overlay, C = b.acTime, u = v = w, b.dayLoader = b.overlayLoader = b.levelLoader = !1), a(c)
		})
	}

	function o(a, b, d) {
		d = d || function() {};
		var e = [];
		b.cancelTasks && J.length && J.forEach(function(a) {
			"function" == typeof a && a()
		}), J = [], a.product.getTasks(a).forEach(function(a) {
			e.push(a.promise), J.push(a.cancel)
		}), t = a, c.overAllLoader = !0, k.all(e).then(function(c) {
			J = [], r = c[0], s = c[1], H = !1, I = !1, p(b.dirtyFlag, function() {
				d(null, a)
			})
		}, function(b) {
			d(b, a)
		})
	}

	function p(a, b) {
		if (b = b || function() {}, t && r) {
			var d = "ok";
			switch (a && (t.mapsZoom = e.getZoom(), t.bounds = e.getMyBounds(), d = t.product.checkCoverage(r, t)), d) {
				case "ok":
					t.product.display(t, r, s, function() {
						b(), M = 0, c.overAllLoader = !1, c.$emit("redrawFinished", t, a)
					});
					break;
				case "no-data":
					M++ > 10 ? console.error("displayAnimation was cycled") : o(t, {
						cancelTasks: !1,
						dirtyFlag: a
					}, b);
					break;
				case "out-of-bounds":
					break;
				case "out-of-timeline":
			}
		}
	}

	function q() {
		if (u >= 1 || "gfs" !== b.product) return b.animationRunning = !1, H = !1, I = !1, void b.$evalAsync();
		I || (u += E, i.setIndex(u, !0));
		var a = f.getPath(u);
		a != x && (H ? (b.dayLoader = !0, b.$evalAsync(), I = !0) : (H = !0, b.rqstdDir = x = a, o({
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
		}))), G = setTimeout(q, D)
	}
	var r, s, t, u, v, w, x, y, z, A, B, C, D = 100,
		E = 5e-4,
		F = global.numberOfDays,
		G = null,
		H = !1,
		I = !1,
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
		L = ["wind", "temp", "clouds", "snow", "pressure", "rh"],
		M = 0;
	b.calendar = f.calendar, b.dayHours = f.dayHours, b.init = function(a) {
		if (b.historical = !1, a && b.dayHours[a]) u = b.dayHours[a].index;
		else if (a) {
			var d = a.split("/");
			b.daysAgo = Math.round((Date.now() - Date.UTC(d[0], d[1] - 1, d[2], d[3])) / 864e5), b.historical = !0, b.histDate = d[0] + "-" + d[1] + "-" + d[2] + " " + d[3] + ":00 UTC", u = f.time2index(new Date)
		} else u = f.time2index(new Date);
		i.setIndex(u), "snowcover" === c.overlay && (c.overlay = "snow", c.product = "snowcover"), v = w = u, b.rqstdDir = x = y = z = a || f.getPath(u), b.overlay = B = c.overlay || "wind", b.level = A = c.level || "surface", b.acTime = C = c.acTime || "next24h", b.product = c.product || j.getProductString(b.overlay) || "gfs", b.animationRunning = !1, b.dayLoader = !0, b.overlayLoader = b.levelLoader = b.overAllLoader = !1, n(function() {
			c.$emit("windytyReady")
		}), b.legend = g(b.overlay, !1)
	}, b.init(c.date), c.$on("otherClick", function(a, c) {
		if ("gfs" !== b.product || 37 !== c && 39 !== c) 38 === c || 40 === c ? b.changeParams("overlay", L.getNextItem(b.overlay, 40 === c)) : 33 !== c && 34 !== c || "gfs" !== b.product || "wind" !== b.overlay || b.changeParams("level", global.levels.getNextItem(b.level, 33 === c));
		else {
			var d, e = b.dayHours[b.rqstdDir] && b.dayHours[b.rqstdDir].sequence + (37 === c ? -1 : 1);
			for (d in b.dayHours) b.dayHours[d].sequence == e && l(b.dayHours[d].index)
		}
	}), b.selectDay = function(a) {
		l(parseInt(a) / F + .52 / F)
	}, b.selectHour = function(a) {
		l(parseFloat(a))
	}, c.$on("indexChanged", function(a, b) {
		l(b)
	}), b.toggleAnimation = function() {
		b.animationRunning ? (l(u), log("animation/stopped")) : (b.animationRunning = !0, q(u), log("animation/started"))
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
	}, b.updateProductInfo = function() {
		var a = new Date(r.lastModified),
			c = Math.floor((Date.now() - a.getTime()) / 6e4);
		b.lastModString = 60 > c ? c + "m ago" : Math.floor(c / 60) + "h ago", b.productModel = t.product.model, b.productInterval = t.product.interval
	}, c.$on("redrawFinished", m), c.$on("reset", function() {
		b.init(null)
	}), c.$on("windytyRedraw", function() {
		p(!0)
	}), c.$on("showForecast", function(a, b) {
		l(f.time2index(1e3 * b))
	})
}]), myApp.controller("FltLineCtrl", ["$rootScope", "maps", "$scope", function(a, b, c) {
	function d(a) {
		c.km = a.distance / 1e3, c.$evalAsync()
	}
	var e = a.airports[0],
		f = a.airports[1],
		g = L.marker([e.lat, e.lon], {
			draggable: !0
		}).addTo(b),
		h = L.marker([f.lat, f.lon], {
			draggable: !0
		}).addTo(b),
		i = L.geodesic([
			[
				[e.lat, e.lon],
				[f.lat, f.lon]
			]
		], {
			weight: 5,
			opacity: .8,
			color: "white",
			steps: 20
		}).addTo(b),
		j = Math.max(e.lat, f.lat),
		k = Math.min(e.lat, f.lat);
	b.fitBounds([
		[k, e.lon],
		[j, f.lon]
	], {
		animate: !0,
		padding: [20, 100]
	}), i.update = function() {
		i.setLatLngs([
			[g.getLatLng(), h.getLatLng()]
		]), d(i._vincenty_inverse(g.getLatLng(), h.getLatLng()))
	}, i.update(), g.on("drag", i.update), h.on("drag", i.update), log("fltline/" + e.icao + "_" + f.icao), c.$on("$destroy", function() {
		b.removeLayer(g), b.removeLayer(h), b.removeLayer(i)
	})
}]), myApp.controller("QueryCtrl", ["$scope", "$http", "$element", "$location", "$timeout", "$q", "$rootScope", "trans", "maps", "storage", function(a, b, c, d, e, f, g, h, i, j) {
	function k() {
		a.active = -1, a.suggestions = [], a.next = 0, r = 0, m && i.removeLayer(m), a.loader = !1, a.fltline = !1
	}

	function l() {
		m && i.removeLayer(m), a.suggestions[a.active].lat && !a.fltline && (m = L.marker([a.suggestions[a.active].lat, a.suggestions[a.active].lon], {
			icon: i.hit,
			bounceOnAdd: !0,
			bounceOnAddOptions: {
				duration: 500,
				height: 100
			}
		}).addTo(i))
	}
	var m = null,
		n = null,
		o = null,
		p = [],
		q = !1,
		r = 0;
	a.step = 5, k(), a.recents = j.get("recents") || [], a.change = function() {
		function c(c) {
			var d = f.defer(),
				e = i.getMyBounds();
			return a.loader = !0, b.get(global.server2 + "node/search/" + c.replace(/\//g, " ") + "/" + e.top + "/" + e.right + "/" + e.bottom + "/" + e.left, {
				cache: !0
			}).success(function(b) {
				a.loader = !1, c == a.query ? d.resolve(b) : d.reject()
			}).error(function() {
				a.loader = !1
			}), d.promise
		}
		a.fltline = !1, a.showRecents = !1, a.query.length > 1 ? (n && e.cancel(n), n = e(function() {
			a.query.length > 1 && c(a.query).then(function(b) {
				b && "2airports" == b[0] ? (a.fltline = !0, g.airports = b[1], p = b[1], loadData(0)) : (p = b, k(), loadData(0))
			})
		}, 300)) : a.suggestions = []
	}, loadData = function(b) {
		a.suggestions = p.slice(b, b + a.step), a.next = p.length > b + a.step ? b + a.step : null, a.next && a.suggestions.push({
			title: h.NEXT,
			offset: a.next
		})
	}, a.selectActive = function(b) {
		a.active = b, l()
	}, a.submit = function(b) {
		a.active = b, goSearch()
	}, a.goRecent = function(b) {
		a.query = b, q = !0, a.change()
	}, a.blur = function() {
		a.layout.searchFocus = !1, a.fltline || (o = e(function() {
			q ? q = !1 : (a.query = "", a.showRecents = !1, k())
		}, 500))
	}, a.focus = function() {
		a.showRecents = !0, a.layout.searchFocus = !0
	}, goSearch = function() {
		var b = a.suggestions[a.active];
		if (b.offset) return loadData(a.suggestions[a.active].offset), void(o && e.cancel(o));
		d.path("spot/" + (b.icao ? "ad/" + b.icao + "/" : "location/") + parseFloat(b.lat).toFixed(3) + "/" + parseFloat(b.lon).toFixed(3) + (b.icao ? "" : "/name/" + b.title.replace(/\//g, " ")));
		var c = a.recents.indexOf(a.query);
		c > -1 && a.recents.splice(c, 1), a.recents.unshift(a.query) > 5 && a.recents.pop(), j.put("recents", a.recents), a.fltline || (a.query = "", k()), log("search")
	}, g.$on("searchClick", function(b, c) {
		40 === c && a.suggestions.length ? (a.active = (a.active + 1) % a.suggestions.length, a.$evalAsync(), l()) : 38 === c && a.suggestions.length ? (a.active = (a.active ? a.active : a.suggestions.length) - 1, a.$evalAsync(), l()) : 9 !== c && 13 !== c || !a.suggestions.length ? 27 === c && (a.query ? (a.query = "", a.showRecents = !1, k()) : document.getElementById("q").blur(), a.$evalAsync()) : (a.active = -1 == a.active ? 0 : a.active, goSearch(), a.$evalAsync())
	})
}]), myApp.controller("DetailCtrl", ["$http", "$scope", "$routeParams", "$rootScope", "$location", "$timeout", "maps", "settings", "conversions", function(a, b, c, d, e, f, g, h, i) {
	function j() {
		var a = k.getLatLng();
		e.path("spot/location/" + a.lat.toFixed(3) + "/" + a.lng.toFixed(3)), b.$evalAsync()
	}
	var k, l = document.title;
	b.lat = parseFloat(c.lat), b.lon = parseFloat(c.lon), b.timezone = "", b.timestamp = Date.now(), d.sharedCoords = {
		lat: b.lat,
		lon: b.lon,
		panto: -740,
		zoom: 9
	}, b.isFavorite = h.isFav(c.icao, b.lat, b.lon), k = L.marker([b.lat, b.lon], {
		icon: g.dragMe,
		draggable: !0
	}).on("dragend", j).addTo(g), d.$emit("closePopup"), b.$on("$viewContentLoaded", function() {
		f(function() {
			b.layout.detail = !0
		}, 1500)
	}), global.isMobile || g.center(d.sharedCoords), b.metric = {
		MBwind: h.getMetricMB("wind"),
		MBtemp: h.getMetricMB("temp"),
		wind: h.getMetric("wind"),
		temp: h.getMetric("temp")
	}, b.changeSettings = function(a) {
		h.setMetric(a, "wind" == a ? b.metric.wind : b.metric.temp), b.metric.MBwind = h.getMetricMB("wind"), b.metric.MBtemp = h.getMetricMB("temp")
	}, "ad" == c.type || "a" == c.type ? (b.airport = !0, a.get(global.server2 + "metar/ad/" + c.icao + ".json").success(function(a) {
		b.name = c.name || a.info.name || c.icao, b.icao = c.icao, b.elevation = a.info.elevation_ft, b.iata = a.info.iata_code, b.wiki = a.info.wikipedia_link, b.altitude = .3048 * a.info.elevation_ft, b.taf = a.taf, b.tafUx = a.tafUx, b.tafTxt = a.tafTxt, b.tafRmk = a.tafRmk, b.decodedMetars = [], a.trend && a.trend.forEach(function(a) {
			a.wind.speedMPS ? (a.force = Math.round(i[b.metric.wind].conversion(a.wind.speedMPS)), a.wind.gustMPS && (a.gust = Math.round(i[b.metric.wind].conversion(a.wind.gustMPS)))) : a.force = "calm", a.dirStyle = {
				transform: "rotate(" + (a.wind.dir - 225) + "deg)",
				"-webkit-transform": "rotate(" + (a.wind.dir - 225) + "deg)"
			}
		}), b.trend = a.trend, "a" == c.type && (document.title = b.icao + ", " + b.name + ", METAR, TAF, NOTAMs at Windyty")
	}).error(function() {
		b.name = c.name || res.info.name || c.icao, b.icao = c.icao
	}), log("detail/airport")) : (b.place = !0, b.name = b.lat + ", " + b.lon, a.get(global.server2 + "node/reverse/" + b.lat + "/" + b.lon).success(function(a) {
		var d = a.display_name && a.display_name.match(/(.*?),\s+(.*)$/);
		d && (b.name = c.name || d[1], b.subname = d[2], "loc" == c.type && (document.title = "Local weather " + c.name + " at Windyty"))
	}), log("detail/location")), a.get(global.server2 + "node/celestial/" + b.lat + "/" + b.lon).success(function(a) {
		b.celestial = a
	}), b.favorites = function() {
		b.isFavorite ? (h.removeFav(b.icao, b.lat, b.lon), b.isFavorite = !1) : (h.addFav(b.icao, b.lat, b.lon, b.name), b.isFavorite = !0)
	}, b.close = function() {
		e.path("/")
	}, b.$on("$destroy", function() {
		k && g.removeLayer(k), b.layout.detail = !1, document.title = l
	})
}]).filter("howOld", function() {
	var a, b;
	return function(c, d) {
		return b = Math.floor(Date.now() / 6e4), a = b - c, 60 > a ? a + "m ago" : Math.floor(a / 60) + "h " + Math.floor(a % 60) + "m" + (d ? " ago" : "")
	}
}), myApp.controller("WavesCtrl", ["$http", "$scope", "$routeParams", "$rootScope", "$location", "$timeout", "maps", "settings", "conversions", function(a, b, c, d) {
	b.wave = null, a.get(global.server2 + "node/wave/" + b.lat + "/" + b.lon + "/" + b.celestial.TZoffset + ("UTC" === b.celestial.TZname ? "" : "/" + b.celestial.sunrise + "/" + b.celestial.sunset)).success(function(a) {
		b.wave = a
	}), d.$on("changeParams", function(a, c) {
		b.timestamp = Math.floor(c.timestamp / 1e3)
	}), b.showForecast = function(a) {
		d.$emit("showForecast", a)
	}, log("detail/location/waves")
}]).filter("kt2color", function() {
	return function(a) {
		return 2 > a ? "rgba(37, 74, 255, 0.01)" : 6 > a ? "rgba(0, 150, 254, 0.1)" : 10 > a ? "rgba(18, 196, 200, 0.25)" : 14 > a ? "rgba(18, 211, 73, 0.4)" : 18 > a ? "rgba(0, 240, 0, 0.5)" : 22 > a ? "rgba(127, 237, 0, 0.6)" : 26 > a ? "rgba(254, 199, 0, 0.6)" : 30 > a ? "rgba(237, 124, 14, 0.6)" : 34 > a ? "rgba(200, 37, 39, 0.6)" : 38 > a ? "rgba(217, 0, 100, 0.6)" : 46 > a ? "rgba(202, 25, 186, 0.6)" : 50 > a ? "rgba(86, 54, 222, 0.6)" : "rgba(42, 132, 222, 0.6)"
	}
}).filter("m2color", function() {
	return function(a) {
		return .5 > a ? "rgba(18, 55, 200, 0.01)" : .7 > a ? "rgba(18, 55, 200, 0.05)" : 1 > a ? "rgba(18, 55, 200, 0.1)" : 1.3 > a ? "rgba(18, 55, 200, 0.17)" : 1.6 > a ? "rgba(23, 16, 181, 0.2)" : 2 > a ? "rgba(28, 19, 198, 0.3)" : 2.5 > a ? "rgba(54, 44, 219, 0.4)" : 3 > a ? "rgba(67, 56, 229, 0.5)" : "rgba(237, 54, 253, 0.6)"
	}
}).filter("picto2font", function() {
	var a = "6666&&&&&&~~~555&&&&&&79898998998988";
	return function(b) {
		return a.charAt(b)
	}
}).filter("kt2metric", function() {
	return function(a, b) {
		switch (b) {
			case "m/s":
				return .514 * a;
			case "km/h":
				return 1.85 * a;
			case "mph":
				return 1.15 * a;
			case "bft":
				return 1 > a ? 0 : 4 > a ? 1 : 7 > a ? 2 : 11 > a ? 3 : 17 > a ? 4 : 22 > a ? 5 : 28 > a ? 7 : 34 > a ? 7 : 41 > a ? 8 : 48 > a ? 9 : 56 > a ? 10 : 11;
			case "kt":
				return a
		}
	}
}).filter("c2metric", function() {
	return function(a, b) {
		return "掳F" == b ? 1.8 * a + 32 : a
	}
}).controller("NotamsCtrl", ["$http", "$scope", function(a, b) {
	var c = [];
	a.get(global.server2 + "node/notam/" + b.icao).success(function(a) {
		a && a.length > 0 ? (c = a, b.validNotams = c) : b.noNotams = !0
	}), b.active = function(a) {
		var d = [];
		a ? (c.forEach(function(a) {
			a.validityHr > 0 && (a.expireHr < 0 || !a.expireHr) && d.push(a)
		}), b.validNotams = d) : b.validNotams = c
	}, log("detail/airport/notam")
}]).controller("WebcamsCtrl", ["$http", "$scope", "$routeParams", "maps", "conversions", function(a, b, c, d, e) {
	var f = null;
	b.markerOn = function(a, b) {
		f && d.removeLayer(f), f = L.marker([a, b], {
			icon: d.webcam,
			bounceOnAdd: !0,
			bounceOnAddOptions: {
				duration: 500,
				height: 100
			}
		}).addTo(d)
	}, b.markerOff = function() {
		f && d.removeLayer(f)
	}, a.get(global.server2 + "node/webcams/" + b.lat + "/" + b.lon).success(function(a) {
		b.webcams = a.webcams && a.webcams.webcam, b.webcams.length > 0 ? b.webcams.forEach(function(a) {
			a.distkm = e.getDistance(b.lat, b.lon, a.latitude, a.longitude), a.duration = Math.floor((Date.now() / 1e3 - a.last_update) / 60)
		}) : b.message = !0
	}), b.$on("$destroy", function() {
		f && d.removeLayer(f)
	})
}]);