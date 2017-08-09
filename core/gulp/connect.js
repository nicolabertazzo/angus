'use strict';

var connect  = require('gulp-connect');

var LIVERELOAD_PORT = 35729;
var liveReload = require('connect-livereload')({port: LIVERELOAD_PORT});

var modRewrite = require('connect-modrewrite');

var timeoutAlreadySet;
var setTimeout = function(options){
	return function (req, res, next) {
		if(!timeoutAlreadySet){
			timeoutAlreadySet = true;
			if(options.serverTimeoutMinutes){
				req.socket.server.timeout = 1000*60*options.serverTimeoutMinutes;
				console.log('set server timeout to: '+req.socket.server.timeout+'ms ('+options.serverTimeoutMinutes+'min)');
			}
		};
		next();
	}
};

var middleware = function (connect, options) {
    return [
        setTimeout(options),
        liveReload,
        modRewrite([
            '^[^\\.]*$ /index.html [L]'
        ]),
        connect.static(options.root.join('')) // Serve static files
    ];
};


module.exports = function (angus) {
		var liveReloadEnabled = typeof angus.appConfig.liveReload==='undefined' || angus.appConfig.liveReload;
		console.log('live reload: '+(liveReloadEnabled?'enabled':'disabled'));
		if(angus.appConfig.serverTimeoutMinutes)
			console.log('custom server timeout: '+angus.appConfig.serverTimeoutMinutes);

    return function () {
        return connect.server({
            root: [angus.appPath + '/dist/'],
            port: angus.appConfig.port,
            livereload: liveReloadEnabled,
            middleware: middleware,
            serverTimeoutMinutes: angus.appConfig.serverTimeoutMinutes
        });
    };
};
