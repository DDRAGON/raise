var oddsSystem = require('../modules/oddsSystem.js');

var createForDealerSocket = function(io) {
	var forDealerSocket = io.of('/forDealer').on('connection', function (socket) {

		socket.on('changePassword', function(password) {
			oddsSystem.dealerChangePassword(socket, socket.id, password);
		});

	});

	return forDealerSocket;
};

module.exports = createForDealerSocket;
