var createOddsSystemSocket = function(io, modules) {
	var oddsSystemSocket = io.of('/oddsSystem').on('connection', function (socket) {

		modules.oddsSystem.connect(socket);

		socket.on('imageSendWithPassWord', function(data) {
			var socketId = socket.id;
			if (data.passWord) {
				socketId = data.passWord;
			}
			modules.oddsSystem.gotImage(socketId, data.image);
		});

		socket.on('updatePlayerName', function(data) {
			var socketId = socket.id;
			if (data.passWord) {
				socketId = data.passWord;
			}
			modules.oddsSystem.updatePlayerName(socketId, data.seatId, data.name);
		});

		socket.on('updateAssistantPassword', function(assistantPassword) {
			modules.oddsSystem.updateAssistantPassword(socket, socket.id, assistantPassword);
		});

		socket.on('changeAssistantMode', function(assistantMode) {
			modules.oddsSystem.changeAssistantMode(socket, socket.id, assistantMode);
		});

		socket.on('updateCaptionMessage', function(data) {
			var socketId = socket.id;
			if (data.passWord) {
				socketId = data.passWord;
			}
			modules.oddsSystem.updateCaptionMessage(socketId, data.captionMessage);
		});

		socket.on('updateDescriptionMessage', function(data) {
			var socketId = socket.id;
			if (data.passWord) {
				socketId = data.passWord;
			}
			modules.oddsSystem.updateDescriptionMessage(socketId, data.descriptionMessage);
		});

		socket.on('updateChipMany', function(data) {
			var socketId = socket.id;
			if (data.passWord) {
				socketId = data.passWord;
			}
			modules.oddsSystem.updateChipMany(socketId, data.seatId, data.chipMany);
		});


		socket.on('disconnect', function() {
			modules.oddsSystem.disconnect(socket.id);
		});
	});

	return oddsSystemSocket;
};

module.exports = createOddsSystemSocket;
