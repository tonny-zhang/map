(function() {
	var e = e || {
			version: 1.3
		},
		aa = {};
	e.J = function() {};
	e.J.extend = function(a) {
		function b() {}

		function c() {
			this.j && this.j.apply(this, arguments)
		}
		b.prototype = this.prototype;
		var d = new b;
		d.constructor = c;
		c.prototype = d;
		for (var f in this) this.hasOwnProperty(f) && "prototype" !== f && (c[f] = this[f]);
		a.Ts && (e.extend(c, a.Ts), delete a.Ts);
		a.Ua && (e.extend.apply(null, [d].concat(a.Ua)), delete a.Ua);
		a.h && d.h && (a.h = e.extend({}, d.h, a.h));
		e.extend(d, a);
		a.toString && (d.toString = a.toString);
		c.Eg = this.prototype;
		return c
	};
	e.J.ad = function(a) {
		e.extend(this.prototype, a)
	};
	e.extend = function(a) {
		var b = Array.prototype.slice.call(arguments, 1),
			c, d, f, g;
		d = 0;
		for (f = b.length; d < f; d += 1)
			for (c in g = b[d] || {}, g) Object.prototype.hasOwnProperty.call(g, c) && ("function" === typeof g[c] && "function" === typeof a[c] && (g[c].ra = a[c]), a[c] = g[c]);
		return a
	};
	e.J.Jd = function(a) {
		for (var b in a)
			if (a.hasOwnProperty(b)) {
				var c = a[b];
				this.prototype[b] && (this.prototype[c] = this.prototype[b])
			}
	};
	e.ba = {
		a: function(a, b, c, d, f) {
			if (this.nc(a, b, c || this)) return this;
			var g = this.Yd = this.Yd || {};
			g[a] = g[a] || [];
			f ? g[a].unshift({
				fb: b,
				$f: c || this,
				ih: d
			}) : g[a].push({
				fb: b,
				$f: c || this,
				ih: d
			});
			return this
		},
		nc: function(a, b, c) {
			var d = this.Yd;
			if (b && c) {
				if (d && a in d && d[a])
					for (var f = 0; f < d[a].length; f += 1)
						if (d[a][f].fb === b && d[a][f].$f === c) return !0;
				return !1
			}
			return d && a in d && d[a] && 0 < d[a].length
		},
		u: function(a, b, c) {
			if (!this.nc(a)) return this;
			var d = this.Yd;
			if (d && d[a])
				for (var f = 0; f < d[a].length; f += 1)
					if (!(d[a][f].fb !== b && "mv" !==
						b || c && d[a][f].$f !== c)) {
						d[a].splice(f, 1);
						d[a].length || delete d[a];
						break
					}
			return this
		},
		q: function(a, b) {
			if (!this.nc(a)) return this;
			for (var c = e.extend({
				type: a
			}, b), d = [].concat(this.Yd[a]), f = 0; f < d.length; f += 1) d[f].fb && (d[f].fb.call(d[f].$f || this, c), d[f].ih && this.Yd[a] && this.Yd[a].splice(f, 1));
			return this
		},
		$h: function(a) {
			a ? this.Yd && this.Yd[a] && (this.Yd[a] = null) : this.Yd = null;
			return this
		}
	};
	e.$b = {
		set: function(a, b, c) {
			var d = this.hd;
			if (d && d[a]) {
				var d = d[a],
					f = "set" + this.er(a);
				d[f] ? (d[f](b, c), c || this.dk(a, b)) : d.set(a, b, c)
			} else(this.Tc = this.Tc || {})[a] = b, c || this.dk(a, b)
		},
		er: function(a) {
			return a.charAt(0).toUpperCase() + a.substr(1)
		},
		get: function(a, b, c) {

			
			var d, f = this.hd;
			d = "get" + this.er(a);
			// if(a == 'opacity'){
			// 	console.log(a,b,c,d,f);
			// }
			if (f && f[a]) return c = f[a], c[d] ? c[d](b) : c.get(a, b);
			if(a == 'opacity'){
				console.log('after 1');
			}
			if (this[d] && !c) return this[d](b);
			if(a == 'opacity'){
				console.log('after 2',this[d]);
			}
			if (this.Tc && this.Tc.hasOwnProperty(a)){if(a == 'opacity'){console.log('this.Tc[a]',this.Tc[a]);};return this.Tc[a];} 
			console.log('after 3');
		},
		C: function(a, b, c) {
			b.a(a, function(b) {
				this.dk(a, b)
			}, this);
			this.hd || (this.hd = {});
			this.hd[a] !== b && (this.hd[a] = b, c || this.dk(a))
		},
		lc: function(a, b) {
			for (var c = 0; c < a.length; c += 1) this.C(a[c], b, !0)
		},
		gt: function(a) {
			this.hd && this.hd[a] && (this.hd[a].u(a, "mv", this), delete this.hd[a])
		},
		vn: function() {
			if (this.hd)
				for (var a in this.hd) this.hd.hasOwnProperty(a) && this.gt(a)
		},
		dk: function(a, b) {
			if (this[a + "Changed"]) this[a + "Changed"](b);
			else this.sq && this.sq();
			this.q(a, b)
		},
		RD: function(a, b, c) {
			var d = new(e.J.extend({
				Ua: [e.ba, e.$b]
			}));
			d.sq = function() {
				for (var b = !0, f = 0; f < a.length; f += 1) d.get(a[f]) || (b = !1);
				b && (d.vn(), c())
			};
			for (var f = 0; f < a.length; f += 1) d.C(a[f], b)
		},
		Qd: function(a) {
			var b, c;
			for (b in a) a.hasOwnProperty(b) && (c = a[b], this.set(b, c))
		}
	};
	e.k = {
		iB: function(a, b) {
			for (var c = Math.ceil(b.length / 8), d = 0; d < c; d += 1) {
				var f = 8 * d,
					g = f + 8;
				g > b.length && (g = b.length);
				for (; f < g; f += 1) a(b[f])
			}
		},
		Ga: function(a, b, c, d) {
			c = a[b].i[c];
			if ("undefined" === typeof c) return null;
			a = a[b].s;
			if ("number" === typeof c) return a[c];
			for (;
				"undefined" === typeof c[d.toString()] && !(d -= 1, 3 > d););
			d = c[d.toString()];
			return "number" === typeof d ? a[d] : null
		},
		Wf: function(a) {
			for (var b = [], c = 0, d = a.length; c < d; c += 2) b.push(parseInt(a.substr(c, 2), 16));
			b.push(b.shift() / 255);
			return "rgba(" + b.join(",") + ")"
		},
		Bm: function(a) {
			for (var b in a)
				if (a.hasOwnProperty(b)) return !1;
			return !0
		},
		bg: function(a, b) {
			return 0 > b ? a : a.slice(0, b).concat(a.slice(b + 1, a.length))
		},
		indexOf: function(a, b) {
			if (a.indexOf) return a.indexOf(b);
			for (var c = 0; c < a.length; c += 1)
				if (a[c] === b) return c;
			return -1
		},
		bind: function(a, b) {
			var c = 2 < arguments.length ? Array.prototype.slice.call(arguments, 2) : null;
			return function() {
				return a.apply(b, c || arguments)
			}
		},
		ua: function(a, b) {
			b = b || {};
			a.h = e.extend({}, a.h, b);
			return a.h
		},
		Oq: function() {
			return !1
		},
		Hy: function(a, b) {
			return (a || "") + Math.round(Math.random() * Math.pow(10, b || 6))
		},
		Ya: function() {
			var a =
				0;
			return function(b) {
				b._amap_id || (a += 1, b._amap_id = a);
				return b._amap_id
			}
		}(),
		Jq: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
		gi: Date.now ? function() {
			return Date.now()
		} : function() {
			return (new Date).getTime()
		},
		WD: function(a, b, c, d) {
			var f;
			if (d) {
				var g = 0,
					h, k = this.gi;
				f = function() {
					h = k();
					if (h - g < b) return !1;
					g = h;
					a.apply(c, arguments)
				}
			} else {
				var l, m, n;
				n = function() {
					l = !1;
					m && (f.apply(c, m), m = !1)
				};
				f = function() {
					l ? m = arguments : (l = !0, a.apply(c, arguments), setTimeout(n, b))
				}
			}
			return f
		},
		bi: function(a, b) {
			return Number(Number(a).toFixed(b ||
				0))
		},
		isArray: function(a) {
			return Array.isArray ? Array.isArray(a) : "[object Array]" === Object.prototype.toString.call(a)
		},
		Us: function(a) {
			var b = 0;
			if (0 === a.length) return b;
			for (var c, d = 0, f = a.length; d < f; d += 1) c = a.charCodeAt(d), b = (b << 5) - b + c, b &= b;
			return b
		},
		Ur: function(a) {
			return "undefined" !== typeof JSON && JSON.stringify ? e.k.Us(JSON.stringify(a)) : null
		},
		NE: function(a, b) {
			if (b || !a.hasOwnProperty("_amap_hash")) {
				var c = e.k.Ur(a);
				c && (a._amap_hash = c)
			}
			return a._amap_hash
		},
		iepngFix: function(a) {
			function b() {
				for (var a; c.length;) a =
					c.shift(), window.DD_belatedPNG.fixPng(a);
				d.Cm = !0
			}
			this.ks || (this.ks = [], this.Cm = !1);
			var c = this.ks,
				d = this;
			if ("img" === a.tagName.toLowerCase()) c.push(a);
			else {
				a = a.getElementsByTagName("*");
				for (var f = 0; f < a.length; f += 1) c.push(a[f])
			}
			window.DD_belatedPNG && this.Cm ? setTimeout(function() {
				b()
			}, 100) : this.Cm || e.$.load("AMap.FixPng", b)
		}
	};
	(function() {
		function a(a) {
			var b, c, d = ["webkit", "moz", "o", "ms"];
			for (b = 0; b < d.length && !c; b += 1) c = window[d[b] + a];
			return c
		}

		function b(a) {
			var b = +new Date,
				d = Math.max(0, 16 - (b - c));
			c = b + d;
			return window.setTimeout(a, d)
		}
		var c = 0,
			d = window.requestAnimationFrame || a("RequestAnimationFrame") || b,
			f = window.cancelAnimationFrame || a("CancelAnimationFrame") || a("CancelRequestAnimationFrame") || function(a) {
				window.clearTimeout(a)
			};
		e.k.mh = function(a, b, c) {
			a = e.k.bind(a, b);
			if (c) a();
			else return d.call(window, a, void 0)
		};
		e.k.qq = function(a) {
			a &&
				f.call(window, a)
		}
	})();
	e.d = {
		get: function(a) {
			return "string" === typeof a ? document.getElementById(a) : a
		},
		Ga: function(a, b) {
			var c = a.style[b];
			!c && a.currentStyle && (c = a.currentStyle[b]);
			c && "auto" !== c || !document.defaultView || (c = (c = document.defaultView.getComputedStyle(a, null)) ? c[b] : null);
			c && "auto" !== c || "height" !== b || (c = a.clientHeight + "px");
			c && "auto" !== c || "width" !== b || (c = a.clientWidth + "px");
			return "auto" === c ? null : c
		},
		Nj: function(a) {
			return new e.tc(a.clientWidth || document.body.clientWidth, a.clientHeight || (e.f.le ? "CSS1Compat" === document.compatMode ?
				document.documentElement.clientHeight : document.body.clientHeight : document.body.clientHeight), !0)
		},
		$y: function(a) {
			var b = 0,
				c = 0,
				d = a,
				f = document.body,
				g = document.documentElement,
				h, k = e.f.ki;
			do {
				b += d.offsetTop || 0;
				c += d.offsetLeft || 0;
				b += parseInt(e.d.Ga(d, "borderTopWidth"), 10) || 0;
				c += parseInt(e.d.Ga(d, "borderLeftWidth"), 10) || 0;
				h = e.d.Ga(d, "position");
				if (d.offsetParent === f && "absolute" === h) break;
				if ("fixed" === h) {
					b += f.scrollTop || g.scrollTop || 0;
					c += f.scrollLeft || g.scrollLeft || 0;
					break
				}
				d = d.offsetParent
			} while (d);
			d = a;
			do {
				if (d ===
					f) break;
				b -= d.scrollTop || 0;
				c -= d.scrollLeft || 0;
				e.d.my() || !e.f.UB && !k || (c += d.scrollWidth - d.clientWidth, k && "hidden" !== e.d.Ga(d, "overflow-y") && "hidden" !== e.d.Ga(d, "overflow") && (c += 17));
				d = d.parentNode
			} while (d);
			return new e.F(c, b)
		},
		my: function() {
			e.d.Hu || (e.d.Hu = !0, e.d.Gu = "ltr" === e.d.Ga(document.body, "direction"));
			return e.d.Gu
		},
		create: function(a, b, c) {
			a = document.createElement(a);
			c && (a.className = c);
			b && b.appendChild(a);
			return a
		},
		Hq: function() {
			document.selection && document.selection.empty && document.selection.empty();
			this.bw || (this.bw = document.onselectstart, document.onselectstart = e.k.Oq)
		},
		Kq: function() {},
		ez: function(a, b) {
			return 0 < a.className.length && RegExp("(^|\\s)" + b + "(\\s|$)").test(a.className)
		},
		Rg: function(a, b) {
			e.d.ez(a, b) || (a.className += (a.className ? " " : "") + b)
		},
		kh: function(a, b) {
			a.className = a.className.replace(/(\S+)\s*/g, function(a, d) {
				return d === b ? "" : a
			}).replace(/(^\s+|\s+$)/, "")
		},
		Oy: function(a, b) {console.log('Oy',a,b);
			return 1 === b ? "" : "opacity" in a.style ? "opacity:" + b : 8 <= document.documentMode ? "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(opacity=" +
				Math.ceil(100 * b) + ")'" : "filter:alpha(opacity=" + Math.ceil(100 * b) + ")"
		},
		oh: function(a, b) {console.log(arguments.callee.caller);console.log('oh',a,b,"opacity" in a.style);
			"opacity" in a.style ? 
			a.style.opacity = b : 

			"filter" in a.style && (
				b = Math.round(100 * b), 
				a.style.filter = "", 
				100 !== b && (
					a.style.filter = " progid:DXImageTransform.Microsoft.Alpha(opacity=" + b + ")"
				)
			)
		},
		sn: function(a) {
			for (var b = document.documentElement.style, c = 0; c < a.length; c += 1)
				if (a[c] in b) return a[c];
			return !1
		},
		dr: function(a) {
			var b = e.f.VB;
			return "translate" + (b ? "3d" : "") + "(" + a.x + "px," + a.y + "px" + ((b ? ",0" : "") + ")")
		},
		CD: function(a, b) {
			return e.d.dr(b.add(b.bb(-1 *
				a))) + (" scale(" + a + ") ")
		},
		Di: function(a, b, c) {
			a.Fl = b;
			!c && e.f.ux ? (b = e.d.dr(b), c = a.style[e.d.Fb].split("rotate"), 1 < c.length ? (c[0] = b, a.style[e.d.Fb] = c.join("rotate")) : a.style[e.d.Fb] = b, e.f.Oz && (a.style.WebkitBackfaceVisibility = "hidden")) : (a.style.left = b.x + "px", a.style.top = b.y + "px")
		},
		$g: function(a) {
			a.Fl || (a.Fl = a.style.left ? new e.F(parseInt(a.style.left), parseInt(a.style.top)) : new e.F(0, 0));
			return a.Fl
		},
		HE: function(a, b) {
			a = a instanceof Array ? a : [a];
			for (var c = 0; c < a.length; c += 1) a[c].style.cssText = b
		},
		L: function(a,
			b) {
			a = a instanceof Array ? a : [a];
			for (var c = 0; c < a.length; c += 1)
				for (var d in b) b.hasOwnProperty(d) && (a[c].style[d] = b[d]);
			return this
		},
		ws: function(a) {
			for (; a.childNodes.length;) a.removeChild(a.childNodes[0])
		},
		remove: function(a) {
			a.parentNode && a.parentNode.removeChild(a)
		},
		rotate: function(a, b, c) {
			var d = e.d.Fb;
			c = c || {
				x: a.clientWidth / 2,
				y: a.clientHeight / 2
			};
			if (d) {
				var f;
				f = "" + (" translate(" + (c.x - a.clientWidth / 2) + "px," + (c.y - a.clientHeight / 2) + "px)");
				f = f + (" rotate(" + b + "deg)") + (" translate(" + (a.clientWidth / 2 - c.x) + "px," +
					(a.clientHeight / 2 - c.y) + "px)");
				a.style[d] = f
			} else d = Math.cos(b * Math.PI / 180), b = Math.sin(b * Math.PI / 180), a.style.filter = "progid:DXImageTransform.Microsoft.Matrix()", 0 < a.filters.length && (a = a.filters.item(0), a.dC = -c.x * d + c.y * b + c.x, a.eC = -c.x * b - c.y * d + c.y, a.M11 = a.M22 = d, a.M12 = -(a.M21 = b))
		},
		Ty: function(a, b, c) {
			var d = e.d.Fb;
			c = c || {
				x: a.clientWidth / 2,
				y: a.clientHeight / 2
			};
			if (d) {
				var f;
				f = "" + (" translate(" + (c.x - a.clientWidth / 2) + "px," + (c.y - a.clientHeight / 2) + "px)");
				f = f + (" rotate(" + b + "deg)") + (" translate(" + (a.clientWidth / 2 -
					c.x) + "px," + (a.clientHeight / 2 - c.y) + "px)");
				return e.d.Hi[d] + ":" + f
			}
			return ""
		},
		Bi: function(a, b, c) {
			a.width = b;
			a.height = c;
			a.getContext("2d").clearRect(0, 0, b, c)
		}
	};
	(function() {
		var a = e.d.sn(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]),
			b;
		e.extend(e.d, {
			Hq: function() {
				e.l.a(window, "selectstart", e.l.preventDefault);
				if (a) {
					var c = document.documentElement.style;
					"none" !== c[a] && (b = c[a], c[a] = "none")
				}
			},
			Kq: function() {
				e.l.u(window, "selectstart", e.l.preventDefault);
				a && "none" !== b && (document.documentElement.style[a] = b, b = "none")
			},
			gy: function() {
				e.l.a(window, "dragstart", e.l.preventDefault)
			},
			ry: function() {
				e.l.u(window, "dragstart", e.l.preventDefault)
			}
		})
	})();
	e.d.Fb = e.d.sn(["WebkitTransform", "OTransform", "MozTransform", "msTransform", "transform"]);
	e.d.Hi = {
		transform: "transform",
		WebkitTransform: "-webkit-transform",
		OTransform: "-o-transform",
		MozTransform: "-moz-transform",
		msTransform: "-ms-transform"
	};
	e.d.Lk = e.d.sn(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
	e.d.lC = "webkitTransition" === e.d.Lk || "OTransition" === e.d.Lk ? e.d.Lk + "End" : "transitionend";
	e.l = {
		a: function(a, b, c, d) {
			function f(b) {
				return c.call(d || a, b || window.event, k)
			}
			var g = e.k.Ya(c),
				h = b + g;
			if (a[h]) return this;
			var k = b;
			e.f.Rq && "mousewheel" === b && (b = "DOMMouseScroll");
			if (e.f.le && ("mouseover" === b || "mouseout" === b)) {
				var l = f;
				b = "mouseover" === b ? "mouseenter" : "mouseleave";
				f = function(a) {
					l(a)
				}
			}
			if (e.f.Nr && 0 === b.indexOf("touch")) return a[h] = f, this.ox(a, b, f, g);
			e.f.Z && "dblclick" === b && this.mx && this.mx(a, f, g);
			"addEventListener" in a ? a.addEventListener(b, f, !1) : "attachEvent" in a ? a.attachEvent("on" + b, f) : a["on" +
				b] = f;
			a[h] = f;
			return this
		},
		ih: function(a, b, c, d) {
			var f = this;
			this.a(a, b, function h(k) {
				f.u(a, b, h);
				return c.call(d || a, k || window.event, b)
			}, d)
		},
		u: function(a, b, c) {
			c = e.k.Ya(c);
			var d = b + c,
				f = a[d];
			e.f.Rq && "mousewheel" === b && (b = "DOMMouseScroll");
			!e.f.le || "mouseover" !== b && "mouseout" !== b || (b = "mouseover" === b ? "mouseenter" : "mouseleave");
			e.f.Nr && -1 < b.indexOf("touch") ? this.LA(a, b, c) : e.f.Z && "dblclick" === b && this.KA ? this.KA(a, c) : "removeEventListener" in a ? a.removeEventListener(b, f, !1) : "detachEvent" in a && -1 === b.indexOf("touch") ?
				f && a.detachEvent("on" + b, f) : a["on" + b] = null;
			a[d] = null;
			return this
		},
		ME: function(a, b) {
			var c = document.createEvent("MouseEvents");
			c.initMouseEvent(a, !0, !0, window, 1, b.screenX, b.screenY, b.clientX, b.clientY, !1, !1, !1, !1, 0, null);
			b.target.dispatchEvent(c)
		},
		stopPropagation: function(a) {
			a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0;
			return this
		},
		preventDefault: function(a) {
			a.preventDefault ? a.preventDefault() : a.returnValue = !1;
			return this
		},
		stop: function(a) {
			return e.l.preventDefault(a).stopPropagation(a)
		},
		dD: function(a) {
			for (var b = e.l.stopPropagation, c = e.wt.Ot.length - 1; 0 <= c; c -= 1) e.l.a(a, e.wt.Ot[c], b);
			return e.l.a(a, "click", b).a(a, "dblclick", b)
		},
		Mc: function(a, b) {
			var c = document.body,
				d = document.documentElement,
				c = new e.F(e.f.Z ? a.pageX : a.clientX + (c.scrollLeft || d.scrollLeft), e.f.Z ? a.pageY : a.clientY + (c.scrollTop || d.scrollTop));
			return b ? c.qa(e.d.$y(b)) : c
		},
		Cr: function(a) {
			return 1 === a.which || 0 === a.button || 1 === a.button
		}
	};
	e.extend(e.l, {
		pl: [],
		Zo: !1,
		ox: function(a, b, c, d) {
			switch (b) {
				case "touchstart":
					return this.rx(a, b, c, d);
				case "touchend":
					return this.px(a, b, c, d);
				case "touchmove":
					return this.qx(a, b, c, d);
				default:
					throw "Unknown touch event type";
			}
		},
		rx: function(a, b, c, d) {
			function f(a) {
				for (var b = !1, d = 0; d < g.length; d += 1)
					if (g[d].pointerId === a.pointerId) {
						b = !0;
						break
					}
				b || g.push(a);
				a.touches = g.slice();
				a.changedTouches = [a];
				c(a)
			}
			var g = this.pl;
			a["_amap_touchstart" + d] = f;
			a.addEventListener("MSPointerDown", f, !1);
			this.Zo || (a = function(a) {
				for (var b =
					0; b < g.length; b += 1)
					if (g[b].pointerId === a.pointerId) {
						g.splice(b, 1);
						break
					}
			}, document.documentElement.addEventListener("MSPointerUp", a, !1), document.documentElement.addEventListener("MSPointerCancel", a, !1), this.Zo = !0);
			return this
		},
		qx: function(a, b, c, d) {
			function f(a) {
				if (a.pointerType !== a.MSPOINTER_TYPE_MOUSE || 0 !== a.buttons) {
					for (var b = 0; b < g.length; b += 1)
						if (g[b].pointerId === a.pointerId) {
							g[b] = a;
							break
						}
					a.touches = g.slice();
					a.changedTouches = [a];
					c(a)
				}
			}
			var g = this.pl;
			a["_amap_touchmove" + d] = f;
			a.addEventListener("MSPointerMove",
				f, !1);
			return this
		},
		px: function(a, b, c, d) {
			function f(a) {
				for (var b = 0; b < g.length; b += 1)
					if (g[b].pointerId === a.pointerId) {
						g.splice(b, 1);
						break
					}
				a.touches = g.slice();
				a.changedTouches = [a];
				c(a)
			}
			var g = this.pl;
			a["_amap_touchend" + d] = f;
			a.addEventListener("MSPointerUp", f, !1);
			a.addEventListener("MSPointerCancel", f, !1);
			return this
		},
		LA: function(a, b, c) {
			c = a["_amap_" + b + c];
			switch (b) {
				case "touchstart":
					a.removeEventListener("MSPointerDown", c, !1);
					break;
				case "touchmove":
					a.removeEventListener("MSPointerMove", c, !1);
					break;
				case "touchend":
					a.removeEventListener("MSPointerUp",
						c, !1), a.removeEventListener("MSPointerCancel", c, !1)
			}
			return this
		}
	});
	e.Dn = {
		dy: Math.PI / 180,
		DA: 180 / Math.PI
	};
	e.o = {
		localStorage: !0,
		vk: "1.3.2!!",
		key: "",
		Jc: "http",
		kq: [116.011934, 39.661271, 116.782984, 40.216496],
		Ab: "http://restapi.amap.com",
		ga: "http://webapi.amap.com",
		Uj: "http://webrd0{1,2,3,4}.is.autonavi.com/appmaptile?lang=[lang]&size=1&scale=1&style=8&x=[x]&y=[y]&z=[z]",
		gn: "http://webst0{1,2,3,4}.is.autonavi.com/appmaptile?style=6&x=[x]&y=[y]&z=[z]",
		en: "http://webst0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&lang=zh_cn&size=1&scale=1&style=8",
		tk: "http://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?lang=[lang]&size=1&style=7&x=[x]&y=[y]&z=[z]",
		te: "http://vector.amap.com",
		jE: "../dist/theme/"
	};

	function ba(a) {
		e.o.ga = a[2].split(",")[0];
		e.o.Jc = e.o.ga.split(":")[0];
		"https" === e.o.Jc && (e.o.Ab = e.o.Ab.replace("http", "https"), e.o.Uj = e.o.Uj.replace("http", "https"), e.o.gn = e.o.gn.replace("http", "https"), e.o.en = e.o.en.replace("http", "https"), e.o.tk = e.o.tk.replace("http", "https"), e.o.te = e.o.te.replace("http", "https"));
		e.o.mode = Number(a[3]);
		e.o.kq = a[1];
		e.o.key = a[0];
		e.o.version = a[4];
		e.o.Zh = a[5]
	}
	window.v2 && window.v2.__load__ && window.v2.__load__(ba);
	"undefined" !== typeof module && (module.Jd = e.o);
	(function() {
		var a = !!window.ActiveXObject,
			b = a && !window.XMLHttpRequest,
			c = a && !document.querySelector,
			d = a && !document.addEventListener,
			f = navigator.userAgent.toLowerCase(),
			g = a && -1 !== f.indexOf("ie 9"),
			h = -1 !== f.indexOf("webkit"),
			k = -1 !== f.indexOf("chrome"),
			l = -1 !== f.indexOf("firefox"),
			m = -1 !== f.indexOf("android"),
			n = -1 !== f.indexOf("windows nt") && -1 === f.indexOf("windows nt 6.1"),
			p = -1 !== f.search("android [23]"),
			q = -1 !== f.indexOf("windows phone"),
			f = "undefined" !== typeof orientation,
			r = window.navigator && window.navigator.msPointerEnabled &&
			window.navigator.msMaxTouchPoints,
			s = "devicePixelRatio" in window && 1 < window.devicePixelRatio || "matchMedia" in window && window.matchMedia("(min-resolution:144dpi)") && window.matchMedia("(min-resolution:144dpi)").matches,
			t = document.documentElement,
			x = a && "transition" in t.style,
			v = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
			w = !!document.createElement("canvas").getContext,
			y = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix,
			u = "MozPerspective" in
			t.style,
			z = "OTransition" in t.style,
			F = x || y || u || z,
			f = f || q,
			E;
		try {
			E = "undefined" !== typeof window.localStorage
		} catch (I) {
			E = !1
		}
		var n = !w || g || m || n && l,
			ia = function() {
				if (r && q || "ontouchstart" in t) return !0;
				var a = document.createElement("div"),
					b = !1;
				if (!a.setAttribute) return !1;
				a.setAttribute("ontouchstart", "return;");
				"function" === typeof a.ontouchstart && (b = !0);
				a.removeAttribute("ontouchstart");
				return b
			}();
		e.f = {
			le: a,
			oc: b,
			ki: c,
			dc: d,
			UB: h,
			Im: E,
			bq: m,
			OC: p,
			chrome: k,
			Rq: l,
			LD: x,
			VB: y,
			mD: u,
			hE: z,
			ux: F,
			Da: f,
			eE: f && h,
			Oz: f && y,
			dE: f && window.opera,
			Z: ia,
			Nr: r,
			MD: g,
			hc: s,
			Me: v,
			zr: w,
			fA: n,
			Cx: !n && !f && w && !a,
			es: !v && f && w
		}
	})();
	e.$ = {
		Pz: e.o.ga + "/maps",
		Fq: {
			overlay: ["style"],
			"AMap.MouseTool": ["AMap.RangingTool", "AMap.AutoPanby"],
			CloudDataLayer: ["CloudDataSearch", "UTFGrid"]
		},
		Jm: 0,
		vi: [],
		ag: {},
		Tj: function(a, b) {
			function c() {
				d += 1;
				d === f.length && b()
			}
			for (var d = 0, f = [], g = 0; g < a.length; g += 1) {
				var h = this.Fq[a[g]];
				if (h)
					for (var k = 0; k < h.length; k += 1) f.push(h[k]);
				f.push(a[g])
			}
			for (g = 0; g < f.length; g += 1) this.hm(f[g], c)
		},
		hm: function(a, b) {
			var c = this.Zl(a);
			if (1 === c.status) b();
			else {
				c.Ej.push(b);
				try {
					if (e.f.Im && window.localStorage) {
						var d = window.localStorage["_AMap_" +
							a];
						d && (d = JSON.parse(d), d.version === e.o.vk ? window._jsload_(a, d.script, !0) : window.localStorage.removeItem("_AMap_" + a))
					}
				} catch (f) {}
				if (0 === c.status) {
					this.CA(a);
					var g = this;
					g.Jm || (g.Jm = 1, window.setTimeout(function() {
						g.Jm = 0;
						var a = g.Pz + "/modules?v=" + e.o.version + "&key=" + e.o.key + "&m=" + g.vi.join(",");
						g.vi = [];
						c.lk = g.Fz(a)
					}, 1));
					c.status = -1
				}
			}
		},
		load: function(a, b) {
			var c = this.Fq[a];
			if (c) {
				for (var d = [], f = 0; f < c.length; f += 1) d.push(c[f]);
				d.push(a);
				for (var g = 0, c = function() {
					g += 1;
					g === d.length && b()
				}, f = 0; f < d.length; f += 1) this.hm(d[f],
					c)
			} else this.hm(a, b)
		},
		CA: function(a) {
			for (var b = 0; b < this.vi.length; b += 1)
				if (this.vi[b] === a) return;
			this.vi.push(a)
		},
		vf: function(a, b) {
			var c = this.Zl(a);
			try {
				eval(b)
			} catch (d) {
				return
			}
			c.status = 1;
			for (var f = 0, g = c.Ej.length; f < g; f += 1) c.Ej[f]();
			c.Ej = []
		},
		UC: function(a, b) {
			var c = this;
			c.timeout = setTimeout(function() {
				1 !== c.ag[a].status ? (c.remove(a), c.load(a, b)) : clearTimeout(c.timeout)
			}, 5E3)
		},
		Zl: function(a) {
			this.ag[a] || (this.ag[a] = {}, this.ag[a].status = 0, this.ag[a].Ej = []);
			return this.ag[a]
		},
		remove: function(a) {
			delete this.ag[a]
		},
		Fz: function(a) {
			e.o.mode && (a += "&mode=" + e.o.mode);
			var b = document.createElement("script");
			b.charset = "utf-8";
			b.src = a;
			document.body.appendChild(b);
			return b
		}
	};
	window._jsload_ = function(a, b, c) {
		var d = e.$.Zl(a);
		d.lk && e.k.indexOf(document.body.childNodes, d.lk) && document.body.removeChild(d.lk);
		delete d.lk;
		try {
			!c && window.localStorage && b && "" !== b && e.f.Im && window.localStorage.setItem("_AMap_" + a, JSON.stringify({
				script: b,
				version: e.o.vk
			}))
		} catch (f) {}

		e.$.vf(a, b)
	};
	// zk add layers
	// (function() {
		var c = e.$.Zl('layers');
		e.H = {};
e.H.ve = e.J.extend({
	Ua: [e.ba, e.$b],
	j: function(a, b) {
		this.Sg = a;
		this.sb = [3, 18];
		this.fo = e.k.Ya(this);
		a && this.lc(["opacity", "visible", "zIndex", "zooms"], a);
		this.g = b;
		this.C("display", b)
	},
	O: function(a, b) {
		this.Sg.q(a, b)
	},
	visibleChanged: function() {
		this.set("display", 0)
	},
	zIndexChanged: function() {
		this.set("display", 0)
	},
	Fs: function(a) {console.log('Fs',a,this.opacity);
		if ("opacity" in a.style) e.d.oh(a, this.opacity);
		else
			for (var b = 0; b < a.childNodes.length; b += 1) e.d.oh(a.childNodes[b], this.opacity)
	},
	opacityChanged: function() {console.log('opacityChanged',this.get("opacity"));
		var a = this.get("opacity");
		if(!a && a != 0){
			a = 1;
		}
		this.opacity = Math.min(Math.max(0, a), 1);console.log('opacityChanged this.opacity',this.get("opacity"),this.get);
		if (a = this.va)
			if (a.length)
				for (var b = 0; b < a.length; b += 1) this.Fs(a[b]);
			else this.Fs(a)
	},
	mm: function() {
		var a = this.get("bounds");
		if (a) {
			if (a instanceof e.Kb) {
				var b = a.ei(),
					c = a.fi(),
					d = this.g.ha(new e.t(180, 0)).x,
					f = this.g.ha(b),
					g = this.g.ha(c),
					h = this.g.get("center");
				b.A > c.A ? 0 < h.A ? g.x += d : f.x -= d : 0 < h.A ? (0 > b.A && (f.x += d), 0 > c.A && (g.x += d)) : (0 < b.A && (f.x -= d), 0 < c.A && (g.x -= d));
				this.e = [f.x, f.y, g.x, g.y]
			}
			a instanceof e.Bh && (this.e = [a.za.x, a.za.y, a.Wa.x, a.Wa.y]);
			return this.e
		}
		return null
	}
});

function V(a, b, c) {
	this.z = a;
	this.x = b;
	this.y = c
}
V.prototype.Pa = function() {
	return new V(this.z, this.x, this.y)
};
V.prototype.toString = function() {
	return [this.z, this.x, this.y].join("/")
};
e.Cf = function(a, b) {
	this.na = a;
	this.key = a.toString();
	this.url = b
};
e.zh = V;
e.H.Cf = e.H.ve.extend({
	j: function(a, b) {
		arguments.callee.ra.apply(this, arguments);
		this.C("tileSize", a);
		this.C("tiles", a);
		this.lc(["zooms", "type", "detectRetina", "tileFun", "errorUrl"], a);
		this.C("lang", b);
		var c = "overlayer" === a.get("type");
		this.Ad = !c && !e.f.Da;
		e.f.dc && (this.Ad = !1);
		var d = b.get("size"),
			d = d.width * d.height / 65536;
		e.f.hc && 9 < d && (this.Ad = !1);
		this.Be = !c;
		this.Ce = !c;
		this.C("reload", a)
	},
	langChanged: function() {
		this.set("reload")
	},
	reloadChanged: function() {
		this.set("display", 0)
	},
	tileFunChanged: function() {
		this.set("display", 0)
	},
	gg: function() {
		return {
			Na: this.get("tileSize"),
			visible: this.get("visible"),
			e: this.mm(),
			sb: this.get("zooms"),
			yj: this.Ad,
			Be: this.Be,
			Ce: this.Ce,
			opacity: this.get("opacity") || 1,
			lf: this.get("tileFun"),
			hc: this.get("detectRetina") && e.f.hc && e.f.Da
		}
	}
});
e.H.ub = e.H.ve.extend({
	j: function(a, b) {
		this.map = b;
		this.vg = 0;
		this.Ke = !1;
		this.Re = this.Qe = 0;
		this.gh = [];
		arguments.callee.ra.apply(this, arguments);
		a && (this.C("dataSources", a), this.C("style", a));
		this.C("display", b);
		this.rf = [];
		this.Jb = new e.H.Pi
	},
	gg: function() {
		return {
			visible: this.get("visible"),
			sb: this.get("zooms"),
			opacity: this.get("opacity"),
			zIndex: this.get("zIndex")
		}
	},
	dataSourcesChanged: function() {
		this.rA(this.get("dataSources"))
	},
	styleChanged: function() {
		this.set("display", 0)
	},
	rA: function(a) {
		if (a)
			for (var b, c = {}, d = 0, f = a.length; d < f; d += 1) {
				c = a[d];
				b = c.type;
				var g = c.zE,
					c = c.url;
				if (!c || !b) break;
				c && b && !this.eb && (this.eb = {}, this.eb[c] || this.Rw(c, b, g))
			}
	},
	Zq: function(a) {
		if ("geojson" === a) return new e.En({
			map: this.map
		});
		if ("topjson" === a) return new e.Vt({
			map: this.map
		});
		if ("subway" === a) return new e.Tt({
			map: this.map
		})
	},
	vA: function(a) {
		if (a) {
			var b = [],
				b = [],
				c = {};
			if (a.rules) {
				for (var b = a.rules, d = 0, f = b.length; d < f; d += 1) {
					for (var g = [], h = b[d].symbolizers, k = 0, l = h.length; k < l; k += 1) h[k].fill && (g[k] = new e.style.Ra.Ak(h[k].fill)), h[k].stroke && (g[k] = new e.style.Ra.Cg(h[k].stroke));
					h = g;
					b[d].rg = h;
					b[d] = new e.style.Nt(b[d])
				}
				c.rules = b
			}
			if (a.symbolizers) {
				b = a.symbolizers;
				a = 0;
				for (d = b.length; a < d; a += 1) b[a].fill && (b[a] = new e.style.Ra.Ak(b[a].fill)), b[a].stroke && (b[a] = new e.style.Ra.Cg(b[a].stroke));
				c.rg = b
			}
			a = new e.Kk(c)
		} else a = new e.Kk({});
		this.set("style", a);
		return a
	},
	Rw: function(a, b) {
		var c = this;
		e.$.load("http", function() {
			if (-1 === e.k.indexOf(a, e.o.ga)) {
				var d = new e.T.ca(a);
				d.a("complete", function(c) {
					c = this.eb[a] = this.Zq(b).xi(c);
					this.Uf(c);
					this.O("complete")
				}, c);
				d.a("error", c.ea, c)
			} else(new e.T.XMLHttpRequest(a)).a("complete", function(c) {
				c = eval("(" + c.data + ")");
				c = this.eb[a] = this.Zq(b).xi(c);
				this.Uf(c)
			}, c)
		})
	},
	EA: function(a) {
		a.ck > this.Pe && (this.Pe = a.ck)
	},
	Uf: function(a) {
		this.Ke = !0;
		for (var b, c, d, f = 0, g = a.length; f < g; f += 1) {
			b = a[f];
			this.Jb.add(b);
			if (!this.Wg) {
				c = this.Vq(b);
				for (var h = 0; h < c.length; h += 1)
					if (d = c[h], d instanceof e.style.wa.Wd && (b.a("rad", this.EA, this), this.Pe || (this.Pe = b.get("radius")), b.ck > this.Pe && (this.Pe = b.get("radius"))), d = b.get("strokeWeight") || 0, !this.Wj || d > this.Wj) this.Wj = d
			}
			this.Wg || this.rf.push(b);
			b.C("feature", this, !0)
		}
	},
	clear: function() {
		this.Ke = !0;
		this.Jb.clear();
		this.dispatchEvent(new e.H.nC(e.H.oC.iC, [], []))
	},
	pd: function(a) {
		return this.Jb.pd(a)
	},
	Vq: function(a) {
		var b, c = this.get("style"),
			d = a.Kc;
		c instanceof e.Kk || (c = this.vA(c));
		if (d && 0 < d.length) b = c.Aq(d, a);
		else {
			if (c.Ds.length || c.Kc.length) b = c.Zx(a);
			b || (b = a.Cy())
		}
		return b
	},
	bz: function(a) {
		function b(a, b) {
			return a.Lj - b.Lj
		}
		var c = [],
			d, f, g, h, k, l = {};
		for (d in a)
			if (a.hasOwnProperty(d)) {
				g = a[d];
				h = g.get("zIndex");
				for (f in l)
					if (l.hasOwnProperty(f) && (k = c[l[f]][2], k === h)) break;
					"undefined" === typeof l[h] && (c.push([
					[],
					[], h
				]), l[h] = c.length - 1);
				h = c[l[h]];
				h[0].push(g)
			}
		c.sort(this.tB);
		a = 0;
		for (d = c.length; a < d; a += 1) c[a][0].sort(b);
		return c
	},
	az: function(a) {
		var b = {},
			c = [],
			d, f, g, h, k, l, m, n;
		for (d in a)
			if (a.hasOwnProperty(d))
				for (h = a[d], m = this.Vq(h), k = m.length, f = 0; f < k; f += 1) {
					n = m[f];
					for (g in b)
						if (b.hasOwnProperty(g) && (l = c[b[g]][1], n.constructor === l.constructor && n.Fa(l))) {
							n = l;
							break
						}
					l = e.k.Ya(n);
					"undefined" === typeof b[l] && (c.push([
						[], n, []
					]), b[l] = c.length - 1);
					n = c[b[l]];
					n[0][n[0].length] = h
				}
			c.sort(this.uB);
		return c
	},
	featureChanged: function(a) {
		this.Ke = !0;
		var b = a.target,
			c = b.P;
		0 !== this.Jb.Fy([e.k.Ya(b)]).length && (this.Jb.remove(b, a.mg), c && !a.ey && this.Jb.add(b))
	},
	xs: function(a) {
		this.Ke = !0;
		for (var b, c = 0, d = a.length; c < d; c += 1) b = a[c], b.P.mg = null, b.jf(!0), b.gt("feature")
	},
	uB: function(a, b) {
		return a[1].zIndex === b[1].zIndex ? e.k.Ya(a[1]) - e.k.Ya(b[1]) : a[1].zIndex - b[1].zIndex
	},
	tB: function(a, b) {
		return a[2] - b[2]
	},
	FE: function(a) {
		return a.AD() === e.H.pC.jC
	}
});
e.H.Pi = e.J.extend({
	j: function() {
		this.clear()
	},
	clear: function() {
		this.ig = [];
		this.Ym = new e.fd
	},
	add: function(a) {
		var b = e.k.Ya(a),
			c = a.P;
		this.ig[b] || (this.count += 1, this.ig[b] = a, c && !e.e.Fa(c.wb(), [Infinity, Infinity, -Infinity, -Infinity]) && this.Ym.pz(c.wb(), a))
	},
	vD: function() {
		return this.ig
	},
	pd: function(a) {
		return this.Ym.hB(a)
	},
	Fy: function(a) {
		var b = a.length,
			c = [],
			d;
		for (d = 0; d < b; d += 1) this.ig[a[d]] && c.push(this.ig[a[d]]);
		return c
	},
	remove: function(a, b) {
		var c = e.k.Ya(a).toString(),
			d = a.P;
		this.ig[c] && (delete this.ig[c], d && (c = "undefined" !== typeof b ? b : d.wb(), this.Ym.remove(c, a)))
	}
});

function ma(a, b, c) {
	this.url = a;
	this.Zh = b;
	this.Sq = c;
	this.md = this.ik = !1
}

function W(a, b) {
	var c = X;
	return function() {
		return c.call(this, a, b)
	}
}

function X(a, b) {
	if (!a.md) {
		a.kD = +new Date;
		a.loaded = b;
		clearTimeout(a.EB);
		var c = a.Ir;
		c.Od.remove(a.url) && c.hv();
		c = a.Br ? a.eb : a.ta;
		a.eb = null;
		a.md || !b && !a.Sq || a.Zh(b ? c : null, a);
		a.of ? (a.of.$h(), a.of = null) : c && (c.onload = null, c.onerror = null, c.onabort = null, a.ta = null)
	}
}
e.Fn = e.J.extend({
	vC: "assets/image/blank.gif",
	j: function(a, b, c) {
		this.timeout = b || 15E3;
		this.pg = new e.xe(1024);
		this.Od = new e.xe(1024);
		this.yq = a;
		this.Kj = c
	},
	uo: function(a) {
		a && this.Od.count >= this.yq && (a = this.Od.Mb.pa.value, a.md && (this.Od.remove(a.url), this.lo(a)));
		for (; this.pg.count && !(this.Od.count >= this.yq);) this.Eu(this.pg.shift())
	},
	hv: function() {
		if (!this.vo) {
			this.vo = !0;
			var a = this;
			setTimeout(function() {
				a.vo = !1;
				a.uo()
			}, 0)
		}
	},
	Eu: function(a) {
		if (a.Br) {
			var b = this;
			a.of || e.$.load("http", function() {
				if (!b.Od.get(a.url)) {
					var c = new e.T.ca(a.url, {
						callback: "callback",
						fun: "vt" + a.key
					});
					c.a("complete", function(b) {
						a.eb = b;
						X(a, !0)
					}, b);
					c.a("error", function() {
						X(a, !1)
					}, b);
					a.of = c;
					a.Ir = b;
					b.Od.set(a.url, a)
				}
			})
		} else {
			var c = document.createElement("img");
			c.src = a.url;
			a.ta = c;
			a.Ir = this;
			a.startTime = +new Date;
			a.ik = !0;
			c.complete ? X(a, !0) : (this.Od.set(a.url, a), c.onload = W(a, !0), c.onerror = W(a, !1), c.onabort = W(a, !1), a.EB = setTimeout(W(a, !1), this.timeout))
		}
	},
	lo: function(a) {
		if (a.ik) {
			var b = a.ta;
			X(a, !1);
			b.src = this.Kj ? this.Kj : e.k.Jq;
			a.md = !0;
			a.KC = !0
		}
	},
	Ez: function(a, b, c) {
		return this.Gr(a.url, b, c, !0, a.na.z + "_" + a.na.x + "_" + a.na.y)
	},
	Gr: function(a, b, c, d, f) {
		var g = this.Od.get(a);
		if (g && g.md) g.md = !1, g.Zh = b, g.Sq = c;
		else {
			g = new ma(a, b, c);
			g.Br = d;
			g.key = f;
			if (this.pg.get(e.k.Ya(g))) return;
			this.pg.set(e.k.Ya(g), g);
			this.uo(!0)
		}
		return g
	},
	TC: function(a) {
		a.md || (a.md = !0, this.pg.remove(e.k.Ya(a)))
	},
	clear: function(a) {
		this.pg.forEach(function(a) {
			a.md = !0
		});
		this.pg.clear();
		if (a)
			for (; a = this.Od.pop();) this.lo(a);
		else this.Od.forEach(function(a) {
			a.md = !0
		})
	}
});
var na = function() {
	function a(a) {
		this.Nk[e.k.Ya(a)] = a;
		return this
	}

	function b(a) {
		delete this.Nk[e.k.Ya(a)];
		return this
	}
	return function() {
		function c() {
			var a = c.Nk,
				b, g = [],
				h;
			for (h in a) Object.prototype.hasOwnProperty.call(a, h) && g.push(a[h]);
			for (a = g.length - 1; 0 <= a; a -= 1) h = g[a].apply(this, arguments), void 0 !== h && (b = h);
			return b
		}
		c.Nk = {};
		c.LC = a;
		c.vE = b;
		return c
	}
}();
e.xe = e.J.extend({
	j: function(a, b) {
		this.If = a | 0;
		this.Uk = !!b;
		this.count = 0;
		this.$z = na();
		this.clear()
	},
	Bm: function() {
		return !this.count
	},
	OD: function() {
		return this.count >= this.If
	},
	IE: function(a) {
		this.If !== a && (this.If = a | 0) && this.Qp(this.If)
	},
	get: function(a, b) {
		var c = this.Fo(a);
		return c ? c.value : b
	},
	set: function(a, b) {
		var c = this.Fo(a);
		c ? c.value = b : (c = new e.xe.Ah(a, b), this.g[a] = c, this.Po(c), this.count += 1)
	},
	remove: function(a) {
		return Object.prototype.hasOwnProperty.call(this.g, a) ? (this.Ph(this.g[a]), !0) : !1
	},
	forEach: function(a, b) {
		for (var c = this.Mb.next; c !== this.Mb; c = c.next) a.call(b, c.value, c.key, this)
	},
	ui: function(a, b) {
		return Object.prototype.hasOwnProperty.call(this.g, a) ? this.g[a].value : b
	},
	lE: function() {
		return this.Mb.next.value
	},
	mE: function() {
		return this.Mb.pa.value
	},
	shift: function() {
		return this.wp(this.Mb.next)
	},
	pop: function() {
		return this.wp(this.Mb.pa)
	},
	Fo: function(a) {
		if (Object.prototype.hasOwnProperty.call(this.g, a)) return a = this.g[a], this.Uk && (a.remove(), this.Po(a)), a
	},
	Po: function(a) {
		this.Uk ? (a.next = this.Mb.next, a.pa = this.Mb, this.Mb.next = a, a.next.pa = a) : (a.pa = this.Mb.pa, a.next = this.Mb, this.Mb.pa = a, a.pa.next = a);
		this.If && this.Qp(this.If)
	},
	Qp: function(a) {
		for (var b = this.count; b > a; b -= 1) {
			var c = this.Uk ? this.Mb.pa : this.Mb.next;
			this.Ph(c);
			this.$z(c.value)
		}
	},
	Ph: function(a) {
		a.remove();
		delete this.g[a.key];
		this.count -= 1
	},
	wp: function(a) {
		this.Mb !== a && this.Ph(a);
		return a.value
	},
	clear: function() {
		this.g = {};
		this.Mb = new e.xe.Ah("", null);
		this.Mb.pa = this.Mb.next = this.Mb;
		this.count = 0
	}
});
e.xe.Ah = function(a, b) {
	this.key = a;
	this.value = b
};
e.xe.Ah.prototype.pa = null;
e.xe.Ah.prototype.next = null;
e.xe.Ah.prototype.remove = function() {
	this.pa.next = this.next;
	this.next.pa = this.pa;
	this.next = this.pa = null
};
e.Dt = e.J.extend({
	Ua: [e.ba],
	j: function(a) {
		this.Dg = e.extend({
			size: 120,
			Qs: 0.7,
			Nq: 2,
			Ps: 300
		}, a);
		this.zd = {};
		this.Ae = 0;
		this.Rk = this.Dg.size
	},
	lu: function(a) {
		return {
			Ki: a,
			Pl: e.k.gi(),
			xj: 0
		}
	},
	get: function(a, b) {
		if (!this.Wb(a)) return b;
		var c = this.zd[a];
		c.Pl = e.k.gi();
		c.xj += 1;
		return c.Ki
	},
	ui: function(a, b) {
		return this.get(a, b)
	},
	set: function(a, b) {
		this.Wb(a) ? this.zd[a].Ki = b : (this.Ae += 1, this.zd[a] = this.lu(b));
		this.Ae > this.Rk && this.mu()
	},
	Wb: function(a) {
		return this.zd.hasOwnProperty(a)
	},
	MB: function(a) {
		if (!this.Wb(a)) return null;
		this.Ae -= 1;
		var b = this.zd[a];
		delete this.zd[a];
		return b.Ki
	},
	clear: function() {
		this.Ok();
		this.zd = {};
		this.Ae = 0
	},
	Ok: function() {
		this.Sk && clearTimeout(this.Sk)
	},
	mu: function() {
		if (this.Ae > this.Rk * this.Dg.Nq) this.Ok(), this.jo();
		else if (!(10 > e.k.gi() - this.nu)) {
			this.Ok();
			var a = this;
			this.Sk = setTimeout(function() {
				a.Sk = null;
				a.jo()
			}, this.Dg.Ps);
			this.nu = e.k.gi()
		}
	},
	jo: function() {
		var a = Math.round(this.Rk * this.Dg.Qs);
		if (!(this.Ae < a))
			for (var a = this.gu(this.Ae - a), b, c, d = 0, f = a.length; d < f; d += 1) b = a[d], c = this.MB(b), this.q("drop", {
				key: b,
				Ki: c
			})
	},
	du: function(a, b) {
		var c = this.zd[a],
			d = this.zd[b],
			f = c.Pl - d.Pl;
		return 0 !== f ? f : c.xj - d.xj
	},
	gu: function(a) {
		var b = [],
			c;
		for (c in this.zd) this.zd.hasOwnProperty(c) && b.push(c);
		return this.hu(b, a, this.du)
	},
	hu: function(a, b, c) {
		if (0 >= b) return [];
		for (var d = 0, f = a.length - 1, g, h, k; d < f;) {
			g = d;
			h = f;
			for (k = a[b]; g <= b && h >= b;) {
				for (; g <= b && 0 > c.call(this, a[g], k);) g += 1;
				for (; h >= b && 0 < c.call(this, a[h], k);) h -= 1;
				var l = a[g];
				a[g] = a[h];
				a[h] = l;
				g += 1;
				h -= 1
			}
			h < b && (d = g);
			g > b && (f = h)
		}
		return a.slice(0, b)
	}
});
e.fd = e.J.extend({
	j: function(a) {
		this.Lr = "undefined" !== typeof a ? a : 6;
		this.Xj = Math.floor(this.Lr / 2);
		this.jk = {
			e: [Infinity, Infinity, -Infinity, -Infinity],
			S: []
		};
		this.count = 0
	},
	Kx: function(a, b) {
		var c = -1,
			d = [],
			f;
		d.push(b);
		var g = b.S;
		do {
			-1 !== c && (d.push(g[c]), g = g[c].S, c = -1);
			for (var h = g.length - 1; 0 <= h; h -= 1) {
				var k = g[h];
				if ("undefined" !== typeof k.kg) {
					c = -1;
					break
				}
				var l = e.fd.rh(k.e[2] - k.e[0], k.e[3] - k.e[1], k.S.length + 1),
					k = e.fd.rh((k.e[2] > a.e[2] ? k.e[2] : a.e[2]) - (k.e[0] < a.e[0] ? k.e[0] : a.e[0]), (k.e[3] > a.e[3] ? k.e[3] : a.e[3]) - (k.e[1] < a.e[1] ? k.e[1] : a.e[1]), k.S.length + 2);
				if (0 > c || Math.abs(k - l) < f) f = Math.abs(k - l), c = h
			}
		} while (-1 !== c);
		return d
	},
	pz: function(a, b, c) {
		a = {
			e: a,
			kg: b
		};
		"undefined" !== typeof c && (a.type = c);
		this.yr(a, this.jk);
		this.count += 1
	},
	yr: function(a, b) {
		var c;
		if (0 === b.S.length) b.e = e.e.Pa(a.e), b.S.push(a);
		else {
			var d = this.Kx(a, b),
				f = a;
			do {
				if (c && "undefined" !== typeof c.S && 0 === c.S.length) {
					var g = c;
					c = d.pop();
					for (var h = 0, k = c.S.length; h < k; h += 1)
						if (c.S[h] === g || 0 === c.S[h].S.length) {
							c.S.splice(h, 1);
							break
						}
				} else c = d.pop();
				g = f instanceof Array;
				if ("undefined" !== typeof f.kg || "undefined" !== typeof f.S || g) {
					if (g) {
						g = 0;
						for (h = f.length; g < h; g += 1) e.e.extend(c.e, f[g].e);
						c.S = c.S.concat(f)
					} else e.e.extend(c.e, f.e), c.S.push(f);
					c.S.length <= this.Lr ? f = {
						e: e.e.Pa(c.e)
					} : (f = g = this.Bz(c.S), 1 > d.length && (c.S.push(g[0]), d.push(c), f = g[1]))
				} else e.e.extend(c.e, f.e), f = {
					e: e.e.Pa(c.e)
				}
			} while (0 < d.length)
		}
	},
	Bz: function(a) {
		for (var b = this.wA(a); 0 < a.length;) this.xA(a, b[0], b[1]);
		return b
	},
	wA: function(a) {
		for (var b = a.length - 1, c = 0, d = a.length - 1, f = 0, g = a.length - 2; 0 <= g; g -= 1) {
			var h = a[g];
			h.e[0] > a[c].e[0] ? c = g : h.e[2] < a[b].e[1] && (b = g);
			h.e[1] > a[f].e[1] ? f = g : h.e[3] < a[d].e[3] && (d = g)
		}
		Math.abs(a[b].e[2] - a[c].e[0]) > Math.abs(a[d].e[3] - a[f].e[1]) ? b > c ? (b = a.splice(b, 1)[0], c = a.splice(c, 1)[0]) : (c = a.splice(c, 1)[0], b = a.splice(b, 1)[0]) : d > f ? (b = a.splice(d, 1)[0], c = a.splice(f, 1)[0]) : (c = a.splice(f, 1)[0], b = a.splice(d, 1)[0]);
		return [{
			e: e.e.Pa(b.e),
			S: [b]
		}, {
			e: e.e.Pa(c.e),
			S: [c]
		}]
	},
	xA: function(a, b, c) {
		for (var d = e.fd.rh(b.e[2] - b.e[0], b.e[3] - b.e[1], b.S.length + 1), f = e.fd.rh(c.e[2] - c.e[0], c.e[3] - c.e[1], c.S.length + 1), g, h, k, l = a.length - 1; 0 <= l; l -= 1) {
			var m = a[l],
				n = [b.e[0] < m.e[0] ? b.e[0] : m.e[0], b.e[2] > m.e[2] ? b.e[2] : m.e[2], b.e[1] < m.e[1] ? b.e[1] : m.e[1], b.e[3] > m.e[3] ? b.e[3] : m.e[3]],
				n = Math.abs(e.fd.rh(n[1] - n[0], n[3] - n[2], b.S.length + 2) - d),
				m = [c.e[0] < m.e[0] ? c.e[0] : m.e[0], c.e[2] > m.e[2] ? c.e[2] : m.e[2], c.e[1] < m.e[1] ? c.e[1] : m.e[1], c.e[3] > m.e[3] ? c.e[3] : m.e[3]],
				m = Math.abs(e.fd.rh(m[1] - m[0], m[3] - m[2], c.S.length + 2) - f),
				p = Math.abs(m - n);
			if (!h || !g || p < g) h = l, g = p, k = m < n ? c : b
		}
		d = a.splice(h, 1)[0];
		b.S.length + a.length + 1 <= this.Xj ? (b.S.push(d), e.e.extend(b.e, d.e)) : c.S.length + a.length + 1 <= this.Xj ? (c.S.push(d), e.e.extend(c.e, d.e)) : (k.S.push(d), e.e.extend(k.e, d.e))
	},
	remove: function(a, b) {
		var c = [];
		c[0] = {
			e: a
		};
		(c[1] = b) || (c[1] = !1);
		c[2] = this.jk;
		this.count -= 1;
		if (!1 === c[1]) {
			var d = 0,
				f = [];
			do d = f.length, f = f.concat(this.As.apply(this, c)); while (d !== f.length);
			return f
		}
		return this.As.apply(this, c)
	},
	As: function(a, b, c) {
		var d = [],
			f = [],
			g = [];
		if (!a || !e.e.Md(a.e, c.e)) return g;
		a = e.e.Pa(a.e);
		var h;
		f.push(c.S.length);
		d.push(c);
		do {
			c = d.pop();
			var k = f.pop() - 1;
			if ("undefined" !== typeof b)
				for (; 0 <= k;) {
					var l = c.S[k];
					if (e.e.Md(a, l.e))
						if (b && "undefined" !== typeof l.kg && l.kg === b || !b && ("undefined" !== typeof l.kg || e.e.zq(a, l.e))) {
							"undefined" !== typeof l.S ? (g = this.nh(l, !0, [], l), c.S.splice(k, 1)) : g = c.S.splice(k, 1);
							e.fd.an(c);
							b = void 0;
							c.S.length < this.Xj && (h = this.nh(c, !0, [], c));
							break
						} else "undefined" !== typeof l.S && (f.push(k), d.push(c), c = l, k = l.S.length);
					k -= 1
				} else if ("undefined" !== typeof h) {
					c.S.splice(k + 1, 1);
					0 < c.S.length && e.fd.an(c);
					k = 0;
					for (l = h.length; k < l; k += 1) this.yr(h[k], c);
					h.length = 0;
					0 === d.length && 1 >= c.S.length ? (h = this.nh(c, !0, h, c), c.S.length = 0, d.push(c), f.push(1)) : 0 < d.length && c.S.length < this.Xj ? (h = this.nh(c, !0, h, c), c.S.length = 0) : h = void 0
				} else e.fd.an(c)
		} while (0 < d.length);
		return g
	},
	search: function(a, b) {
		return this.nh({
			e: a
		}, !1, [], this.jk, b)
	},
	hB: function(a, b) {
		return this.nh({
			e: a
		}, !1, [], this.jk, b, !0)
	},
	nh: function(a, b, c, d, f, g) {
		var h = {},
			k = [];
		if (!e.e.Md(a.e, d.e)) return c;
		k.push(d.S);
		do {
			d = k.pop();
			for (var l = d.length - 1; 0 <= l; l -= 1) {
				var m = d[l];
				if (e.e.Md(a.e, m.e))
					if ("undefined" !== typeof m.S) k.push(m.S);
					else if ("undefined" !== typeof m.kg)
					if (b) c.push(m);
					else if ("undefined" === typeof f || m.type === f) m = m.kg, "undefined" !== typeof g ? h[e.k.Ya(m)] = m : c.push(m)
			}
		} while (0 < k.length);
		return "undefined" !== typeof g ? h : c
	}
});
e.fd.an = function(a) {
	var b = a.S.length,
		c = a.e;
	if (0 === b) e.e.empty(c);
	else {
		var d = a.S[0].e;
		c[0] = d[0];
		c[2] = d[2];
		c[1] = d[1];
		c[3] = d[3];
		for (d = 1; d < b; d += 1) e.e.extend(c, a.S[d].e)
	}
};
e.fd.rh = function(a, b, c) {
	var d = (a + b) / 2;
	a *= b;
	return a * c / (a / (d * d))
};
e.tt = {
	xB: function(a, b) {
		return this.wB(a, this.Tx(a, b))
	},
	wB: function(a, b) {
		var c = a[0] - b[0],
			d = a[1] - b[1];
		return c * c + d * d
	},
	Tx: function(a, b) {
		var c = a[0],
			d = a[1],
			f = b[0],
			g = b[1],
			h = f[0],
			f = f[1],
			k = g[0],
			g = g[1],
			l = k - h,
			m = g - f,
			c = 0 === l && 0 === m ? 0 : (l * (c - h) + m * (d - f)) / (l * l + m * m || 0);
		0 >= c || (1 <= c ? (h = k, f = g) : (h += c * l, f += c * m));
		return [h, f]
	}
};
		c.status = 1;
		for (var f = 0, g = c.Ej.length; f < g; f += 1) c.Ej[f]();
		c.Ej = []
	// })();
	e.t = e.J.extend({
		j: function(a, b, c) {
			var d = parseFloat(b),
				f = parseFloat(a);
			if (isNaN(a) || isNaN(b)) throw "Invalid Object: LngLat(" + f + ", " + d + ")";
			!0 !== c && (d = Math.max(Math.min(d, 90), -90), f = (f + 180) % 360 + (-180 > f || 180 === f ? 180 : -180));
			this.D = d;
			this.A = f
		},
		Ny: function() {
			return e.k.bi(this.A, 6)
		},
		Ly: function() {
			return e.k.bi(this.D, 6)
		},
		add: function(a, b) {
			return new e.t(this.A + a.A, this.D + a.D, b)
		},
		qa: function(a, b) {
			return new e.t(this.A - a.A, this.D - a.D, b)
		},
		Ta: function(a, b) {
			return new e.t(this.A / a, this.D / a, b)
		},
		bb: function(a, b) {
			return new e.t(this.A *
				a, this.D * a, b)
		},
		Fc: function(a) {
			if (!(a instanceof e.t)) return !1;
			var b = Math.PI / 180,
				c = Math.sin((a.D - this.D) * b / 2),
				d = Math.sin((a.A - this.A) * b / 2);
			a = c * c + d * d * Math.cos(this.D * b) * Math.cos(a.D * b);
			return 12756274 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		},
		offset: function(a, b) {
			if (isNaN(a) || isNaN(b)) return !1;
			var c = 2 * Math.asin(Math.sin(Math.round(a) / 12756274) / Math.cos(this.D * Math.PI / 180)),
				c = this.A + 180 * c / Math.PI,
				d = 2 * Math.asin(Math.round(b) / 12756274);
			return new e.t(c, this.D + 180 * d / Math.PI)
		},
		Fa: function(a) {
			return a instanceof
			e.t ? 1E-9 >= Math.max(Math.abs(this.D - a.D), Math.abs(this.A - a.A)) : !1
		},
		toString: function() {
			return e.k.bi(this.A, 6) + "," + e.k.bi(this.D, 6)
		},
		Pa: function() {
			return new e.t(this.A, this.D)
		}
	});
	e.t.Gy = function(a, b, c) {
		c = c + 1 || Math.round(Math.abs(a.A - b.A));
		if (!c || 0.0010 > Math.abs(a.A - b.A)) return [];
		var d = [],
			f = e.Dn.dy,
			g = e.Dn.DA,
			h = Math.asin,
			k = Math.sqrt,
			l = Math.sin,
			m = Math.pow,
			n = Math.cos,
			p = Math.atan2,
			q = a.D * f;
		a = a.A * f;
		var r = b.D * f;
		b = b.A * f;
		for (var h = 2 * h(k(m(l((q - r) / 2), 2) + n(q) * n(r) * m(l((a - b) / 2), 2))), s, t, x, v, f = 1; f < c; f += 1) s = 1 / c * f, t = l((1 - s) * h) / l(h), x = l(s * h) / l(h), s = t * n(q) * n(a) + x * n(r) * n(b), v = t * n(q) * l(a) + x * n(r) * l(b), t = t * l(q) + x * l(r), t = p(t, k(m(s, 2) + m(v, 2))), s = p(v, s), d.push(new e.t(s * g, t * g));
		return d
	};
	e.t.Jd({
		Ny: "getLng",
		Ly: "getLat",
		add: "add",
		qa: "subtract",
		Ta: "divideBy",
		bb: "multiplyBy",
		Fc: "distance",
		offset: "offset",
		Fa: "equals",
		toString: "toString"
	});
	e.Kb = e.J.extend({
		j: function() {
			if (2 === arguments.length) this.Ma = arguments[0], this.La = arguments[1];
			else if (4 === arguments.length) this.Ma = new e.t(arguments[0], arguments[1]), this.La = new e.t(arguments[2], arguments[3]);
			else throw "Invalid Object: Bounds(" + arguments.join(",") + ")";
		},
		$q: function() {
			return this.Ma
		},
		Wq: function() {
			return this.La
		},
		ei: function() {
			return new e.t(this.Ma.A, this.La.D, !0)
		},
		fi: function() {
			return new e.t(this.La.A, this.Ma.D, !0)
		},
		contains: function(a) {
			var b = this.Ma,
				c = this.La,
				d;
			a instanceof e.Kb ?
				(d = a.Ma, a = a.La) : d = a;
			var f = d.A,
				g = b.A,
				h = a.A,
				k = c.A;
			g > k && (k += 360, 0 > f && (f += 360), 0 > h && (h += 360));
			return d.D >= b.D && a.D <= c.D && f >= g && h <= k
		},
		Md: function(a) {
			var b = this.Ma,
				c = this.La,
				d = a.Ma;
			a = a.La;
			var f = a.A >= b.A && d.A <= c.A;
			return a.D >= b.D && d.D <= c.D && f
		},
		ie: function() {
			return new e.t(this.Ma.A > this.La.A ? (this.Ma.A + this.La.A + 360) / 2 % 360 : (this.Ma.A + this.La.A) / 2, (this.Ma.D + this.La.D) / 2)
		},
		extend: function(a) {
			this.Ma.A = Math.min(this.Ma.A, a.A);
			this.Ma.D = Math.min(this.Ma.D, a.D);
			this.La.A = Math.max(this.La.A, a.A);
			this.La.D = Math.max(this.La.D,
				a.D);
			return this
		},
		LB: function(a) {
			return this.extend(a.Ma).extend(a.La)
		},
		toString: function() {
			return this.Ma.toString() + ";" + this.La.toString()
		},
		Pa: function() {
			return new e.Kb(this.Ma.Pa(), this.La.Pa())
		},
		Fa: function(a) {
			return a instanceof e.Kb ? this.Ma.Fa(a.Ma) && this.La.Fa(a.La) : !1
		}
	});
	e.Kb.Jd({
		$q: "getSouthWest",
		Wq: "getNorthEast",
		ei: "getNorthWest",
		fi: "getSouthEast",
		contains: "contains",
		Md: "intersects",
		ie: "getCenter"
	});
	e.F = e.J.extend({
		j: function(a, b, c) {
			if (isNaN(a) || isNaN(b)) throw "Invalid Object: Pixel(" + a + ", " + b + ")";
			this.x = c ? Math.round(a) : Number(a);
			this.y = c ? Math.round(b) : Number(b)
		},
		xb: function() {
			return this.x
		},
		ob: function() {
			return this.y
		},
		add: function(a, b) {
			return new e.F(this.x + a.x, this.y + a.y, b)
		},
		qa: function(a, b) {
			return new e.F(this.x - a.x, this.y - a.y, b)
		},
		Ta: function(a, b) {
			return new e.F(this.x / a, this.y / a, b)
		},
		bb: function(a, b) {
			return new e.F(this.x * a, this.y * a, b)
		},
		Fc: function(a) {
			var b = a.x - this.x;
			a = a.y - this.y;
			return Math.sqrt(b *
				b + a * a)
		},
		floor: function() {
			return new e.F(Math.floor(this.x), Math.floor(this.y))
		},
		round: function() {
			return new e.F(this.x, this.y, !0)
		},
		Fa: function(a) {
			return a instanceof e.F && this.x === a.x && this.y === a.y
		},
		Pa: function() {
			return new e.F(this.x, this.y)
		},
		toString: function() {
			return this.x + "," + this.y
		}
	});
	e.F.Jd({
		xb: "getX",
		ob: "getY",
		add: "add",
		qa: "subtract",
		Ta: "divideBy",
		bb: "multiplyBy",
		Fc: "distance",
		Fa: "equals",
		toString: "toString"
	});
	e.tc = e.J.extend({
		j: function(a, b, c) {
			if (isNaN(a) || isNaN(b)) throw "Invalid Object: Size(" + a + ", " + b + ")";
			this.width = c ? Math.round(a) : Number(a);
			this.height = c ? Math.round(b) : Number(b)
		},
		rd: function() {
			return this.width
		},
		qd: function() {
			return this.height
		},
		Gi: function() {
			return new e.F(this.rd(), this.qd())
		},
		contains: function(a) {
			return Math.abs(a.x) <= Math.abs(this.width) && Math.abs(a.y) <= Math.abs(this.height)
		},
		Fa: function(a) {
			return a instanceof e.tc && this.width === a.width && this.height === a.height
		},
		toString: function() {
			return this.rd() +
				"," + this.qd()
		}
	});
	e.tc.Jd({
		rd: "getWidth",
		qd: "getHeight",
		toString: "toString"
	});
	e.Bh = e.J.extend({
		j: function() {
			if (2 === arguments.length) this.za = arguments[0], this.Wa = arguments[1];
			else if (1 === arguments.length && arguments[0] instanceof Array || 4 === arguments.length) {
				var a = arguments[0] instanceof Array ? arguments[0] : arguments;
				this.za = new e.F(a[0], a[1]);
				this.Wa = new e.F(a[2], a[3])
			} else throw "Invalid Object: PixelBounds(" + arguments.join(",") + ")";
		},
		ie: function(a) {
			return new e.F((this.za.x + this.Wa.x) / 2, (this.za.y + this.Wa.y) / 2, a)
		},
		contains: function(a) {
			var b;
			a instanceof e.Bh ? (b = a.za, a = a.Wa) : b =
				a;
			return b.x > this.za.x && a.x < this.Wa.x && b.y > this.za.y && a.y < this.Wa.y
		},
		rd: function() {
			return this.Wa.x - this.za.x
		},
		qd: function() {
			return this.Wa.y - this.za.y
		},
		Md: function(a) {
			var b = this.za,
				c = this.Wa,
				d = a.za;
			a = a.Wa;
			var f = a.y >= b.y - 20 && d.y <= c.y + 20;
			return a.x >= b.x - 20 && d.x <= c.x + 20 && f
		},
		toString: function() {
			return this.za + ";" + this.Wa
		},
		Pa: function() {
			return new e.Bh(this.za.Pa(), this.Wa.Pa())
		}
	});
	e.e = {};
	e.e.Ax = function(a) {
		for (var b = [Infinity, Infinity, -Infinity, -Infinity], c = 0, d = a.length; c < d; c += 1) e.e.Mq(b, a[c]);
		return b
	};
	e.e.jq = function(a, b, c) {
		var d = Math.min.apply(null, a);
		a = Math.max.apply(null, a);
		var f = Math.min.apply(null, b);
		b = Math.max.apply(null, b);
		return e.e.$x(d, a, f, b, c)
	};
	e.e.buffer = function(a, b) {
		a[0] -= b;
		a[1] -= b;
		a[2] += b;
		a[3] += b
	};
	e.e.Pa = function(a) {
		return a.slice()
	};
	e.e.gf = function(a, b) {
		return a[0] <= b[0] && b[0] <= a[2] && a[1] <= b[1] && b[1] <= a[3]
	};
	e.e.zq = function(a, b) {
		return a[0] <= b[0] && b[2] <= a[2] && a[1] <= b[1] && b[3] <= a[3]
	};
	e.e.cD = function() {
		return [Infinity, Infinity, -Infinity, -Infinity]
	};
	e.e.$x = function(a, b, c, d, f) {
		return "undefined" !== typeof f ? (f[0] = a, f[2] = b, f[1] = c, f[3] = d, f) : [a, c, b, d]
	};
	e.e.empty = function(a) {
		a[0] = a[1] = Infinity;
		a[2] = a[3] = -Infinity;
		return a
	};
	e.e.Fa = function(a, b) {
		return a[0] === b[0] && a[2] === b[2] && a[1] === b[1] && a[3] === b[3]
	};
	e.e.extend = function(a, b) {
		b[0] < a[0] && (a[0] = b[0]);
		b[2] > a[2] && (a[2] = b[2]);
		b[1] < a[1] && (a[1] = b[1]);
		b[3] > a[3] && (a[3] = b[3])
	};
	e.e.Mq = function(a, b) {
		b[0] < a[0] && (a[0] = b[0]);
		b[0] > a[2] && (a[2] = b[0]);
		b[1] < a[1] && (a[1] = b[1]);
		b[1] > a[3] && (a[3] = b[1])
	};
	e.e.qD = function(a) {
		return [a[0], a[1]]
	};
	e.e.rD = function(a) {
		return [a[2], a[1]]
	};
	e.e.ie = function(a) {
		return [(a[0] + a[2]) / 2, (a[1] + a[3]) / 2]
	};
	e.e.wD = function(a, b, c, d, f) {
		var g = b * d[0] / 2;
		d = b * d[1] / 2;
		b = Math.cos(c);
		c = Math.sin(c);
		g = [-g, -g, g, g];
		d = [-d, d, -d, d];
		var h, k, l;
		for (h = 0; 4 > h; h += 1) k = g[h], l = d[h], g[h] = a[0] + k * b - l * c, d[h] = a[1] + k * c + l * b;
		return e.e.jq(g, d, f)
	};
	e.e.qd = function(a) {
		return a[3] - a[1]
	};
	e.e.DD = function(a) {
		return [a[2] - a[0], a[3] - a[1]]
	};
	e.e.HD = function(a) {
		return [a[0], a[3]]
	};
	e.e.ID = function(a) {
		return [a[2], a[3]]
	};
	e.e.rd = function(a) {
		return a[2] - a[0]
	};
	e.e.Md = function(a, b) {
		return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]
	};
	e.e.Bm = function(a) {
		return a[2] < a[0] || a[3] < a[1]
	};
	e.e.normalize = function(a, b) {
		return [(b[0] - a[0]) / (a[2] - a[0]), (b[1] - a[1]) / (a[3] - a[1])]
	};
	e.e.EE = function(a, b) {
		var c = (a[2] - a[0]) / 2 * (b - 1),
			d = (a[3] - a[1]) / 2 * (b - 1);
		a[0] -= c;
		a[2] += c;
		a[1] -= d;
		a[3] += d
	};
	e.e.touches = function(a, b) {
		return e.e.Md(a, b) && (a[0] === b[2] || a[2] === b[0] || a[1] === b[3] || a[3] === b[1])
	};
	e.e.transform = function(a, b, c) {
		a = [a[0], a[1], a[0], a[3], a[2], a[1], a[2], a[3]];
		b(a, a, 2);
		return e.e.jq([a[0], a[2], a[4], a[6]], [a[1], a[3], a[5], a[7]], c)
	};
	e.Kb.ad({
		j: function() {
			var a = e.Kb.prototype.j;
			return function() {
				a.apply(this, arguments);
				this.southwest = this.Ma;
				this.northeast = this.La
			}
		}(),
		extend: function() {
			var a = e.Kb.prototype.extend;
			return function() {
				a.apply(this, arguments);
				this.Ma.lng = this.Ma.A;
				this.Ma.lat = this.Ma.D;
				this.La.lng = this.La.A;
				this.La.lat = this.La.D;
				return this
			}
		}()
	});
	e.t.ad({
		j: function() {
			var a = e.t.prototype.j;
			return function() {
				a.apply(this, arguments);
				this.lng = parseFloat(this.A.toFixed(6));
				this.lat = parseFloat(this.D.toFixed(6))
			}
		}()
	});
	e.Wi = e.J.extend({
		j: function(a, b, c, d) {
			this.ko = a;
			this.po = b;
			this.ro = c;
			this.zo = d
		},
		transform: function(a, b) {
			return this.Pp(a.Pa(), b)
		},
		Pp: function(a, b) {
			b = b || 1;
			a.x = b * (this.ko * a.x + this.po);
			a.y = b * (this.ro * a.y + this.zo);
			return a
		},
		NB: function(a, b) {
			b = b || 1;
			return new e.F((a.x / b - this.po) / this.ko, (a.y / b - this.zo) / this.ro)
		}
	});
	e.ze = e.J.extend({
		j: function(a) {
			this.Fk = a.MAX_LATITUDE || 85.0511287798;
			a.project && a.unproject && (this.ya = a.project, this.dd = a.unproject)
		}
	});
	e.ze.Jn = {
		ya: function(a) {
			return new e.F(a.A, a.D)
		},
		dd: function(a, b) {
			return new e.t(a.x, a.y, b)
		}
	};
	e.ze.Qt = new e.ze({
		MAX_LATITUDE: 85.0511287798,
		project: function(a) {
			var b = Math.PI / 180,
				c = this.Fk,
				c = Math.max(Math.min(c, a.D), -c);
			a = a.A * b;
			b = Math.log(Math.tan(Math.PI / 4 + c * b / 2));
			return new e.F(a, b, !1)
		},
		unproject: function(a, b) {
			var c = 180 / Math.PI;
			return new e.t(a.x * c, (2 * Math.atan(Math.exp(a.y)) - Math.PI / 2) * c, b)
		}
	});
	e.ze.Kn = {
		Fk: 85.0840591556,
		Jk: 6356752.3142,
		Ik: 6378137,
		ya: function(a) {
			var b = Math.PI / 180,
				c = this.Fk,
				d = Math.max(Math.min(c, a.D), -c),
				f = this.Ik,
				c = this.Jk;
			a = a.A * b * f;
			b *= d;
			f = c / f;
			f = Math.sqrt(1 - f * f);
			d = f * Math.sin(b);
			d = Math.pow((1 - d) / (1 + d), 0.5 * f);
			b = -c * Math.log(Math.tan(0.5 * (0.5 * Math.PI - b)) / d);
			return new e.F(a, b)
		},
		dd: function(a, b) {
			for (var c = 180 / Math.PI, d = this.Ik, f = this.Jk, g = a.x * c / d, d = f / d, d = Math.sqrt(1 - d * d), f = Math.exp(-a.y / f), h = Math.PI / 2 - 2 * Math.atan(f), k = 15, l = 0.1; 1E-7 < Math.abs(l) && (k -= 1, 0 < k);) l = d * Math.sin(h), l = Math.PI /
				2 - 2 * Math.atan(f * Math.pow((1 - l) / (1 + l), 0.5 * d)) - h, h += l;
			return new e.t(g, h * c, b)
		}
	};
	e.ed = {};
	e.ed.Ni = {
		Sj: function(a, b) {
			var c = this.zb.ya(a),
				d = this.scale(b);
			return this.Ii.Pp(c, d)
		},
		Vm: function(a, b, c) {
			b = this.scale(b);
			a = this.Ii.NB(a, b);
			return this.zb.dd(a, c)
		},
		ya: function(a) {
			return this.zb.ya(a)
		},
		scale: function(a) {
			return 256 * Math.pow(2, a)
		},
		$c: function(a) {
			return 12756274 * Math.PI / (256 * Math.pow(2, a))
		}
	};
	e.ed.zt = e.extend({}, e.ed.Ni, {
		code: "EPSG:3857",
		zb: e.ze.Qt,
		Ii: new e.Wi(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),
		ya: function(a) {
			return this.zb.ya(a).bb(6378137)
		}
	});
	e.ed.yt = e.extend({}, e.ed.Ni, {
		code: "EPSG:3395",
		zb: e.ze.Kn,
		Ii: function() {
			var a = e.ze.Kn;
			return new e.Wi(0.5 / (Math.PI * a.Ik), 0.5, -0.5 / (Math.PI * a.Jk), 0.5)
		}()
	});
	e.ed.At = e.extend({}, e.ed.Ni, {
		code: "EPSG:4326",
		zb: e.ze.Jn,
		Ii: new e.Wi(1 / 360, 0.5, -1 / 360, 0.25)
	});
	e.ed.kC = e.extend({}, e.ed.Ni, {
		zb: e.ze.Jn,
		Ii: new e.Wi(1, 0, 1, 0)
	});
	e.Jr = {
		ya: function(a, b) {
			return this.get("crs").Sj(a, b || this.get("zoom"))
		},
		dd: function(a, b, c) {
			return this.get("crs").Vm(a, b || this.get("zoom"), c)
		},
		XD: function(a, b) {
			return this.ya(a, b)
		},
		oD: function(a, b) {
			return this.dd(a, b)
		},
		Em: function(a, b) {
			var c = this.ha(a, b);
			return this.Hj(c, b)
		},
		Je: function(a, b) {
			var c = this.get("size").Gi().Ta(2);
			if (a.Fa(c)) return this.get("center");
			c = this.Xl(a, b);
			return this.Ec(c, b)
		},
		Ec: function(a, b) {
			return this.dd(a.Ta(this.get("resolution", b)), b)
		},
		ha: function(a, b) {
			return a instanceof
			e.t ? this.ya(a, b).bb(this.get("resolution", b)) : a
		},
		uD: function(a) {
			return a ? this.ya(this.get("center"), a) : this.get("centerPixel")
		},
		nD: function(a, b) {
			return this.Hj(a.bb(this.get("resolution", b)), b)
		},
		bD: function(a, b) {
			return this.Xl(a, b).Ta(this.get("resolution"))
		},
		Xl: function(a, b) {
			var c = this.get("size").Gi().Ta(2),
				d = a.qa(c),
				f = (this.get("rotateEnable") ? this.get("rotation") : 0) * Math.PI / 180,
				c = d.x * Math.cos(f) + Math.sin(f) * d.y,
				d = -Math.sin(f) * d.x + Math.cos(f) * d.y,
				c = this.get("centerCoords").add((new e.F(c, d)).bb(this.get("resolution",
					b)));
			c.x = (c.x + 4.00750166855784E7) % 4.00750166855784E7;
			return c
		},
		Hj: function(a, b) {
			a = a.Pa();
			var c = this.Ec(a),
				d = this.get("center"); - 90 > d.A && 90 < c.A ? a.x -= this.ha(new e.t(180, 0)).x : 90 < d.A && -90 > c.A && (a.x += this.ha(new e.t(180, 0)).x);
			var c = this.get("centerCoords"),
				c = a.qa(c).Ta(this.get("resolution", b)),
				d = this.get("size").Gi().Ta(2),
				f = (this.get("rotateEnable") ? this.get("rotation") : 0) * Math.PI / 180;
			return d.add(new e.F(c.x * Math.cos(f) - Math.sin(f) * c.y, Math.sin(f) * c.x + Math.cos(f) * c.y))
		}
	};
	var ca = e.J.extend({
		Ua: [e.ba, e.$b],
		h: {
			center: new e.t(116.397128, 39.916527),
			zoom: 13,
			rotation: 0,
			crs: "EPSG3857"
		},
		j: function(a) {
			this.fs = a;
			a = this.Cq(a.crs || "EPSG3857");
			this.set("crs", a)
		},
		xy: function(a) {
			var b = this.map.getSize(),
				c = a.ie();
			if (a && b && c) {
				for (var d = this.map.get("zooms")[1]; d > this.map.get("zooms")[0]; d -= 1) {
					var f = this.map.ya(a.Ma, d),
						g = this.map.ya(a.La, d);
					if (Math.abs(g.x - f.x) < b.width && Math.abs(f.y - g.y) < b.height) break
				}
				return [c, d]
			}
			return null
		},
		lz: function() {
			var a = this.fs;
			if (!(a && a.center && a.zoom)) {
				var b =
					e.o.kq,
					b = this.xy(new e.Kb(b[0], b[1], b[2], b[3]));
				a.center = a.center || b && b[0];
				"[object Number]" !== Object.prototype.toString.call(a.zoom) && (a.zoom = b && b[1])
			}
			a.zoom = Math.round(a.zoom);
			e.k.ua(this, a);
			e.f.dc && (this.h.rotation = 0);
			this.h.crs = this.Cq(this.h.crs || "EPSG3857");
			this.Qd(this.h);
			delete this.fs
		},
		Cq: function(a) {
			if (this.h.center instanceof e.t) {
				if ("string" === typeof a) {
					switch (a) {
						case "EPSG3395":
							return e.ed.yt;
						case "EPSG4326":
							return e.ed.At
					}
					return e.ed.zt
				}
				if (a.pointToLngLat && a.lngLatToPoint) return {
					Vm: a.pointToLngLat,
					Sj: a.lngLatToPoint,
					$c: a.getResolution
				};
				throw "illegal projection";
			}
			var b = this.get("zoom");
			return {
				$c: function(a) {
					return Math.pow(2, b - a)
				},
				Sj: function() {},
				Vm: function() {}
			}
		},
		getCenterPixel: function() {
			return this.get("crs").Sj(this.get("center"), this.get("zoom"))
		},
		getCenterCoords: function() {
			return this.map.ha(this.get("center"))
		},
		centerCoordsChanged: function() {
			var a = this.get("centerCoords");
			this.get("center") instanceof e.t ? this.set("center", this.map.Ec(a), !0) : this.set("center", a, !0)
		},
		getResolution: function(a) {
			return this.get("crs").$c(a ||
				this.get("zoom"))
		}
	});
	var H = e.J.extend({
		Ua: [e.ba, e.$b, e.Jr],
		h: {
			dragEnable: !0,
			lang: "zh_cn",
			keyboardEnable: !0,
			doubleClickZoom: !0,
			scrollWheel: !0,
			zoomEnable: !0,
			jogEnable: !0,
			continuousZoomEnable: !0,
			resizeEnable: !1,
			animateEnable: !0,
			rotateEnable: !1,
			touchZoom: !0,
			renderer: "canvas",
			zooms: [3, e.f.Z ? 19 : 18],
			defaultCursor: "-",
			mapRange: [-180, 78, 180, -78],
			logoUrl: e.o.ga + "/theme/v1.3/autonavi.png",
			logoUrlRetina: e.o.ga + "/theme/v1.3/mapinfo_05.png",
			copyright: "v1.3.2 \u5730\u56fe\u6570\u636e &copy;2014 AutoNavi - GS(2014)6002\u53f7",
			isHotspot: !1
		},
		setLang: function(a) {
			"en" !== a && "zh_cn" !== a && "zh_en" !== a || a === this.getLang() || (this.set("lang", a), this.ke && this.ke.Cs(this))
		},
		getLang: function() {
			return this.get("lang", null, !0)
		},
		setCity: function(a) {
			function b(a) {
				if ((a = a.districts) && a.length) try {
					var b = a[0].center.split(","),
						d;
					switch (a[0].level) {
						case "city":
							d = 10;
							break;
						case "province":
							d = 7;
							break;
						case "district":
							d = 12;
							break;
						case "country":
							d = 4;
							break;
						default:
							d = 12
					}
					c.setZoomAndCenter(d, new e.t(b[0], b[1]), !0)
				} catch (k) {}
			}
			var c = this,
				d = e.o.Ab + "/v3/config/district?subdistrict=0&extensions=&&key=" +
				e.o.key + "&s=rsv3&output=json&keywords=" + a;
			e.$.load("http", function() {
				(new e.T.ca(d, {
					callback: "callback"
				})).a("complete", b, this)
			})
		},
		getCity: function(a) {
			function b(b) {
				var c = b.regeocode.addressComponent;
				a({
					province: c.province,
					city: c.city instanceof Array ? "" : c.city,
					citycode: c.citycode instanceof Array ? "" : c.citycode,
					district: c.district instanceof Array ? "" : c.district,
					address: b.regeocode.formatted_address
				})
			}
			var c = e.o.Ab + "/v3/geocode/regeo?&extensions=&&key=" + e.o.key + "&s=rsv3&output=json&location=" + this.get("center");
			e.$.load("http", function() {
				(new e.T.ca(c, {
					callback: "callback"
				})).a("complete", b, this)
			})
		},
		j: function(a, b) {
			b = b || {};
			b.mobile && (e.f.Da = !0, delete b.mobile);
			b.server && (e.o.Ab = b.server, delete b.server);
			b.zooms && (b.zooms[0] = Math.max(3, b.zooms[0]), b.zooms[1] = Math.min(e.f.Z ? 19 : 18, b.zooms[1]));
			b = this.Fx(b);
			if ("string" === typeof a) {
				if (a = this.w = document.getElementById(a), !a) return
			} else a instanceof HTMLDivElement && (this.w = a);
			var c = b.lang;
			"en" !== c && "zh_cn" !== c && "zh_en" !== c && (b.lang = "zh_cn");
			e.k.ua(this, b);
			e.f.dc &&
				(this.h.rotateEnable = !1);
			this.set("zooms", this.h.zooms);
			c = this.h.view;
			c.map = this;
			this.lc("zoom crs resolution centerPixel center centerCoords rotation".split(" "), c);
			c.lz();
			this.Qd(this.h);
			for (var d = 0, f = 0, g = 0; g < b.layers.length; g += 1) {
				var h = b.layers[g];
				h.set("map", this, !0);
				h instanceof A && (d += 1, h.a("complete", function() {
					this.u("complete", arguments.callee, this);
					f += 1;
					f === d && this.get("map").q("complete")
				}, h))
			}(g = c.get("zoom")) && (g > this.get("zooms")[1] ? c.set("zoom", this.get("zooms")[1]) : g < this.get("zooms")[0] &&
				c.set("zoom", this.get("zooms")[0]));
			this.Qd({
				overlays: [],
				infos: {},
				controls: {}
			});
			var k = this;
			e.f.fA && this.set("renderer", "dom", !0);
			c = "map anip layers overlay0 brender mrender".split(" ");
			"canvas" === this.get("renderer") ? c.push("crender") : c.push("drender");
			e.$.Tj(c, function() {
				if (!k.get("destroy")) {
					var b = new e.sc(a, k);
					k.lc(["zoomSlow", "panTo", "targetLevel"], b);
					b.lc(["size", "bounds"], k);
					k.loaded = !0
				}
			});
			this.Au(0)
		},
		Fx: function(a) {
			a || (a = {});
			(a.defaultLayer || a.level || a.center) && (a.layers || a.view) && window.alert("\u8bf7\u52ff\u5c06api1.2\u4e0e1.3\u7684\u5b9a\u4e49\u65b9\u5f0f\u6df7\u7528!\u8be6\u60c5\u53c2\u770b\u63a5\u53e3\u6587\u6863\u3002");
			if (a.hasOwnProperty("defaultLayer")) {
				a.layers = [a.defaultLayer];
				var b = a.defaultLayer;
				b.Ol = !0;
				this.set("defaultLayer", b, !0)
			}
			a.layers && 0 !== a.layers.length || (b = new A, a.layers = [b], b.Ol = !0, this.set("defaultLayer", b, !0));
			a.view || (a.view = new ca({
				center: a.center,
				zoom: a.level,
				crs: a.crs
			}));
			return a
		},
		Au: function() {
			var a = ["v=1.3", "k=" + e.o.key, "u=" + window.location.href, "t=0"];
			e.f.Z && a.push("s=" + this.getSize());
			var b = e.o.ga + "/count?" + a.join("&");
			e.$.load("http", function() {
				new e.T.Ui(b)
			})
		},
		Zp: function(a) {
			var b = this.get("layers");
			0 <= e.k.indexOf(b, a) || (this.get("layers").push(a), this.q("layers"))
		},
		aq: function(a) {
			var b = this.get("overlays");
			0 <= e.k.indexOf(b, a) || (a instanceof B ? (this.get("overlays").push(a), this.Gj instanceof B && this.Gj.close(), this.Gj = a, this.set("contextmenu", a, !0)) : (a instanceof C && (this.mf instanceof C && this.gk(this.mf), this.mf = a), this.get("overlays").push(a)), this.q("overlays"))
		},
		fk: function(a) {
			var b = this.get("layers");
			this.set("layers", e.k.bg(b, e.k.indexOf(b, a)))
		},
		gk: function(a) {
			var b = this.get("overlays");
			this.set("overlays", e.k.bg(b, e.k.indexOf(b, a)))
		},
		setZoom: function(a, b) {
			a = Math.round(a);
			var c = this.get("zooms");
			a > c[1] && (a = c[1]);
			a < c[0] && (a = c[0]);
			this.get("zoom") !== a && this.get("zoomEnable") && (b || !this.loaded ? (this.set("zoom", a), this.q("zoomstart"), this.q("zoomchange"), this.q("zoomend")) : this.set("zoomSlow", a))
		},
		getZoom: function() {
			return this.get("targetLevel") || this.get("zoom")
		},
		getCenter: function() {
			return this.get("center")
		},
		setCenter: function(a, b) {
			this.get("center").Fa(a) || (b || !this.loaded ? (this.set("center",
				a), this.q("movestart"), this.q("mapmove"), this.q("moveend")) : this.panTo(a))
		},
		getCoordsBound: function() {
			var a = this.get("size"),
				b = this.get("centerCoords"),
				c = this.get("rotation") % 360,
				d = this.get("resolution"),
				c = Math.PI * c / 180,
				a = new e.F((Math.abs(a.width * Math.cos(c)) + Math.abs(a.height * Math.sin(c))) / 2, (Math.abs(a.width * Math.sin(c)) + Math.abs(a.height * Math.cos(c))) / 2),
				b = new e.Bh(b.qa(a.bb(d)), b.add(a.bb(d)));
			b.Ca = a;
			return b
		},
		setRotation: function(a) {
			!e.f.dc && this.get("rotateEnable") && this.set("rotation", a)
		},
		getRotation: function() {
			return this.get("rotation") || 0
		},
		getBounds: function() {
			this.get("crs");
			var a = this.getCoordsBound(),
				b = a.Wa.x,
				c = a.za.y,
				a = new e.F(a.za.x, a.Wa.y),
				b = new e.F(b, c);
			return new e.Kb(this.Ec(a, this.get("zoom")), this.Ec(b, this.get("zoom")))
		},
		getStatus: function() {
			for (var a = "isHotspot dragEnable zoomEnable keyboardEnable jogEnable doubleClickZoom scrollWheel resizeEnable touchZoom rotateEnable animateEnable".split(" "), b = {}, c = 0; c < a.length; c += 1) b[a[c]] = this.get(a[c], null, !0);
			return b
		},
		setStatus: function(a) {
			for (var b in a) a.hasOwnProperty(b) &&
				-1 !== "isHotspot,dragEnable,keyboardEnable,doubleClickZoom,scrollWheel,zoomEnable,jogEnable,continuousZoomEnable,resizeEnable,animateEnable,rotateEnable,touchZoom".indexOf(b) && this.set(b, a[b])
		},
		getResolution: function(a) {
			a = a ? a.D : this.get("center").D;
			return this.get("resolution") * Math.cos(a * Math.PI / 180)
		},
		getScale: function(a) {
			return this.getResolution() * (a || 96) / 0.0254
		},
		getDefaultCursor: function() {
			return this.get("defaultCursor", null, !0)
		},
		setDefaultCursor: function(a) {
			return this.set("defaultCursor", a, !0)
		},
		zoomIn: function() {
			this.setZoom(this.get("targetLevel") + 1)
		},
		zoomOut: function() {
			this.setZoom(this.get("targetLevel") - 1)
		},
		setZoomAndCenter: function(a, b, c) {
			a = Math.round(a);
			var d = this.get("zooms");
			a > d[1] && (a = d[1]);
			a < d[0] && (a = d[0]);
			c || !this.loaded ? (this.setZoom(a, !0), this.setCenter(b, !0)) : this.set("zoomAndCenter", [a, b])
		},
		setBounds: function(a, b, c, d) {
			b = b ? Number(b) : 0;
			var f = this.get("zooms")[1],
				g = this.getSize().Gi();
			for (c && (g = g.qa(c)); f > this.get("zooms")[0]; f -= 1) {
				c = this.ya(a.Ma, f);
				var h = this.ya(a.La, f);
				a.Ma.A > a.La.A && (h.x += this.ya(new e.t(180, 0), f).x);
				if (Math.abs(h.x - c.x) < g.x && Math.abs(c.y - h.y) < g.y) break
			}
			d = d || !this.getBounds().contains(a.ie());
			this.setZoomAndCenter(f + b, a.ie(), d);
			return a
		},
		clearMap: function() {
			this.set("overlays", []);
			if (this.map && this.map.Qa)
				for (var a = this.map.Qa, b = a.length, c = 0; c < b; c += 1) a[c].Sg instanceof D && a[c].Sg.setMap(null)
		},
		destroy: function() {
			this.set("overlays", []);
			this.set("layers", []);
			this.set("controls", []);
			this.set("destroy", !0)
		},
		addControl: function(a) {
			var b = e.k.Ya(a),
				c = this.get("controls") || {};
			c.Wb = c.Wb || {};
			c.Wb[b] || (c.Wb[b] = a);
			c.add = c.add || [];
			c.add.push(a);
			this.set("controls", c)
		},
		removeControl: function(a) {
			var b = e.k.Ya(a),
				c = this.get("controls") || {};
			c.Wb = c.Wb || {};
			c.Wb[b] && delete c.Wb[b];
			c.remove = c.remove || [];
			c.remove.push(a);
			this.set("controls", c)
		},
		clearControl: function() {
			var a = this.get("controls") || {};
			a.remove = a.remove || [];
			a.Wb = a.Wb || {};
			for (var b in a.Wb) a.Wb.hasOwnProperty(b) && (a.remove.push(a.Wb[b]), delete a.Wb[b]);
			this.set("controls", a)
		},
		plugin: function(a,
			b) {
			"string" === typeof a && (a = [a]);
			for (var c = 0; c < a.length; c += 1) {
				var d = a[c].split(".");
				"function" === typeof window[d[0]][d[1]] && (a.splice(c, 1), c -= 1)
			}
			if (0 === a.length) return b(), this;
			for (var f = a.length, c = 0; c < a.length; c += 1) e.$.load(a[c], function() {
				f -= 1;
				0 === f && b()
			});
			return this
		},
		clearInfoWindow: function() {
			var a = this.get("overlays");
			a && 0 !== a.length && this.mf && this.mf.close()
		},
		getSize: function() {
			if (!this.Jl || this.get("resizeEnable")) this.Jl = e.d.Nj(this.w);
			return new e.tc(this.Jl.width, this.Jl.height)
		},
		getContainer: function() {
			return this.w
		},
		panTo: function(a) {
			this.loaded ? this.get("center").Fa(a) || this.set("panTo", a) : this.setCenter(a)
		},
		panBy: function(a, b, c) {
			var d = this.get("rotation") * Math.PI / 180,
				f = a * Math.cos(d) + Math.sin(d) * b;
			a = -Math.sin(d) * a + Math.cos(d) * b;
			f = this.get("centerPixel").add(new e.F(-f, -a));
			f = this.dd(f);
			!this.loaded || c ? this.setCenter(f, c) : this.get("center").Fa(f) || this.set("panTo", f)
		},
		setFitView: function(a, b) {
			var c, d;
			if (a)
				if (a instanceof G) d = [a];
				else if (a instanceof Array) d = a;
			else return null;
			else {
				d = this.get("overlays");
				var f =
					this.get("layers");
				if (f)
					for (var g = 0, h = f.length; g < h; g += 1) f[g] instanceof D && d.push(f[g])
			}
			for (f = 0; f < d.length; f += 1) g = d[f], g instanceof C || g instanceof B || (g = g.getBounds()) && (c = c ? g.LB(c) : g);
			c && this.setBounds(c, null, new e.F(50, 50), b);
			return c
		},
		setLayers: function(a) {
			for (var b = 0; b < a.length; b += 1) a[b].set("map", this, !0);
			this.set("layers", a)
		},
		getLayers: function() {
			return this.get("layers", null, !0)
		},
		getDefaultLayer: function() {
			return this.get("defaultLayer", null, !0)
		},
		setDefaultLayer: function(a) {
			a.Ol = !0;
			var b = this.get("defaultLayer"),
				c = this.get("layers");
			if (b) {
				if (a === b) return;
				b.Ol = !1;
				c = e.k.bg(c, e.k.indexOf(c, b))
			}
			this.set("defaultLayer", a, !0);
			c.push(a);
			this.setLayers(c)
		},
		pixelToLngLat: function(a) {
			return this.dd(a)
		},
		lnglatToPixel: function(a) {
			return this.ya(a)
		},
		drawPolyline: function(a) {
			this.set("draw", "polyline");
			this.set("drawStyle", a || {
				strokeColor: "#006600",
				ib: 0.9
			})
		},
		drawPolygon: function(a) {
			this.set("draw", "polygon");
			this.set("drawStyle", a || {
				strokeColor: "#006600",
				ib: 0.9,
				fillColor: "#FFAA00",
				nb: 0.9
			})
		},
		drawCircle: function(a) {
			this.set("draw",
				"circle");
			this.set("drawStyle", a || {
				strokeColor: "#006600",
				ib: 0.9,
				fillColor: "#006600",
				nb: 0.9
			})
		},
		endDraw: function() {
			this.set("draw", null)
		}
	});
	H.Jd({
		Em: "lnglatTocontainer",
		lnglatTocontainer: "lngLatToContainer",
		Je: "containTolnglat",
		containTolnglat: "containerToLngLat",
		ya: "project",
		dd: "unproject"
	});
	H.ad({
		isHotspotChanged: function() {
			this.it = !1;
			this.Rx();
			this.Qx();
			this.get("isHotspot") && this.get("layers", null, !0) && (this.kA() || this.jA())
		},
		jA: function() {
			if (this.ke) this.wr();
			else {
				var a = this;
				this.plugin("AMap.HotSpot", function() {
					if (!a.it) {
						if (!a.ke) {
							var b = new e.rc;
							new C;
							a.ke = b
						}
						a.wr()
					}
				})
			}
		},
		Qx: function() {
			this.ke && this.iz()
		},
		kA: function() {
			for (var a = this.get("layers", null, !0), b = 0; b < a.length; b += 1)
				if (a[b].H && a[b].H.Hc) return a[b].H.iA(), this.it = !0;
			return !1
		},
		Rx: function() {
			var a = this.get("layers", null, !0);
			if (a)
				for (var b = 0; b < a.length; b += 1) a[b].H && a[b].H.Hc && a[b].H.wq()
		},
		ds: function(a) {
			a.type = "hotspotover";
			this.q("hotspotover", a)
		},
		bs: function(a) {
			a.type = "hotspotclick";
			this.q("hotspotclick", a)
		},
		cs: function(a) {
			a.type = "hotspotout";
			this.q("hotspotout", a)
		},
		wr: function() {
			var a = this.ke;
			this.ke.setMap(this);
			a.a("mouseover", this.ds, this);
			a.a("click", this.bs, this);
			a.a("mouseout", this.cs, this)
		},
		iz: function() {
			var a = this.ke;
			a.u("mouseover", this.ds, this);
			a.u("click", this.bs, this);
			a.u("mouseout", this.cs, this);
			this.ke.setMap(null);
			this.ke = null
		}
	});
	var J = {
		R: function(a, b, c, d) {
			e.l.a(a, b, c, d);
			return new e.Oi(0, a, b, c, d)
		},
		lx: function() {},
		addListener: function(a, b, c, d) {
			a.nc || (a.nc = e.ba.nc);
			e.ba.a.call(a, b, c, d);
			return new e.Oi(1, a, b, c, d)
		},
		$p: function(a, b, c, d) {
			a.nc || (a.nc = e.ba.nc);
			e.ba.a.call(a, b, c, d, !0);
			return new e.Oi(1, a, b, c, d)
		},
		uq: function(a) {
			e.ba.$h.call(a)
		},
		Mx: function(a, b) {
			e.ba.$h.call(a, b)
		},
		removeListener: function(a) {
			!a instanceof e.Oi || (0 === a.type ? e.l.u(a.Qj, a.Lq, a.tr) : 1 === a.type && (a.Qj.nc || (a.Qj.nc = e.ba.nc), e.ba.u.call(a.Qj, a.Lq, a.tr)))
		},
		m: function(a,
			b) {
			a.nc || (a.nc = e.ba.nc);
			var c = Array.prototype.slice.call(arguments, 1);
			e.ba.q.apply(a, c)
		}
	};
	e.Oi = e.J.extend({
		j: function(a, b, c, d, f) {
			this.type = a;
			this.Qj = b;
			this.Lq = c;
			this.tr = d;
			this.$f = f
		}
	});
	var K = {
			R: "addDomListener",
			lx: "addDomListenerOnce",
			addListener: "addListener",
			$p: "addListenerOnce",
			uq: "clearInstanceListeners",
			Mx: "clearListeners",
			removeListener: "removeListener",
			m: "trigger"
		},
		L;
	for (L in K) K.hasOwnProperty(L) && (J[K[L]] = J[L]);
	e.event = J;
	var M = e.J.extend({
		Ua: [e.ba, e.$b],
		j: function(a) {
			e.k.ua(this, a);
			this.Qd(this.h)
		},
		getZooms: function() {
			return this.get("zooms", null, !0)
		},
		setOpacity: function(a) {
			a !== this.get("opacity", null, !0) && this.set("opacity", a)
		},
		show: function() {
			this.set("visible", !0)
		},
		hide: function() {
			this.set("visible", !1)
		},
		setMap: function(a) {
			a ? (this.get("map") && this.get("map").fk(this), this.set("map", a)) : this.get("map") && (this.get("map").fk(this), this.set("map", null, !0))
		},
		mapChanged: function() {
			this.get("map") && this.get("map").Zp(this)
		},
		setzIndex: function(a) {
			this.set("zIndex", a)
		}
	});
	var A = M.extend({
		h: {
			tileSize: 256,
			visible: !0,
			opacity: 1,
			zIndex: 1,
			zooms: [3, e.f.Da ? 20 : 18],
			getTileUrl: e.f.Da ? e.o.tk : e.o.Uj,
			errorUrl: e.k.Jq,
			detectRetina: !0
		},
		j: function(a) {
			(a = a || {}) && a.tileUrl && (a.getTileUrl = a.tileUrl, delete a.tileUrl);
			this.Jx(a);
			var b = a.zooms;
			b ? (b[0] < this.ud[0] && (b[0] = this.ud[0]), b[1] > this.ud[1] && (b[1] = this.ud[1])) : a.zooms = [this.ud[0], this.ud[1]];
			arguments.callee.ra.call(this, a)
		},
		tq: function() {
			var a = this.get("getTileUrl");
			if (a !== e.o.Uj && a !== e.o.tk || !e.f.Cx) return !1;
			a = this.get("map");
			return !a ||
				"zh_cn" !== a.get("lang") || "canvas" !== a.get("renderer") || this.noVector ? !1 : !0
		},
		Yf: function(a) {
			this.get("map") || this.set("map", a.Sa, !0);
			return this.tq() ? e.H.gd ? new e.H.gd(this, a) : ["vectorlayer", "overlay"] : new e.H.Cf(this, a)
		},
		getTileUrlChanged: function() {
			var a = this.get("getTileUrl");
			"string" === typeof a && (a = this.gl(a));
			this.set("tileFun", a)
		},
		Jx: function(a) {
			this.ud || (this.ud = [this.h.zooms[0], this.h.zooms[1]]);
			var b;
			a.hasOwnProperty("detectRetina") && !1 === a.detectRetina && (b = !0);
			e.f.Da && e.f.hc && this.h.detectRetina &&
				!b && (this.ud[1] -= 1)
		},
		getTiles: function() {
			var a = this.get("tiles", null, !0);
			if (a) a = a[0];
			else return [];
			for (var b = [], c, d = 0; d < a.length; d += 1) a[d].key && (c = a[d].key.split("/"), b.push("" + c[1] + "," + c[2]));
			return b
		},
		reload: function() {
			this.set("reload", 1)
		},
		qs: function() {
			var a = this.get("map", null, !0);
			this.setMap(null);
			this.Zf = !1;
			this.setMap(a)
		},
		setTileUrl: function(a) {
			this.tq() ? (this.set("getTileUrl", a), this.qs()) : this.set("getTileUrl", a)
		},
		gl: function(a) {
			var b = this;
			return function(c, d, f) {
				c = (c + Math.pow(2, f)) % Math.pow(2,
					f);
				if ("number" !== typeof(c + d + f)) return null;
				var g;
				if (g = a.match(/\{.*\}/)) {
					var h = g.toString().replace("{", "").replace("}", ""),
						h = h.split(","),
						h = h[Math.abs(c + d) % h.length];
					a = a.replace(g, h)
				}
				g = b.get("map");
				h = "zh_cn";
				g && (h = g.get("lang") || "zh_cn");
				return a.replace("[x]", c).replace("[y]", d).replace("[z]", f).replace("[lang]", h)
			}
		},
		getTileUrl: function(a, b, c) {
			return this.get("tileFun", null, !0)(a, b, c)
		},
		getZooms: function() {
			return this.get("zooms", null, !0)
		}
	});
	A.Sn = A.extend({
		h: {
			getTileUrl: e.o.gn,
			zooms: [3, 18],
			zIndex: 2
		},
		j: function(a) {
			this.ud = [3, 18];
			arguments.callee.ra.apply(this, arguments)
		}
	});
	A.Qn = A.extend({
		h: {
			getTileUrl: e.o.en,
			zooms: [3, 18],
			zIndex: 3,
			type: "overlayer"
		},
		j: function(a) {
			this.ud = [3, 18];
			arguments.callee.ra.apply(this, arguments)
		}
	});
	A.Un = A.extend({
		h: {
			getTileUrl: function(a, b, c) {
				return e.o.Jc + "://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&zoom=" + (17 - c) + "&x=" + a + "&y=" + b
			},
			zooms: [3, 17],
			zIndex: 4,
			type: "overlayer"
		},
		j: function(a) {
			this.ud = [3, 17];
			arguments.callee.ra.apply(this, arguments)
		},
		reload: function() {
			this.set("getTileUrl", function(a, b, c) {
				return e.o.Jc + "://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&zoom=" + (17 - c) + "&x=" + a + "&y=" + b + "&tm=" + (new Date).getTime()
			})
		}
	});
	var N = M.extend({
		h: {
			visible: !0,
			zooms: [3, e.f.Z ? 20 : 18],
			type: "overlay",
			zIndex: 5
		},
		j: function(a) {
			arguments.callee.ra.apply(this, arguments)
		},
		Yf: function(a) {
			return new e.H.ub(this, a)
		}
	});
	var da = M.extend({
		h: {
			visible: !0,
			zooms: [3, 18],
			zIndex: 1,
			opacity: 1,
			detectRetina: !0
		},
		j: function(a) {
			arguments.callee.ra.apply(this, arguments)
		},
		Yf: function(a) {
			return e.H.gd ? new e.H.gd(this, a) : ["vectorlayer", "overlay"]
		}
	});
	var ea = M.extend({
		h: {
			zooms: [17, 18],
			zIndex: 8,
			url: e.o.te + "/vector/buildings",
			wallColor: [200, 190, 180],
			strokeColor: [145, 140, 135],
			CAM_Z: 400,
			lineCap: "round",
			lineJoin: "round",
			lineWidth: 1,
			fadeFactor: 1,
			visible: !0
		},
		j: function() {
			arguments.callee.ra.apply(this, arguments)
		},
		Yf: function(a) {
			if (e.H.Vd) return new e.H.Vd(this, a);
			if (e.f.zr) return ["building", "overlay"]
		}
	});
	var fa = M.extend({
		h: {
			visible: !0,
			zooms: [3, e.f.Z ? 20 : 18],
			opacity: 1,
			type: "overlay",
			zIndex: 6
		},
		j: function(a) {
			arguments.callee.ra.apply(this, arguments)
		},
		Yf: function(a) {
			return e.H.xg ? new e.H.xg(this, a) : ["imagelayer"]
		},
		getMap: function() {
			return this.Tc.map
		},
		show: function() {
			this.set("visible", !0);
			this.q("options")
		},
		getOpacity: function() {console.log('this.get',this.get);
			return this.get("opacity", null, !0)
		},
		setOpacity: function(a) {
			this.set("opacity", a)
		},
		getBounds: function() {
			return this.get("bounds", null, !0).Pa()
		},
		setBounds: function(a) {
			this.setOptions({
				bounds: a
			})
		},
		getImageUrl: function() {
			return this.get("url")
		},
		setImageUrl: function(a) {
			return this.set("url", a)
		},
		hide: function() {
			this.set("visible", !1);
			this.q("options")
		},
		setOptions: function(a) {
			this.Qd(a);
			this.q("options")
		},
		getOptions: function() {
			var a = {},
				b;
			for (b in this.h) this.h.hasOwnProperty(b) && (a[b] = this.get(b));
			return a
		}
	});
	var D = fa.extend({
		j: function(a, b, c) {
			c = c || {};
			this.Ne = !0;
			arguments.callee.ra.call(this, {
				url: a,
				bounds: b,
				clickable: c.clickable,
				opacity: c.opacity || 1,
				map: c.map,
				zooms: c.zooms || [3, 18]
			})
		},
		bA: function(a) {
			this.get("bounds").contains(a.lnglat) && (a.target = this, this.q("click", a))
		},
		cA: function(a) {
			this.get("bounds").contains(a.lnglat) && (a.target = this, this.q("dblclick", a))
		},
		setMap: function(a) {
			a ? (this.get("map") && (this.get("map").fk(this), this.vq && J.removeListener(this.vq), this.Dq && J.removeListener(this.Dq)), this.set("map",
				a)) : this.get("map") && (this.get("map").fk(this), this.Tc.map = null)
		},
		mapChanged: function() {
			this.get("map") && (this.get("map").Zp(this), this.get("clickable") && (this.vq = J.addListener(this.get("map"), "click", this.bA, this), this.Dq = J.addListener(this.get("map"), "dblclick", this.cA, this)))
		}
	});
	var G = e.J.extend({
		Ua: [e.ba, e.$b],
		h: {
			extData: {},
			bubble: !1,
			clickable: !0,
			draggable: !1
		},
		VC: function() {
			this.get("map", null, !0) && this.setMap(this.get("map"))
		},
		mapChanged: function() {
			this.get("map", null, !0) && this.get("map", null, !0).aq(this)
		},
		show: function() {
			this.set("visible", !0)
		},
		hide: function() {
			this.set("visible", !1)
		},
		setMap: function(a) {
			if (null === a || a !== this.get("map", null, !0)) a ? (this.get("map", null, !0) && this.get("map", null, !0).gk(this), this.set("map", a)) : this.get("map", null, !0) && (this.get("map", null, !0).gk(this),
				this.set("map", null, !0))
		},
		setExtData: function(a) {
			this.set("extData", a)
		},
		getExtData: function() {
			return this.get("extData", null, !0)
		}
	});
	var ga = G.extend({
		show: function() {
			this.set("visible", !0);
			this.q("show", {
				type: "show",
				target: this
			})
		},
		hide: function() {
			this.set("visible", !1);
			this.q("hide", {
				type: "hide",
				target: this
			})
		},
		getVisible: function() {
			return this.get("visible", null, !0)
		},
		getOptions: function() {
			var a = {},
				b = "map zIndex strokeColor strokeOpacity strokeWeight strokeStyle strokeDasharray extData bubble clickable".split(" "),
				c = ["isOutline", "outlineColor", "geodesic", "path"],
				d = ["fillColor", "fillOpacity", "path"],
				f = ["center", "radius"],
				g = [];
			this instanceof
			O && (g = b.concat(c));
			this instanceof P && (g = b.concat(d));
			this instanceof Q && (g = b.concat(f).concat(d));
			for (b = 0; b < g.length; b += 1) a[g[b]] = this.get(g[b], null, !0);
			return a
		},
		setOptions: function(a) {
			a.hasOwnProperty("path") && (a.path && a.path.length || (a.path = []));
			this.Tc && this.Tc.map && a.map === this.Tc.map && delete a.map;
			this.Qd(a);
			this.q("options");
			this.q("change", {
				type: "change",
				target: this
			})
		},
		setDraggable: function(a) {
			this.set("draggable", a)
		}
	});
	var R = ga.extend({
		h: {
			visible: !0,
			zIndex: 10,
			strokeColor: "#006600",
			strokeOpacity: 0.9,
			strokeWeight: 3,
			strokeStyle: "solid",
			strokeDasharray: [10, 5],
			path: []
		},
		setPath: function(a, b) {
			a && a.length || (a = []);
			this.set("path", a);
			this.q("change", {
				type: "change",
				target: this
			});
			b || this.q("setPath")
		},
		getPath: function() {
			return this.get("path", null, !0)
		},
		wb: function() {
			var a = this.get("path");
			if (!a || !a.length) return null;
			a[0] instanceof e.t && (a = [a]);
			for (var b = new e.Kb(180, 90, -180, -90), c = 0; c < a.length; c += 1)
				for (var d = a[c], f = d.length -
					1; 0 <= f; f -= 1) b.extend(d[f]);
			return b
		}
	});
	R.Jd({
		wb: "getBounds"
	});
	var S = e.J.extend({
		Ua: [e.ba, e.$b],
		h: {
			size: new e.tc(36, 36),
			imageOffset: new e.F(0, 0),
			image: e.o.ga + "/theme/v1.3/markers/0.png",
			imageSize: null
		},
		j: function(a) {
			e.k.ua(this, a);
			this.Qd(this.h)
		},
		setImageSize: function(a) {
			this.set("imageSize", a)
		},
		getImageSize: function() {
			return this.get("imageSize", null, !0)
		}
	});
	var ha = e.J.extend({
		Ua: [e.ba, e.$b],
		h: {
			coords: [],
			type: ""
		},
		j: function(a) {
			e.k.ua(this, a);
			this.Qd(this.h)
		}
	});
	var T = G.extend({
		h: {
			cursor: "pointer",
			visible: !0,
			zIndex: 100,
			angle: 0,
			autoRotation: !1,
			opacity: 1,
			offset: new e.F(-10, -34),
			size: new e.F(36, 36),
			raiseOnDrag: !1,
			topWhenClick: !1,
			topWhenMouseOver: !1,
			animation: "AMAP_ANIMATION_NONE"
		},
		j: function(a) {
			this.Ne = !0;
			e.k.ua(this, a);
			e.f.dc && (this.h.angle = 0);
			this.Qd(this.h);
			delete this.h
		},
		setRaiseOnDrag: function(a) {
			this.set("raiseOnDrag", a)
		},
		setPosition: function(a) {
			this.set("position", a)
		},
		getBounds: function() {
			var a = this.getPosition().Pa();
			return new e.Kb(a, a.Pa())
		},
		mapChanged: function() {
			this.get("map",
				null, !0) && (this.get("position", null, !0) || this.set("position", this.get("map").get("center")), this.get("map", null, !0).aq(this))
		},
		getPosition: function() {
			return this.get("position", null, !0)
		},
		setIcon: function(a) {
			this.set("icon", a)
		},
		getIcon: function() {
			return this.get("icon", null, !0)
		},
		setContent: function(a) {
			this.set("content", a)
		},
		getContent: function() {
			return this.get("content", null, !0)
		},
		hide: function() {
			this.set("visible", !1)
		},
		show: function() {
			this.set("visible", !0)
		},
		setCursor: function(a) {
			this.set("cursor",
				a)
		},
		setRotation: function(a) {
			e.f.dc || this.set("angle", a)
		},
		setAngle: function(a) {
			e.f.dc || "number" !== typeof a || this.set("angle", a)
		},
		getAngle: function() {
			return this.get("angle", null, !0)
		},
		setOffset: function(a) {
			this.set("offset", a)
		},
		getOffset: function() {
			return this.get("offset", null, !0)
		},
		setzIndex: function(a) {
			this.set("zIndex", a)
		},
		setOpacity: function(a) {
			this.set("opacity", a)
		},
		setDraggable: function(a) {
			this.set("draggable", a)
		},
		getDraggable: function() {
			return this.get("draggable", null, !0)
		},
		moveTo: function(a,
			b, c) {
			this.set("move", {
				Qb: a,
				speed: b,
				fb: c
			})
		},
		moveAlong: function(a, b, c, d) {
			this.set("move", {
				Qb: a,
				speed: b,
				fb: c,
				Lx: d
			})
		},
		stopMove: function() {
			this.set("move", !1)
		},
		setShadow: function(a) {
			this.set("shadow", a)
		},
		getShadow: function() {
			return this.get("shadow", null, !0)
		},
		setClickable: function(a) {
			a !== this.getClickable() && this.set("clickable", a)
		},
		getClickable: function() {
			return this.get("clickable", null, !0)
		},
		setTitle: function(a, b) {
			"string" === typeof a && this.set("title", a, b)
		},
		getTitle: function() {
			return this.get("title",
				null, !0)
		},
		setTop: function(a, b) {
			this.set("isTop", a, b)
		},
		getTop: function() {
			return this.get("isTop", null, !0)
		},
		setShape: function(a, b) {
			this.set("shape", a, b)
		},
		getShape: function() {
			return this.get("shape", null, !0)
		},
		setAnimation: function(a, b) {
			this.set("animation", a, b)
		},
		getAnimation: function() {
			return this.get("animation", null, !0)
		},
		getMap: function() {
			return this.get("map", null, !0)
		}
	});
	var B = G.extend({
		h: {
			visible: !1,
			items: []
		},
		j: function(a) {
			this.Ne = !0;
			e.k.ua(this, a);
			this.h.items = [];
			this.Qd(this.h)
		},
		addItem: function(a, b, c) {
			this.get("items").push({
				ft: a,
				fb: b,
				Zj: c
			});
			this.q("items")
		},
		removeItem: function(a, b) {
			var c = this.get("items"),
				d, f;
			for (f = 0; f < c.length; f += 1)
				if (d = c[f], d.ft === a && d.fb === b) {
					c.splice(f, 1);
					break
				}
			this.q("items")
		},
		open: function(a, b) {
			this.set("position", b);
			this.map ? this.map && this.map !== a && (this.map.gk(this), this.map = a, this.setMap(a)) : (this.map = a, this.setMap(a));
			this.q("open", {
				type: "open",
				target: this
			})
		},
		close: function() {
			this.setMap(null);
			this.map && (this.map = this.map.Gj = null, this.q("close", {
				type: "close",
				target: this
			}))
		}
	});
	var C = G.extend({
		h: {
			visible: !0,
			offset: new e.F(0, 0),
			showShadow: !1,
			closeWhenClickMap: !1,
			autoMove: !0
		},
		j: function(a) {
			this.Ne = !0;
			e.k.ua(this, a);
			this.Qd(this.h)
		},
		open: function(a, b) {
			a && (b && this.get("position", null, !0) !== b && this.q("change", {
				type: "change",
				target: this
			}), b = b || this.get("position", null, !0)) && (this.set("position", b), this.map || (this.map = a, this.setMap(a), this.q("open", {
				type: "open",
				target: this
			})))
		},
		close: function() {
			this.setMap(null);
			this.set("position", null, !0)
		},
		setContent: function(a) {
			this.set("content",
				a);
			this.q("change", {
				type: "change",
				target: this
			})
		},
		getContentU: function() {
			return this.get("content", null, !0)
		},
		getContent: function() {
			return this.get("content", null, !0)
		},
		setPosition: function(a) {
			this.set("position", a);
			this.q("change", {
				type: "change",
				target: this
			})
		},
		getPosition: function() {
			return this.get("position", null, !0)
		},
		setSize: function(a) {
			this.set("size", a);
			this.q("change", {
				type: "change",
				target: this
			})
		},
		getSize: function() {
			var a = this.get("size", null, !0);
			if (a) return a;
			if (this.Y) return new e.tc(this.Y.Dc.offsetWidth,
				this.Y.Dc.offsetHeight)
		},
		getIsOpen: function() {
			return !!this.get("map")
		}
	});
	var O = R.extend({
		h: {
			isOutline: !1,
			outlineColor: "#000000",
			geodesic: !1
		},
		j: function(a) {
			this.Ne = !0;
			a = a || {};
			a.zIndex = a.zIndex || 50;
			e.k.ua(this, a);
			this.setOptions(this.h)
		},
		getLength: function() {
			for (var a = this.get("path"), b = 0, c = 0; c < a.length - 1; c += 1) b += a[c].Fc(a[c + 1]);
			return parseFloat(b.toFixed(2))
		}
	});
	var P = R.extend({
		j: function(a) {
			this.Ne = !0;
			a = a || {};
			a.zIndex = a.zIndex || 10;
			e.k.ua(this, e.extend({
				fillColor: "#FFAA00",
				fillOpacity: 0.9
			}, a));
			this.setOptions(this.h)
		},
		rm: function(a) {
			var b = 6378137 * Math.PI / 180,
				c = 0,
				d = a.length;
			if (3 > d) return 0;
			for (var f = 0; f < d - 1; f += 1) var g = a[f],
				h = a[f + 1],
				c = c + (g.A * b * Math.cos(g.D * Math.PI / 180) * h.D * b - h.A * b * Math.cos(h.D * Math.PI / 180) * g.D * b);
			d = a[f];
			a = a[0];
			c += d.A * b * Math.cos(d.D * Math.PI / 180) * a.D * b - a.A * b * Math.cos(a.D * Math.PI / 180) * d.D * b;
			return 0.5 * Math.abs(c)
		},
		getArea: function() {
			var a = this.get("path",
					null, !0),
				b;
			if (!a.length || a[0] instanceof e.t) b = this.rm(a);
			else {
				b = this.rm(a[0]);
				for (var c = 1; c < a.length; c += 1) b -= this.rm(a[c])
			}
			return Number(b.toFixed(2))
		},
		toString: function() {
			return this.get("path").join(";")
		}
	});
	var Q = ga.extend({
		h: {
			visible: !0,
			zIndex: 10,
			strokeColor: "#006600",
			strokeOpacity: 0.9,
			strokeWeight: 3,
			strokeStyle: "solid",
			strokeDasharray: [10, 5],
			radius: 1E3,
			fillColor: "#006600",
			fillOpacity: 0.9
		},
		j: function(a) {
			a = a || {};
			a.zIndex = a.zIndex || 10;
			e.k.ua(this, a);
			this.Ne = this.h.center ? !0 : !1;
			this.setOptions(this.h)
		},
		setCenter: function(a, b) {
			a && a instanceof e.t && (this.set("center", a), this.q("change", {
				type: "change",
				target: this
			}), this.Ne || (this.Ne = !0, this.get("map") && this.get("map").q("overlays")), b || this.q("setCenter"))
		},
		getCenter: function() {
			return this.get("center", null, !0)
		},
		setRadius: function(a, b) {
			this.set("radius", a);
			this.q("change", {
				type: "change",
				target: this
			});
			b || this.q("setRadius")
		},
		getRadius: function() {
			return this.get("radius", null, !0)
		},
		getBounds: function() {
			var a = this.get("center"),
				b = this.get("radius");
			if (!a) return null;
			var c = a.offset(-b, -b),
				a = a.offset(b, b);
			return new e.Kb(c, a)
		}
	});
	Q.Jd({
		wb: "getBounds"
	});
	e.ye = e.J.extend({
		Ua: e.ba,
		h: {
			swfUrl: e.o.ga + "/theme/v1.3/",
			dataServerUrl: "wsv.amap.com",
			imageServerUrl: "wsv.amap.com",
			poiServerUrl: "wsv.amap.com",
			position: null,
			distance: 150,
			heading: 20,
			pitch: -5,
			zoom: 3,
			visible: !0,
			pov: {
				heading: 20,
				pitch: -5
			},
			checkType: 0,
			reportLabel: !1,
			closeLabel: !1,
			systemLabel: !0,
			panControl: !0,
			zoomControl: !0,
			scrollWheel: !0,
			linksControl: !0,
			fullscreenLabel: !0,
			addressControl: !0
		},
		j: function(a, b) {
			e.k.ua(this, b);
			this.qb = this.w = null;
			this.fh = {};
			this.gs = "AngeoPano";
			this.sf = "";
			this.position = null;
			this.heading = 20;
			this.pitch = -5;
			this.bk = {
				heading: 20,
				pitch: -5
			};
			this.dg = 0;
			this.Lm = "panoEngineContent";
			this.file = this.h.swfUrl + "swf/PreLoader.swf?swfurl=" + this.h.swfUrl + "swf/AnGeoPanoEngine.swf&iconUrl=" + this.h.swfUrl + "icons.json&swfid=" + this.Lm;
			this.width = this.h.width || "100%";
			this.height = this.h.height || "100%";
			this.version = this.h.version || "";
			var c = window.location.protocol;
			if (-1 === c.indexOf("http") && -1 === c.indexOf("https")) throw "\u62b1\u6b49,\u8be5\u9875\u9762\u5fc5\u987b\u901a\u8fc7web\u670d\u52a1\u5668\u624d\u80fd\u6b63\u5e38\u8bbf\u95ee!";
			this.w = c = document.getElementById(a);
			if (!c) throw "\u5730\u56fe\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5web\u9875\u9762\u4e2d\u662f\u5426\u5b58\u5728ID\u4e3a" + a + "\u7684\u6807\u7b7e";
			if (this.wu(c)) {
				var d = this;
				window.AnGeoPanoComplete = function() {
					d.jv(d)
				};
				this.jx(c)
			}
		},
		wu: function(a) {
			var b = e.k.Gx(),
				c = b.sz,
				b = b.version;
			isNaN(b) ? (b = b.split("."), b = Number(b[0] + "." + b[1])) : b = Number(b);
			return !c || 11.4 > b || 11.7 === b ? (a.innerHTML = '<div style="width:450px;margin:auto;padding:5px;text-algin:center;text-indent:0px; font-size:14px; color:#0000ff;">\u52a0\u8f7d\u5730\u56fe\u5931\u8d25\uff0c\u8bf7\u5b89\u88c511.4\u53ca\u4ee5\u4e0a\uff0811.7\u9664\u5916\uff09\u7248\u672c\u7684Adobe Flash Player\uff01<a href="http://get.adobe.com/cn/flashplayer/" style="color:#ff0000;">\u70b9\u51fb\u4e0b\u8f7d</a>\uff0c\u5b89\u88c5\u540e\uff0c\u518d\u5237\u65b0\u8be5\u9875\u9762\u3002</div>', !1) : !0
		},
		jx: function(a) {
			var b = this.Lm,
				c = e.f.le ? b : b + "_ie",
				d = e.f.le ? b + "_ff" : b,
				f;
			f = '<object type="application/x-shockwave-flash" style="height:100%;width:100%;"  height="100%" width="100%" ';
			f += ' id="' + b + '" data="' + this.file + '" name="' + c + '" ';
			e.f.le && (f += ' codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"');
			f += " >";
			e.f.le && (f += '<param name="movie" value="' + this.file + '" />');
			f += '<param name="quality" value="high" />';
			f +=
				'<param name="wmode" value="direct"/>';
			f += '<param name="allowScriptAccess" value="always" />';
			f += '<param name="allowFullScreen" value="true" />';
			f += '<param name="allowFullScreenInteractive" value="true" />';
			f += '<param name="FlashVars" value="' + this.version + '" />';
			e.f.chrome || (f += '<embed src="' + this.file + '" quality="high"', f += ' width="' + this.width + '" height="' + this.height + '" id="' + d + '" align="middle"', f += ' play="true"', f += ' loop="false"', f += ' quality="high"', f += ' wmode="direct"', f += ' FlashVars="' +
				this.version + '"', f += ' allowScriptAccess="always"', f += ' allowFullScreen="true"', f += ' allowFullScreenInteractive="true"', f += ' type="application/x-shockwave-flash"', f += ' pluginspage="http://www.adobe.com/go/getflashplayer">', f += "</embed>");
			f += "</object>";
			a.innerHTML = f
		},
		jv: function(a) {
			try {
				var b = e.d.get(a.Lm);
				a.qb = b;
				b.angeoPanoInit(a.gs, this.h);
				this.h.panoId ? a.mk(this.h.panoId) : this.h.position && a.Di(this.h.position);
				a.Is(this.h.pov);
				a.hn(this.heading);
				a.Hs(this.pitch);
				a.Ks(this.h.zoom);
				a.Gs(this.h.distance);
				a.Js(this.h);
				a.nk(this.h.visible);
				a.Xw("key=" + e.o.key + "&requestType=api");
				a.oz()
			} catch (c) {
				a.kv(a.w)
			}
		},
		Xw: function(a) {
			this.qb.angeoPanoSetURLAttach(a)
		},
		kv: function(a) {
			a.innerHTML = '<div style="width:400px;margin:auto;padding:5px;text-algin:center;text-indent:0px; font-size:14px; color:#0000ff;">\u52a0\u8f7d\u5730\u56fe\u5931\u8d25</div>';
			throw Error("\u52a0\u8f7d\u5730\u56fe\u5931\u8d25!");
		},
		mk: function(a) {
			this.qb.angeoPanoSetPanoById(this.gs, a, {});
			this.sf = a
		},
		qm: function() {
			return this.sf
		},
		Es: function(a) {
			var b =
				a.getLng();
			a = a.getLat();
			this.qb.angeoPanoSetPanoByCenter(this.name, b, a)
		},
		Di: function(a) {
			this.Es(a)
		},
		ie: function() {
			return this.$g()
		},
		$g: function() {
			return this.position
		},
		Ks: function(a) {
			var b = this.qb;
			0 <= a && b.angeoPanoSetZoomLevel(a);
			this.q("zoomchange")
		},
		fr: function() {
			return this.qb.angeoPanoGetZoomLevel()
		},
		hn: function(a) {
			a = Number(a);
			if (isNaN(a) || 0 > a || 360 < a) a = this.heading;
			this.qb.angeoPanoSetHeading(a);
			this.heading = a
		},
		om: function() {
			return this.heading
		},
		Hs: function(a) {
			a = Number(a);
			if (isNaN(a) || -85 > a ||
				10 < a) a = this.pitch;
			this.qb.angeoPanoSetPitch(a);
			this.pitch = a
		},
		Ry: function() {
			return this.pitch
		},
		Ju: function(a, b, c) {
			if ("object" === typeof a) {
				var d = a.pitch;
				if (isNaN(d) || d > (c || 10) || d < (b || -85)) d = this.pitch;
				a.pitch = d;
				b = a.heading;
				if (isNaN(b) || 0 > b || 360 < b) b = this.heading;
				a.heading = b;
				return a
			}
		},
		Is: function(a) {
			var b = {};
			a = this.Ju(a);
			this.qb.angeoPanoSetHeadingAndPitch(a.heading, a.pitch);
			this.heading = a.heading;
			this.pitch = a.pitch;
			this.bk = a;
			b.type = "povchange";
			b.pov = a;
			b.target = this;
			this.q("povchange", b)
		},
		Sy: function() {
			return this.bk
		},
		Gs: function(a) {
			if (isNaN(a) || 0 > a) throw "\u8ddd\u79bb\u4e0d\u80fd\u4e3a\uff1a" + a + "\uff0c\u5fc5\u987b\u4e3a\u6570\u5b57\uff01";
			this.qb.angeoPanoSetPOIDisplayDistance(Number(a));
			this.dg = a
		},
		Py: function() {
			return this.dg
		},
		nk: function(a) {
			void 0 !== a && (this.qb.style.visibility = a ? "visible" : "hidden", this.q("visiblechange"), this.visible = a)
		},
		tm: function() {
			return this.visible
		},
		Js: function(a) {
			var b = this.qb,
				c = {};
			e.k.ua(this, a);
			c = this.h;
			b.angeoPanoEnabledMouseWheel(c.scrollWheel);
			b.angeoPanoSetCompassVisble(c.panControl,
				c.zoomControl);
			b.angeoPanoDisplayArrows(c.linksControl);
			b.angeoPanoDisplayScreenButton(c.fullscreenLabel);
			b.angeoPanoDisplayRoadName(c.addressControl);
			b.angeoPanoDisplayReportProblem(c.reportLabel);
			b.angeoPanoDisplayExitButton(c.closeLabel);
			b.angeoPanoDisplaySystemPOIs(c.systemLabel)
		},
		Vy: function() {},
		My: function() {
			var a = this.qb.angeoPanoGetPanoRefPoints(),
				b = [],
				c = null,
				d = null,
				f, g;
			for (f = 0; f < a.length; f += 1) {
				d = a[f];
				c = {};
				for (g in d) d.hasOwnProperty(g) && (c[g] = d[g]);
				c.fc = d.id;
				c.description = d.CE;
				b.push(c)
			}
			return b
		},
		Dz: function(a) {
			var b = this.qb,
				c = Number(a.getLng());
			a = Number(a.getLat());
			b = b.angeoPanoGetPixelByCoordinate({
				lat: a,
				lng: c
			});
			return new e.F(b.x, b.y)
		},
		jn: function() {},
		qB: function() {
			this.jn(!0)
		},
		gz: function() {
			this.jn(!1)
		},
		ln: function(a) {
			this.qb.angeoPanoSetTriangleVisble(a || !1)
		},
		sB: function() {
			this.ln(!0)
		},
		hz: function() {
			this.ln(!1)
		},
		hA: function() {},
		Px: function() {},
		clear: function() {
			this.qb.angeoPanoClearPOIs();
			this.fh = {}
		},
		hy: function() {
			this.qb.angeoPanoDispose()
		},
		mA: function(a, b, c) {
			var d = {
				type: b,
				target: c
			};
			switch (b) {
				case "panochange":
					return c.sf = a.panoId, c.position = new e.t(a.x, a.y), c.nc("complete") && (c.q("complete"), e.event.clearListeners(c, "complete")), "function" === typeof c.h.callback && (c.h.callback(c), c.h.callback = null), "object" === typeof a ? d = e.extend(d, a) : d.obj = a, d;
				case "pitchchange":
					return d.type = "povchange", d.pov = {}, d.pov.pitch = a, d.pov.heading = c.heading, c.pitch = d.pov.pitch, c.bk = d.pov, d;
				case "headingchange":
					return d.type = "povchange", d.pov = {}, d.pov.heading = (a % 360 + 360) % 360, d.pov.pitch = c.pitch, c.heading =
						d.pov.heading, c.bk = d.pov, d;
				case "povchange":
					return d.type = "_povchange", d.pov = {
						heading: c.heading,
						pitch: c.pitch
					}, d;
				case "reportLabelClick":
					return d.panoId = c.sf, d.viewBounds = {
						minx: a.left,
						miny: a.top,
						maxx: a.right,
						maxy: a.bottom
					}, d;
				case "closeLabelClick":
					return d;
				case "mouseover":
				case "mouseout":
				case "click":
					return "custom" === a.type ? (d.target = c.fh[a.id], d.viewBounds = {
						minx: a.poiLeft,
						miny: a.poiTop,
						maxx: a.poiRight,
						maxy: a.poiBottom
					}) : (d.type = "systemLabel" + b.charAt(0).toUpperCase() + b.substring(1), d.target = c, d.panoId =
						a.panoId, d.poiId = a.id, d.poiName = a.name, d.viewBounds = {
							minx: a.poiLeft,
							miny: a.poiTop,
							maxx: a.poiRight,
							maxy: a.poiBottom
						}, d.lngLat = new e.t(a.lng, a.lat), d.pixel = new e.F(a.x, a.y)), d;
				default:
					return "object" === typeof a ? d = e.extend(d, a) : d.obj = a, d
			}
		},
		oz: function() {
			e.ye.ba = e.ye.ba || {};
			var a = this,
				b, c = {
					panochange: "ChangePano",
					headingchange: "HeadingChangeCall",
					pitchchange: "PitchChangeCall",
					zoomchange: "ZoomChangeCall",
					click: "POIClick",
					mouseover: "POIOver",
					mouseout: "POIOut",
					closeLabelClick: "ExitCall",
					povchange: "HeadingAndPitchChangeCall",
					reportLabelClick: "ReportCall"
				};
			for (b in c)
				if (c.hasOwnProperty(b)) {
					var d = c[b];
					e.ye.ba[b] = function(b) {
						return function(c) {
							c = a.mA(c, b, a);
							c.target.q(c.type, c)
						}
					}(b);
					if (d) a.qb["angeoPanoSet" + d + "JSFun"]("AMap.Panorama.Events." + b)
				}
		}
	});
	e.ye.Jd({
		mk: "setPanoId",
		qm: "getPanoId",
		Es: "setCenter",
		ie: "getCenter",
		Di: "setPosition",
		$g: "getPosition",
		Ks: "setZoom",
		fr: "getZoom",
		hn: "setHeading",
		om: "getHeading",
		Hs: "setPitch",
		Ry: "getPitch",
		JE: "setMaxPitch",
		KE: "setMinPitch",
		Is: "setPov",
		Sy: "getPov",
		Gs: "setPOIDisplayDistance",
		Py: "getPOIDisplayDistance",
		nk: "setVisible",
		tm: "getVisible",
		Js: "setStatus",
		Vy: "getStatus",
		My: "getLinks",
		Dz: "lnglatTocontainer",
		jn: "setMoveArrowVisble",
		qB: "showMoveArrow",
		gz: "hideMoveArrow",
		ln: "setTipArrowVisble",
		sB: "showTipArrow",
		hz: "hideTipArrow",
		hA: "openFullScreen",
		Px: "closeFullScreen",
		clear: "clear",
		m: "trigger",
		hy: "dispose"
	});
	e.k = e.extend(e.k, {
		Tq: function(a, b, c, d) {
			b = Math.acos((d - b) / Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2)));
			0 > c - a && (b = 2 * Math.PI - b);
			return b / Math.PI * 180
		},
		Dy: function(a, b, c, d) {
			b = b * Math.PI / 180;
			d = d * Math.PI / 180;
			a = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((b - d) / 2), 2) + Math.cos(b) * Math.cos(d) * Math.pow(Math.sin((a * Math.PI / 180 - c * Math.PI / 180) / 2), 2)));
			return a = Math.round(63781370 * a) / 1E4 * 1E3
		},
		Gx: function() {
			var a = 0,
				b = "0",
				c = null;
			if (e.f.le) {
				if (c = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash")) a = 1, b = c.GetVariable("$version").split(" ")[1].replace(/,/g,
					".")
			} else if (navigator.plugins && 0 < navigator.plugins.length && (c = navigator.plugins["Shockwave Flash"]))
				for (var a = 1, c = c.description.split(" "), d = 0; d < c.length; d += 1) isNaN(parseInt(c[d], 10)) || (b = c[d]);
			return {
				sz: a,
				version: b
			}
		},
		YD: function(a) {
			var b = document.createElement("script");
			b.type = "text/javascript";
			b.src = a;
			document.body.appendChild(b)
		}
	});
	e.ye.ba = e.ye.ba || {};
	e.Mn = e.J.extend({
		Ua: e.ba,
		h: {
			id: e.k.Ya(this),
			panoId: "",
			position: null,
			content: "",
			distance: 0,
			heading: 0,
			icon: "",
			pano: null,
			iconType: "6",
			visible: !0,
			eventNameMap: {
				click: "mouse_click",
				mouseover: "mouse_over",
				mouseout: "mouse_out"
			}
		},
		j: function(a) {
			if (!a.position) throw "\u7f3a\u5c11position\uff0c\u8bf7\u6307\u5b9a";
			e.k.ua(this, a);
			this.id = this.h.id;
			this.sf = this.h.panoId;
			this.fc = this.h.pano;
			this.position = this.h.position;
			this.content = this.h.content;
			this.dg = this.h.distance;
			this.heading = this.h.heading;
			this.vm = this.h.icon;
			this.wm = this.h.iconType;
			this.visible = this.h.visible;
			this.ty = this.h.eventNameMap;
			this.fc instanceof e.ye && this.Rc(this.fc)
		},
		Jy: function() {
			return this.id
		},
		qm: function() {
			return this.sf
		},
		mk: function(a) {
			this.Rc();
			this.sf = a;
			this.Rc(this.fc)
		},
		pm: function() {
			var a = null;
			this.fc && (a = this.fc);
			return a
		},
		Rc: function(a) {
			if (a)
				if (a.fh[this.id] && a.fh[this.id].visible && this.ls) a.qb.angeoPanoAddPOIS(this.ls);
				else {
					var b = this.position.getLng(),
						c = this.position.getLat(),
						d = a.position;
					this.heading = e.k.Tq(d.getLng(), d.getLat(),
						b, c);
					this.dg = e.k.Dy(d.getLng(), d.getLat(), b, c);
					this.ls = b = [{
						id: this.id,
						panoId: this.sf,
						distance: this.dg,
						name: this.content,
						x: b,
						y: c,
						iconType: this.wm,
						iconUrl: this.vm
					}];
					this.visible && a.qb.angeoPanoAddPOIS(b);
					this.fc = a;
					a.fh[this.id] = this
				} else this.id && this.fc && (this.fc.qb.angeoPanoRemovePOI(this.id), delete this.fc.fh[this.id])
		},
		Di: function(a) {
			this.Rc();
			this.position = a;
			this.Rc(this.fc)
		},
		$g: function() {
			return this.position
		},
		jB: function(a) {
			this.Rc();
			this.content = a;
			this.Rc(this.fc)
		},
		zy: function() {
			return this.content
		},
		mB: function(a) {
			this.Rc();
			this.wm = a;
			this.Rc(this.fc)
		},
		Iy: function() {
			return this.wm
		},
		lB: function(a) {
			this.Rc();
			this.vm = a;
			this.Rc(this.fc)
		},
		Yg: function() {
			return this.vm
		},
		om: function() {
			var a = this.fc.position,
				b = this.position;
			return this.heading = a = e.k.Tq(a.getLng(), a.getLat(), b.getLng(), b.getLat())
		},
		nk: function(a) {
			this.visible !== a && ((this.visible = a) ? this.Rc(this.fc) : this.Rc())
		},
		tm: function() {
			return this.visible
		},
		q: function(a, b) {
			b = b || {};
			b.target && b.viewBounds ? e.ba.q.call(this, a, b) : this.fc.qb.angeoPanoTriggerPOIEvent(this.id,
				this.ty[a])
		}
	});
	e.Mn.Jd({
		Rc: "setPano",
		pm: "getPano",
		Jy: "getId",
		mk: "setPanoId",
		qm: "getPanoId",
		Di: "setPosition",
		$g: "getPosition",
		jB: "setContent",
		zy: "getContent",
		mB: "setIconType",
		Iy: "getIconType",
		lB: "setIcon",
		Yg: "getIcon",
		hn: "setHeading",
		om: "getHeading",
		nk: "setVisible",
		tm: "getVisible"
	});
	e.Nn = e.J.extend({
		Ua: e.ba,
		h: {
			dataServerUrl: e.o.Jc + "://wsv.amap.com",
			param: 0.00274658203125
		},
		j: function(a) {
			e.k.ua(this, a);
			this.Ci = this.h.dataServerUrl
		},
		yC: function(a, b) {
			this.Td = "";
			this.x = [];
			this.y = [];
			var c = [],
				d, f;
			"[object Array]" === Object.prototype.toString.call(a) ? c = a : c.push(a);
			this.Fm = c;
			d = 0;
			for (f = c.length; d < f; d += 1) this.x[d] = c[d].getLng() / this.h.param, this.y[d] = c[d].getLat() / this.h.param, this.Td += this.x[d] + "," + this.y[d] + ";";
			this.Td = this.Td.slice(0, -1);
			var g = this.Ci + "/AnGeoPoitopanoServer?data=vector&xys=" +
				this.Td + "&radius=" + Number(b) + "&type=nearestpanos",
				h = this;
			e.$.load("http", function() {
				var a = new e.T.ca(g, {
					callback: "callback"
				});
				a.a("complete", h.Nm, h);
				a.a("error", h.ea, h)
			})
		},
		pm: function(a, b) {
			this.Td = "";
			this.x = [];
			this.y = [];
			var c = [],
				d, f;
			"[object Array]" === Object.prototype.toString.call(a) ? c = a : c.push(a);
			this.Fm = c;
			d = 0;
			for (f = c.length; d < f; d += 1) this.x[d] = c[d].getLng() / this.h.param, this.y[d] = c[d].getLat() / this.h.param, this.Td += this.x[d] + "," + this.y[d] + ";";
			this.Td = this.Td.slice(0, -1);
			var g = this.Ci + "/AnGeoPoitopanoServer?xys=" +
				this.Td + "&radius=" + Number(b) + "&type=nearestpanos",
				h = this;
			e.$.load("http", function() {
				var a = new e.T.ca(g, {
					callback: "callback"
				});
				a.a("complete", h.Ba, h);
				a.a("error", h.ea, h)
			})
		},
		Qy: function(a) {
			var b = this.Ci + "/AnGeoPanoramaServer?data=vector&charset=utf-8&id=" + a,
				c = this;
			e.$.load("http", function() {
				var a = new e.T.ca(b, {
					callback: "callback"
				});
				a.a("complete", c.tv, c);
				a.a("error", c.ea, c)
			})
		},
		tv: function(a) {
			var b = {};
			(a = a.PosInfo) ? (b.info = "OK", b.panoId = a.id, b.lnglat = new e.t(a.lon_road, a.lat_road), b.description = a.roadname) :
				b.info = "NO_RESULT";
			this.q("complete", b)
		},
		Ba: function(a) {
			var b = [],
				c, d, f, g;
			f = 0;
			for (g = this.Fm.length; f < g; f += 1)
				if (d = {}, a[this.x[f] + "," + this.y[f]]) {
					if (c = a[this.x[f] + "," + this.y[f]].StreetInfo) d.panoId = c.panoid, d.thumbnail = c.url, d.description = c.roadname, b.push(d)
				} else d = null, b.push(d);
			this.q("complete", {
				info: "OK",
				panoInfo: b
			})
		},
		Nm: function(a) {
			var b = [],
				c, d, f, g;
			f = 0;
			for (g = this.Fm.length; f < g; f += 1) {
				d = {};
				if (a.PosInfo) {
					if (c = a.PosInfo) d.panoId = c.id, d.description = c.roadname, d.heading = c.heading, d.lngLat = new e.t(c.lon_road,
						c.lat_road)
				} else d = null;
				b.push(d)
			}
			this.q("complete", {
				info: "OK",
				panoInfo: b
			})
		},
		ea: function(a) {
			this.q("error", {
				info: "SERVICE_UNAVAILABLE",
				panoInfo: a
			})
		}
	});
	e.Nn.Jd({
		Qy: "getPanoById",
		pm: "getPano"
	});
	A.Ln = A.extend({
		h: {
			transparency: !0,
			getTileUrl: e.o.Jc + "://websv.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]",
			zIndex: 7,
			type: "overlayer"
		}
	});
	var U = {
		Pixel: e.F,
		LngLat: e.t,
		Size: e.tc,
		Bounds: e.Kb,
		PixelBounds: e.Bh,
		event: J,
		Panorama: e.ye,
		PanoramaLayer: A.Ln,
		PanoramaService: e.Nn,
		PanoramaMarker: e.Mn,
		Map: H,
		View2D: ca,
		GroundImage: D,
		Marker: T,
		ImageMarker: aa.gC,
		Text: aa.mC,
		Icon: S,
		MarkerShape: ha,
		Polyline: O,
		Polygon: P,
		Circle: Q,
		ContextMenu: B,
		InfoWindow: C,
		Buildings: ea,
		TileLayer: A,
		ImageLayer: fa,
		VectorTile: da,
		VectorLayer: N,
		CANVAS: "canvas",
		DOM: "dom"
	};
	U.plugin = H.prototype.plugin;
	U.TileLayer.Satellite = A.Sn;
	U.TileLayer.RoadNet = A.Qn;
	U.TileLayer.Traffic = A.Un;
	U.Panorama.Events = e.ye.ba;
	U.TileLayer.PanoramaLayer = A.Ln;
	window.AMap = U;
	var ja = window[e.o.Zh];
	ja ? ja() : document.body || setTimeout(function() {
		var a = window[e.o.Zh];
		a && a()
	}, 100);
	if ("undefined" !== typeof arguments && arguments.callee) try {
		if (e.f.Im && window.localStorage) {
			var ka = window.localStorage._AMap_main;
			ka && JSON.parse(ka).version === e.o.vk || window.localStorage.setItem("_AMap_main", JSON.stringify({
				script: "(" + arguments.callee + ")()",
				version: e.o.vk
			}))
		}
	} catch (la) {};
})()