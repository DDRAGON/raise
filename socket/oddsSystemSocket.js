var oddsSystem = require('../modules/oddsSystem.js');

var createOddsSystemSocket = function(io) {
	var oddsSystemSocket = io.of('/oddsSystem').on('connection', function (socket) {

		oddsSystem.connect(socket);

		socket.on('imageSendWithPassWord', function(data) {
			var socketId = socket.id;
			if (data.passWord) {
				socketId = data.passWord;
			}
			oddsSystem.gotImage(socketId, data.image);
		});

		socket.on('updatePlayerName', function(data) {
			var socketId = socket.id;
			if (data.passWord) {
				socketId = data.passWord;
			}
			oddsSystem.updatePlayerName(socketId, data.seatId, data.name);
		});

		socket.on('updateAssistantPassword', function(assistantPassword) {
			oddsSystem.updateAssistantPassword(socket, socket.id, assistantPassword);
		});

		socket.on('changeAssistantMode', function(assistantMode) {
			oddsSystem.changeAssistantMode(socket, socket.id, assistantMode);
		});

		socket.on('disconnect', function() {
			oddsSystem.disconnect(socket.id);
		});
	});

	return oddsSystemSocket;
};

module.exports = createOddsSystemSocket;
