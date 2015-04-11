var createManAAgeToolSocket = function(io, modules) {
	var manAAgeToolSocket = io.of('/manAAgeTool').on('connection', function (socket) {

		console.log('A new manAAger has entered the ring!');
		modules.dedicatedTable.manAAgeToolConnect(socket);

		socket.on('disconnect', function() {
			modules.dedicatedTable.manAAgeToolDisconnect(socket.id);
		});
	});

	return manAAgeToolSocket;
};

module.exports = createManAAgeToolSocket;
