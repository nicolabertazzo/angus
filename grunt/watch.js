'use strict';

module.exports = function (angus) {
    return {
        js: {
            files: [
                angus.appPath + '/src/**/*',

                // Don't watch the scss, as we will watch the compiled CSS for a soft refresh
                '!' + angus.appPath + '/src/scss/**/*',

                '!' + angus.appPath + '/**/_*'
            ],
            tasks: ['build_dev']
        },
        html: {
            files: [
                angus.appPath + '/src/index.html'
            ],
            tasks: ['build_dev']
        },
        sass: {
            files: [
                angus.appPath + '/src/scss/**/*',
                '!' + angus.appPath + '/**/_*'
            ],
            tasks: ['sass:dev']
        },
        livereload: {
            options: {
                livereload: 35730
            },
            files: [
                angus.appPath + '/dist/dev/**/*'
            ]
        },
        core: {
            files: [
                angus.appPath + '/angus.config.js'
            ],
            tasks: ['check', 'build_dev']
        }
    };
};
