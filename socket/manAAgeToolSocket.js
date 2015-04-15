var createManAAgeToolSocket = function(io, modules) {
	var manAAgeToolSocket = io.of('/manAAgeTool').on('connection', function (socket) {

		// 初回接続時
		console.log('A new manAAger has entered the ring!');
		modules.dedicatedTable.manAAgeToolConnect(socket);

		// 割り当ての受信
		socket.on('assign', function(assignData) {
			modules.dedicatedTable.assignQrCodeReaderAndDedicatedTable(assignData, socket);
		});

		// 接続切断
		socket.on('disconnect', function() {
			modules.dedicatedTable.manAAgeToolDisconnect(socket.id);
		});
	});

	return manAAgeToolSocket;
};

module.exports = createManAAgeToolSocket;
