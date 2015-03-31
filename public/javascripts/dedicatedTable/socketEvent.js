var socket = io.connect('http://'+hostAddress+'/dedicatedTable');

socket.on('tableInfo', function(tableInfo) {
	drawTableInfo(tableInfo);
});

socket.on('passWord', function(passWord) {
	setPassword(passWord);
});
