var socket = io.connect('https://'+hostAddress+'/forDealer');

socket.on('tableInfo', function(tableInfo) {
	drawTableInfo(tableInfo);
});

socket.on('disconnect', function() {
	disConnected();
});
