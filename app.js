
var express = require('express')
	, routes = require('./routes')
	, oddsSystem = require('./routes/oddsSystem')
	, qrCodeReader = require('./routes/qrCodeReader')
	, howToUse = require('./routes/howToUse')
	, forDealer = require('./routes/forDealer')
	, justGet = require('./routes/justGet')
	, http = require('http')
   , https = require('https')
   , fs = require('fs')
	, path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/oddsSystem', oddsSystem.oddsSystem);
app.get('/qrCodeReader', qrCodeReader.qrCodeReader);
app.get('/howToUse', howToUse.howToUse);
app.get('/forDealer', forDealer.forDealer);
app.get('/qrSheet', justGet.justGet);
app.get('/structure', justGet.justGet);
app.get('/QRCodeCards', justGet.justGet);
app.get('/howToUseAllinJpPdf', justGet.justGet);
app.get('/allinEvent2JOPT2015', justGet.justGet);

// モジュールを呼び出す
var modules = {
	oddsSystem: require('./modules/oddsSystem.js')
}

// https キーの設定
var options = {
   key: fs.readFileSync('./httpsKeys/LETSENCRYPT1106445.key'),
   cert: fs.readFileSync('./httpsKeys/LETSENCRYPT1106445.cert')
};

// サーバーをたてる
//var httpServer = http.createServer(app).listen(app.get('port'), function(){
   //console.log('Express server listening on port ' + app.get('port'));
//});
var server = https.createServer(options, app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(server);

var createOddsSystemSocket = require("./socket/oddsSystemSocket");
new createOddsSystemSocket(io, modules);
var createQrCodeReaderSocket = require("./socket/qrCodeReaderSocket");
new createQrCodeReaderSocket(io, modules);
var createForDealerSocket = require("./socket/forDealerSocket");
new createForDealerSocket(io, modules);
