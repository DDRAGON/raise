module.exports = function(grunt){

	// loadnpmTasksで使用したいタスクを読み込んでおく
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// initConfigで基本設定
	grunt.initConfig({
		uglify : {
			min : {
				files: {
					"public/javascripts/oddsSystem/ugly.min.js" : [
						"public/javascripts/oddsSystem/client.js"
					]
				}
			}
		}
	});

	// registerTask でタスクに名前をつける
	// defaultでデフォルトのタスクを設定
	grunt.registerTask("default", ["uglify"]);

};