(function(g) {
	/* global require:false, define:false, jQuery:false, importScripts:false */
	var hasRequire, hasJquery, hasImport, accessToken,
	basePath = "//behance.net/v2/",
	toString = Object.prototype.toString,
	isFunc = function(fn) { return toString.call(fn) === "[object Function]"; };

	function cachebuster() {
		cachebuster.prefix = cachebuster.prefix || 0;
		return (cachebuster.prefix++) + String(Math.random()).slice(1);
	}

	function parameterize(data) {
		var k, p = [];
		for (k in data) if (data.hasOwnProperty(k)) {
			p.push(k + '=' + data[k]);
		}
		return p;
	}

	function path(ext, param) {
		return basePath + ext + '?' + parameterize(param).join('&');
	}

	// Check that dynamic require/define pair exists (mostly for almond)
	hasRequire = (
		typeof require !== "undefined" &&
		typeof define !=="undefined" &&
		isFunc(define) &&
		isFunc(require) &&
		isFunc(require.toUrl) &&
		require.toUrl(basePath) === basePath
	);

	// Check for jQuery for its .ajax() method
	hasJquery = (
		typeof jQuery !== "undefined" &&
		isFunc(jQuery) &&
		isFunc(jQuery.ajax)
	);

	// Check for Web Worker context
	hasImport = (
		typeof importScripts !== "undefined" &&
		isFunc(importScripts)
	);

	// Normalize our JSONP methods (ext, param, callback)
	var get = (function() {
		if (hasRequire) {
			return function rGet(ext, param, callback) {
				param.callback = 'define';
				param._ = cachebuster();
				require([path(ext, param)], callback);
			};
		}
		if (hasJquery) {
			return function jGet(ext, param, callback) {
				jQuery.ajax({
					url: path(ext, param),
					dataType: 'jsonp',
					success: callback
				});
			};
		}
		if (hasImport) {
			return function iGet(ext, param, callback) {
				param._ = cachebuster();
				param.callback = 'b' + param._;
				g[param.callback] = callback;
				importScripts(path(ext, param));
			}
		}
	}());

	/**
	 * Main API
	 */
	var be = {
	};

	// AMD shim
	if (typeof define === "function" && define.amd) {
		define("be", be);
	}
	else {
		g.be = be;
	}

}(this));
