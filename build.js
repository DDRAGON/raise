var fs = require('fs');
var uglify  = require("uglify-js");


var files = [
   "public/javascripts/oddsSystem/socket_event.js",
   "public/javascripts/oddsSystem/video.js",
   "public/javascripts/oddsSystem/video_layer.js",
   "public/javascripts/oddsSystem/tableinfo_layer.js",
   "public/javascripts/oddsSystem/settings.js",
   "public/javascripts/oddsSystem/card_selector.js"
];

var finalCode = uglify.minify( files, {
   outSourceMap: "public/javascripts/oddsSystem/ugly.min.js"
});

fs.writeFile("public/javascripts/oddsSystem/ugly.min.js", finalCode.code , function (err) {
   console.log(err);
});


// -------------------


var files = [
   "public/javascripts/qrCodeReader/video.js",
   "public/javascripts/qrCodeReader/client.js"
];
var finalCode = uglify.minify( files, {
   outSourceMap: "public/javascripts/qrCodeReader/ugly.min.js"
});

fs.writeFile("public/javascripts/qrCodeReader/ugly.min.js", finalCode.code , function (err) {
   console.log(err);
});


// ---------------------


var files = [
   "public/javascripts/forDealer/socket_event.js",
   "public/javascripts/forDealer/forDealer.js"
];
var finalCode = uglify.minify( files, {
   outSourceMap: "public/javascripts/forDealer/ugly.min.js"
});

fs.writeFile("public/javascripts/forDealer/ugly.min.js", finalCode.code , function (err) {
   console.log(err);
});


