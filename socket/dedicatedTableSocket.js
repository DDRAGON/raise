var createDedicatedTableSocket = function(io, modules) {
	var dedicatedTableSocket = io.of('/dedicatedTable').on('connection', function (socket) {

		console.log('A new dedicatedTale has entered the ring!');
		modules.dedicatedTable.dedicatedTableConnect(socket);

		socket.on('disconnect', function() {
			modules.dedicatedTable.dedicatedTableDisconnect(socket.id);
		});
	});

	return dedicatedTableSocket;
};

module.exports = createDedicatedTableSocket;
