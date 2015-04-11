var createQrCodeReaderSocket = function(io, modules) {
	var qrCodeReaderSocket = io.of('/qrCodeReader').on('connection', function (socket) {

		socket.on('imageSendWithPassWord', function(data) {
			modules.oddsSystem.gotImage(data.passWord, data.image);
		});

	});

	return qrCodeReaderSocket;
};

module.exports = createQrCodeReaderSocket;
