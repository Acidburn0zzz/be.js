(function(g) {
	/* global require:false, define:false, jQuery:false, importScripts:false */
	var hasRequire, hasJquery, hasImport, apiKey, get,
	basePath = "http://behance.net/v2/",
	toString = Object.prototype.toString,
	isFunc = function(fn) { return toString.call(fn) === "[object Function]"; };

	function cachebuster() {
		cachebuster.prefix = cachebuster.prefix || 0;
		return (cachebuster.prefix++) + String(Math.random()).slice(2);
	}

	function parameterize(data) {
		var k, p = [];
		for (k in data) if (data.hasOwnProperty(k)) {
			p.push(k + '=' + data[k]);
		}
		return p;
	}

	function path(ext, param) {
		param.api_key = apiKey;
		return basePath + ext + '?' + parameterize(param).join('&');
	}

	// Find an API key from global variables
	if ("behance_api_key" in g) {
		apiKey = g.behance_api_key;
	}

	////////////
	// JS API //
	////////////

	/**
	 * @exports be
	 */
	var be = function be(api) {
		apiKey = typeof api === "string" ?
		   (api || apiKey) :
		   apiKey;
		return be;
	};

	/**
	 * Get the information and content of a project.
	 *
	 * @param {number} id Project ID
	 * @param {function} callback
	 */
	be.project = function(id, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		var ext = "projects/" + id;
		get(ext, callback);
		return be;
	};

	/**
	 * Get comments for a project.
	 *
	 * @param {number} id Project ID
	 * @param {object=} param Request parameters
	 * @param {function} callback
	 */
	be.project.comments = function(id, param, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		var ext = "projects/" + id + "/comments";
		get(ext, param, callback);
		return be;
	};

	/**
	 * Search for a project.
	 *
	 * @param {string|object} param Search parameters
	 * @param {function} callback
	 */
	be.project.search = function(param, callback) {
		param = typeof param === "object" ?
			param :
			{q: param};
		var ext = "projects";
		get(ext, param, callback);
		return be;
	};

	be.wip = function(id, rev, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		if (isFunc(rev)) {
			callback = rev;
		}
		var ext = "wips/" + id;
		if ((rev|=0) && rev > 0) {
			ext += '/' + rev;
		}
		get(ext, callback);
		return be;
	};

	be.wip.search = function(param, callback) {
		param = typeof param === "object" ?
			param :
			{q: param};
		var ext = "wips";
		get(ext, param, callback);
		return be;
	};

	be.fields = function(callback) {
		var ext = "fields";
		get(ext, callback);
		return be;
	};

	be.follow = function(param, callback) {
		var ext = "creativestofollow";
		get(ext, param, callback);
		return be;
	};

	be.collection = function(id, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		var ext = "collections/" + id;
		get(ext, callback);
		return be;
	};

	be.collection.search = function(param, callback) {
		param = typeof param === "object" ?
			param :
			{q: param};
		var ext = "collections";
		get(ext, param, callback);
		return be;
	};

	be.collection.projects = function(id, param, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		var ext = "collection/" + id + "/projects";
		get(ext, param, callback);
		return be;
	};

	be.user = function(id, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id;
		get(ext, callback);
		return be;
	};

	be.user.projects = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/projects";
		get(ext, param, callback);
		return be;
	};

	be.user.wips = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/wips";
		get(ext, param, callback);
		return be;
	};

	be.user.appreciations = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/appreciations";
		get(ext, param, callback);
		return be;
	};

	be.user.collections = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/collections";
		get(ext, param, callback);
		return be;
	};

	be.user.stats = function(id, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/stats";
		get(ext, callback);
		return be;
	};

	be.user.followers = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/followers";
		get(ext, param, callback);
		return be;
	};

	be.user.following = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
			var ext = "users/" + id + "/following";
		get(ext, param, callback);
		return be;
	};

	be.user.feedback = function(id, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
			var ext = "users/" + id + "/feedback";
		get(ext, callback);
		return be;
	};

	be.user.workExperience = function(id, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
			var ext = "users/" + id + "/work_experience";
		get(ext, callback);
		return be;
	};

	be.user.search = function(param, callback) {
		param = typeof param === "object" ?
			param :
			{q: param};
		var ext = "users";
		get(ext, param, callback);
		return be;
	};

	//////////////////////////
	// JSONP Implementation //
	//////////////////////////

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
	get = function get(ext, param, callback) {
		// Memoize the actual implementation
		get.raw = get.raw || (function() {
			if (hasRequire) {
				return function(ext, param, callback) {
					param.callback = "define";
					param._ = cachebuster();
					require([path(ext, param)], callback);
				};
			}
			if (hasJquery) {
				return function(ext, param, callback) {
					jQuery.ajax({
						url: path(ext, param),
						dataType: "jsonp",
						success: callback
					});
				};
			}
			if (hasImport) {
				return function(ext, param, callback) {
					param._ = cachebuster();
					param.callback = 'b' + param._;
					g[param.callback] = function() {
						try { callback.apply(g, arguments); }
						catch(e) {}
						finally {
							g[param.callback] = undefined;
						}
					};
					importScripts(path(ext, param));
				};
			}

			// Native implementation
			var head = document.getElementsByTagName("head")[0];
			return function(ext, param, callback) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				param._ = cachebuster();
				param.callback = 'b' + param._;
				g[param.callback] = function() {
					try { callback.apply(g, arguments); }
					catch(e) {}
					finally {
						head.removeChild(script);
						g[param.callback] = undefined;
					}
				};
				script.src = path(ext, param);
				head.appendChild(script);
			};
		}());

		if (isFunc(param) && !isFunc(callback)) {
			callback = param;
		}
		if (!isFunc(callback)) {
			throw new TypeError("Callback is not a function");
		}
		if (typeof param !== "object") {
			param = {};
		}
		return get.raw(ext, param, callback);
	};

	// AMD shim
	if (typeof define === "function" && define.amd) {
		/** @module be */
		define("be", be);
	}
	else {
		g.be = be;
	}
}(this));
