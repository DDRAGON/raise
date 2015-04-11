var createQrCodeReaderSocket = function(io, modules) {
	var multiQrCodeReaderSocket = io.of('/multiQrCodeReader').on('connection', function (socket) {

		console.log('A new multiQrCodeReader has entered the ring!');
		modules.dedicatedTable.multiQrCodeReaderConnect(socket);

		socket.on('disconnect', function() {
			modules.dedicatedTable.multiQrCodeReaderDisconnect(socket.id);
		});
	});

	return multiQrCodeReaderSocket;
};

module.exports = createQrCodeReaderSocket;
