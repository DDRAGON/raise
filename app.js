
var express = require('express')
	, routes = require('./routes')
	, oddsSystem = require('./routes/oddsSystem')
	, qrCodeReader = require('./routes/qrCodeReader')
	, howToUse = require('./routes/howToUse')
	, forDealer = require('./routes/forDealer')
	, dedicatedTable = require('./routes/dedicatedTable')
	, multiQrCodeReader = require('./routes/multiQrCodeReader')
	, manAAgeTool = require('./routes/manAAgeTool')
	, justGet = require('./routes/justGet')
	, http = require('http')
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
app.get('/dedicatedTable', dedicatedTable.dedicatedTable);
app.get('/multiQrCodeReader', multiQrCodeReader.multiQrCodeReader);
app.get('/manAAgeTool', manAAgeTool.manAAgeTool);
app.get('/qrSheet', justGet.justGet);
app.get('/structure', justGet.justGet);
app.get('/QRCodeCards', justGet.justGet);
app.get('/howToUseAllinJpPdf', justGet.justGet);

// モジュールを呼び出す
var modules = {
	oddsSystem: require('./modules/oddsSystem.js'),
	dedicatedTable: require('./modules/dedicatedTable.js')
}

// サーバー立てる
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// ソケット通信
var io = require('socket.io').listen(server);

// オッズシステムページのソケット通信
var createOddsSystemSocket = require("./socket/oddsSystemSocket");
new createOddsSystemSocket(io, modules);
// QRコードリーダーページのソケット通信
var createQrCodeReaderSocket = require("./socket/qrCodeReaderSocket");
new createQrCodeReaderSocket(io, modules);
// ディーラーページのソケット通信
var createForDealerSocket = require("./socket/forDealerSocket");
new createForDealerSocket(io, modules);
// 専用テーブルページのソケット通信
var createDedicatedTableSocket = require("./socket/dedicatedtableSocket");
new createDedicatedTableSocket(io, modules);
// マルチQRコードリーダーページのソケット通信
var createMultiQrCodeReaderSocket = require("./socket/multiQrCodeReaderSocket");
new createMultiQrCodeReaderSocket(io, modules);
// 管理ページのソケット通信
var createManAAgeToolSocket = require("./socket/manAAgeToolSocket");
new createManAAgeToolSocket(io, modules);
