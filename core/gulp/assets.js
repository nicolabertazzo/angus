'use strict';
var rename = require("gulp-rename");
var props2json = require('gulp-props2json');

module.exports = function (angus, gulp) {
    
    var cfg = angus.appConfig;
    
    return function () {
        
        var srcFolders = [angus.appPath + '/src/assets/**/*'];
        
        if(cfg.convertI18nProperties) {
            //convert i18n properties files into JSON format
            gulp.src( angus.appPath + '/src/assets/**/*.properties',{
                base: angus.appPath + '/src/'
            })
                .pipe(rename(function (path) {
                    var prefix = path.basename.substring(0,path.basename.indexOf('_')+1);
                    var locale = path.basename.substring(prefix.length); 
                    path.basename = prefix + locale.replace('_','-').toLowerCase();
                }))
                .pipe(props2json({ outputType: 'json' }))
                .pipe(gulp.dest(angus.appPath + '/dist'));
            
            //do not copy properties files into dist
            srcFolders.push('!' + angus.appPath + '/src/assets/**/*.properties');
        }
        
        return gulp.src(srcFolders,{
            base: angus.appPath + '/src/'
        })
            .pipe(gulp.dest(angus.appPath + '/dist'));
    };
};
