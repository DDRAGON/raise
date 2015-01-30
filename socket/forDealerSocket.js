var oddsSystem = require('../modules/oddsSystem.js');

var createForDealerSocket = function(io) {
	var forDealerSocket = io.of('/forDealer').on('connection', function (socket) {

		socket.on('changePassword', function(password) {
			oddsSystem.dealerChangePassword(socket, socket.id, password);
		});

		socket.on('deletePlayerWithPassword', function(data) {
			oddsSystem.updatePlayerName(data.password, data.seatId, '');
		});

		socket.on('foldPlayerWithPassword', function(data) {
			oddsSystem.foldPlayer(data.password, data.seatId);
		});

		socket.on('imageSendWithPassWord', function(data) {
			oddsSystem.gotImage(data.password, data.image);
		});

	});

	return forDealerSocket;
};

module.exports = createForDealerSocket;
