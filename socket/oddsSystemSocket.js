var oddsSystem = require('../modules/oddsSystem.js');

var createOddsSystemSocket = function(io) {
	var oddsSystemSocket = io.of('/oddsSystem').on('connection', function (socket) {

		oddsSystem.connect(socket.id, function(){
			console.log('A NEW USER ENTERED THE RING.');
		});

		socket.on('imageSend', function(image) {
			console.log(image);
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
