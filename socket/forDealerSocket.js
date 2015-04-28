var createForDealerSocket = function(io, modules) {
	var forDealerSocket = io.of('/forDealer').on('connection', function (socket) {

		socket.on('changePassword', function(password) {
			modules.oddsSystem.dealerChangePassword(socket, socket.id, password);
		});

		socket.on('deletePlayerWithPassword', function(data) {
			modules.oddsSystem.updatePlayerName(data.password, data.seatId, '');
		});

		socket.on('foldPlayerWithPassword', function(data) {
			modules.oddsSystem.foldPlayer(data.password, data.seatId);
		});

		socket.on('imageSendWithPassWord', function(data) {
			modules.oddsSystem.gotImage(data.password, data.image);
		});

		socket.on('undoWithPassword', function(password) {
			modules.oddsSystem.undoFrontObj(password);
		});

	});

	return forDealerSocket;
};

module.exports = createForDealerSocket;
