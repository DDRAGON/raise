var dedicatedTable = require('../modules/dedicatedTable.js');

var createManAAgeToolSocket = function(io) {
	var manAAgeToolSocket = io.of('/manAAgeTool').on('connection', function (socket) {

		console.log('A new manAAger has entered the ring!');
		dedicatedTable.manAAgeToolConnect(socket);

		socket.on('disconnect', function() {
			dedicatedTable.manAAgeToolDisconnect(socket.id);
		});

	});

	return manAAgeToolSocket;
};

module.exports = createManAAgeToolSocket;
