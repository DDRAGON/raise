module.exports = function(grunt){

	// loadnpmTasksで使用したいタスクを読み込んでおく
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// initConfigで基本設定
	grunt.initConfig({
		uglify : {
			min : {
				files: {
					"public/javascripts/oddsSystem/ugly.min.js" : [
						"public/javascripts/oddsSystem/socket_event.js",
						"public/javascripts/oddsSystem/video.js",
						"public/javascripts/oddsSystem/video_layer.js",
						"public/javascripts/oddsSystem/tableinfo_layer.js",
						"public/javascripts/oddsSystem/settings.js",
						"public/javascripts/oddsSystem/card_selector.js"
					],
					"public/javascripts/qrCodeReader/ugly.min.js" : [
						"public/javascripts/qrCodeReader/video.js",
						"public/javascripts/qrCodeReader/client.js"
					],
					"public/javascripts/multiQrCodeReader/ugly.min.js" : [
						"public/javascripts/multiQrCodeReader/video.js",
						"public/javascripts/multiQrCodeReader/multiQrCodeReaderClient.js"
					],
					"public/javascripts/manAAgeTool/ugly.min.js" : [
						"public/javascripts/manAAgeTool/socket_event.js"
					]
				}
			}
		}
	});

	// registerTask でタスクに名前をつける
	// defaultでデフォルトのタスクを設定
	grunt.registerTask("default", ["uglify"]);

};