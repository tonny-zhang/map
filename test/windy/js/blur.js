function blur(a, b, c, d) {
	d = d || 3, d |= 0;
	var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s = b - 1,
		t = c - 1,
		u = d + 1,
		v = mul_table[d],
		w = shg_table[d],
		x = b * c;
	if (x > rArray.length) try {
		rArray = new Uint16Array(x), gArray = new Uint16Array(x), bArray = new Uint16Array(x)
	} catch (y) {
		try {
			rArray = new Array(x), gArray = new Array(x), bArray = new Array(x)
		} catch (y) {
			rArray = [], gArray = [], bArray = []
		}
	}
	if (x = Math.max(b, c), x > vminArray.length) try {
		vminArray = new Uint32Array(x), vmaxArray = new Uint32Array(x)
	} catch (y) {
		try {
			vminArray = new Array(x), vmaxArray = new Array(x)
		} catch (y) {
			vminArray = [], vmaxArray = []
		}
	}
	var z = (1e7 * v >>> w) / 1e7;
	p = o = 0;
	h = 0;
	var j, h, k, l, m, A, B = vminArray,
		C = vmaxArray,
		D = rArray,
		E = gArray,
		F = bArray,
		G = a.data;
	for (q = 0; b > q; q++) B[q] = ((k = q + u) < s ? k : s) << 2, C[q] = (k = q - d) > 0 ? k << 2 : 0;
	for (i = 0; c > i; i++) {
		for (e = G[p] * u, f = G[p + 1] * u, g = G[p + 2] * u, j = 1; d >= j; j++) k = p + ((j > s ? s : j) << 2), e += G[k], f += G[k + 1], g += G[k + 2];
		for (h = 0; b > h; h++) D[o] = e, E[o] = f, F[o] = g, l = p + B[h], m = p + C[h], e += G[l] - G[m], f += G[l + 1] - G[m + 1], g += G[l + 2] - G[m + 2], o++;
		p += b << 2
	}
	for (r = 0; c > r; r++) B[r] = ((k = r + u) < t ? k : t) * b, C[r] = (k = r - d) > 0 ? k * b : 0;
	for (h = 0; b > h; h++) {
		for (n = h, e = D[n] * u, f = E[n] * u, g = F[n] * u, j = 1; d >= j; j++) n += j > t ? 0 : b, e += D[n], f += E[n], g += F[n];
		for (o = h << 2, A = b << 2, i = 0; c > i; i++) G[o] = e * z, G[o + 1] = f * z, G[o + 2] = g * z, l = h + B[i], m = h + C[i], e += D[l] - D[m], f += E[l] - E[m], g += F[l] - F[m], o += A
	}
	return a
}
var mul_table = [1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107, 3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133],
	shg_table = [0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18, 16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20, 20],
	rArray = [],
	gArray, bArray, vminArray = [],
	vmaxArray;
self.onmessage = function(a) {
	postMessage(blur(a.data.imageData, a.data.width, a.data.height, a.data.radius))
};