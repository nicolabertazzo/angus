module.exports = function(config) {
  config.set({
    basePath: '',
	singleRun: true,
    frameworks: ['jasmine'],
	browsers: ['PhantomJS'],
    files: [
		<!-- autoInclude: jsLib !-->
		
		//karmabegin    
		//karmaend
		
		, 'tests/**/*.js' // files that contain tests
    ]
  });
};
