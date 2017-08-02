'use strict';

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var injectString = require('gulp-inject-string');
var child_process = require('child_process');
var gutil = require('gulp-util');
// var order = require('gulp-order');


var streams = require('../streams');
var streamqueue = require('streamqueue');

module.exports = function (angus, gulp) {
    return function () {
        
        var version = 'version:';
        var replaceVersion = 'NO-REPLACE-am3m242scl2of2342mcpm23-'+Math.random();
        if(angus.appConfig.replaceWithSvnVersion) {
            try{
                version += child_process.execSync('svnversion',{cwd: angus.appPath}).toString().trim();
            } catch (err) {
                version += '?';
            }
            version += ' build:'+new Date().toISOString();
            replaceVersion = angus.appConfig.replaceWithSvnVersion;
            gutil.log(gutil.colors.green('version on SVN: '+version));
        }
        if(angus.appConfig.replaceWithGitVersion) {
            try{
                version += child_process.execFileSync('git',[ "rev-parse", "--short", "HEAD" ],{env: process.env, cwd: angus.appPath}).toString().trim();
            } catch (err) {
                console.log(err);
                version += '?';
            }
            version += ' build:'+new Date().toISOString();
            replaceVersion = angus.appConfig.replaceWithGitVersion;
            gutil.log(gutil.colors.green('version on GIT: '+version));
        }        
        
        return streamqueue({ objectMode: true },
                streams.jsLib(angus, gulp),
                streams.jsApp(angus, gulp),
                streams.templatesLib(angus, gulp),
                streams.templatesApp(angus, gulp)
            )
            // .pipe(order([
            //     'bower_components/**/*',
            //     'core/**/*',
            //     // angus.appPath + '/src/**/*',
            // ]))
            .pipe(injectString.replace(replaceVersion, version))
            .pipe(concat('app.min.js', {newLine: ';\r\n'}))
            .pipe(ngAnnotate())
            .pipe(uglify().on('error', function(e){
				        console.log(e);
				     }))
            .pipe(gulp.dest(angus.appPath + '/dist/js'));
    };
};
