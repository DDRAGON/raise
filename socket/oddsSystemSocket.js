var dealerBot = require('../modules/dealerBot/dealerBot.js');

var createOddsSystemSocket = function(io) {
	var oddsSystemSocket = io.of('/oddsSystem').on('connection', function (socket) {

		dealerBot.connect(socket.id, function(outPutText){
			socket.emit('outPutText', outPutText);
		});

		socket.on('call', function(data) {
			dealerBot.call(socket.id, function(outPutText){
				socket.emit('outPutText', outPutText);
			});
		});

		socket.on('allin', function(data) {
			dealerBot.allin(socket.id, function(outPutText){
				socket.emit('outPutText', outPutText);
			});
		});

		socket.on('fold', function(data) {
			dealerBot.fold(socket.id, function(outPutText){
				socket.emit('outPutText', outPutText);
			});
		});

	});

	return oddsSystemSocket;
};

module.exports = createOddsSystemSocket;
