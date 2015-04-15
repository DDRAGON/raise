var socket = io.connect('http://'+hostAddress+'/manAAgeTool');

socket.on('dedicatedTablesInfo', function(dedicatedTables) {
	displayDedicatedTables(dedicatedTables);
});

socket.on('multiQrCodeReadersInfo', function(multiQrCodeReaders) {
	displayMultiQrCodeReaders(multiQrCodeReaders);
});

// 割り当て失敗の通知がきた
socket.on('assignFail', function(failedMessage) {
	displayAssignFailed (failedMessage);
});

// 接続切れた
socket.on('disconnect', function() {
	displayDisConnected();
});

// 割り当て送信っ！
function sendAssign(multiQrCodeReaderId, dedicatedTableId, seatId) {
	socket.emit('assign', {
		multiQrCodeReaderId: multiQrCodeReaderId,
		dedicatedTableId: dedicatedTableId,
		seatId: seatId
	});
}
