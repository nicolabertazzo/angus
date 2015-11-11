'use strict';


var replace = require('gulp-replace');
var path = require('path');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var Server = require('karma').Server;

module.exports = function (angus, gulp) {
	
	var autoInclude = {
        jsLib: '',
		jsApp: ''
    };	
	
	autoInclude.jsLib = angus.appConfig.bower.filesNeeded.js
	.map(function (filePath) {
		filePath = 'bower_components/' + filePath;
		return '"' + filePath + '",';
	}).join('\n    ');
   
  var basesubstr = angus.appPath.length+1;
  var filenames = "";
  var appStream = gulp.src(angus.appPath +'/src/core/**/*.js');
	
    return function (done) {
		gulp.src(angus.appPath + '/template/karma.conf.js')
            .pipe(replace(/<!-- autoInclude: jsLib !-->/g, autoInclude.jsLib))
			.pipe(inject(angus.appConfig.usesAngularJS?appStream.pipe(angularFilesort()):appStream, {
				starttag: '//karmabegin',
				endtag: '//karmaend',
				transform: function (filepath, file, i, length) {
					//console.log('  "' + file.path.substr(basesubstr).replace(/\\/g, '\/') + '"' + (i + 1 < length ? ',' : ''));
					if(file.path.substr(basesubstr).replace(/\\/g, '\/').indexOf('/app.js') > -1) {
						return '  \'tests/app.js' + '\'' + (i + 1 < length ? ',' : '');
					}
				  return '  \'' + file.path.substr(basesubstr).replace(/\\/g, '\/') + '\'' + (i + 1 < length ? ',' : '');
				}
			}))
			//.pipe(replace(/@@minified/g, angus.env === 'dev' ? '' : '.min'))
			.pipe(gulp.dest(angus.appPath + '/'));
			
		new Server({			
            configFile: angus.appPath + '/karma.conf.js',
            singleRun: true
		  }, function (exitCode) {
            console.log('Karma has exited with ' + exitCode);
            if (exitCode === 0) {
                done();
            }
        }).start();
		  
    };
};
