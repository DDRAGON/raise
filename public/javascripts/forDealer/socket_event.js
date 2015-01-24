var socket = io.connect('http://'+hostAddress+'/oddsSystem');

socket.on('tableInfo', function(tableInfo) {
	drawTableInfo(tableInfo);
});
