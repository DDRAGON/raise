
var express = require('express')
	, routes = require('./routes')
	, oddsSystem = require('./routes/oddsSystem')
	, qrCodeReader = require('./routes/qrCodeReader')
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
app.get('/howToUse', justGet.justGet);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(server);

var createOddsSystemSocket = require("./socket/oddsSystemSocket");
new createOddsSystemSocket(io);
