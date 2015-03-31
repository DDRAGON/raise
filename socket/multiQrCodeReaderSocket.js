var dedicatedTable = require('../modules/dedicatedTable.js');

var createQrCodeReaderSocket = function(io) {
	var multiQrCodeReaderSocket = io.of('/multiQrCodeReader').on('connection', function (socket) {

		console.log('A new multiQrCodeReader has entered the ring!');
		dedicatedTable.multiQrCodeReaderConnect(socket);

		socket.on('disconnect', function() {
			dedicatedTable.multiQrCodeReaderDisconnect(socket.id);
		});

	});

	return multiQrCodeReaderSocket;
};

module.exports = createQrCodeReaderSocket;
