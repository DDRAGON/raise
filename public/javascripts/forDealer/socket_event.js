var socket = io.connect('http://'+hostAddress+'/forDealer');

socket.on('tableInfo', function(tableInfo) {
	drawTableInfo(tableInfo);
});

socket.on('disconnect', function() {
	disConnected();
});
