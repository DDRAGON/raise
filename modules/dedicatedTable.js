Config = require('../config');

var dedicatedTables = {};
var multiQrCodeReaders = {};
var managers = {};

// 専用テーブルの接続
function dedicatedTableConnect(socket) {
	var socketId = socket.id;
	if (!dedicatedTables[socketId]) {
		dedicatedTables[socketId] = {
			socket: socket
		}
	}
	socket.emit('passWord', socketId);
}

// マルチQRリーダーの接続
function multiQrCodeReaderConnect(socket) {
	var socketId = socket.id;
	if (!multiQrCodeReaders[socketId]) {
		multiQrCodeReaders[socketId] = {
			socket: socket
		}
	}
	sendMultiQrCodeReadersInfo();
}

// マネージの接続
function manAAgeToolConnect(socket) {
	var socketId = socket.id;
	if (!managers[socketId]) {
		managers[socketId] = {
			socket: socket
		}
	}
}

// 接続切断
function dedicatedTableDisconnect(socketId) {
	delete dedicatedTables[socketId];
}

// マルチQRリーダーの接続切断
function multiQrCodeReaderDisconnect(socketId) {
	delete multiQrCodeReaders[socketId];
	sendMultiQrCodeReadersInfo();
}

// マネージの接続切断
function manAAgeToolDisconnect(socketId) {
	delete managers[socketId];
}


module.exports = {
	dedicatedTableConnect: dedicatedTableConnect,
	multiQrCodeReaderConnect: multiQrCodeReaderConnect,
	manAAgeToolConnect: manAAgeToolConnect,
	dedicatedTableDisconnect: dedicatedTableDisconnect,
	multiQrCodeReaderDisconnect: multiQrCodeReaderDisconnect,
	manAAgeToolDisconnect: manAAgeToolDisconnect
};

/* 以下エクスポートしない関数 */

/**
 * マルチQRコードリーダーについての情報を送信
 */
function sendMultiQrCodeReadersInfo() {
	// 全マネージャーに送信
	for (var key in managers) {
		var manager = managers[key];
		manager.socket.emit(
			'multiQrCodeReadersInfo',
			createMultiQrCodeReadersInfoForSend()
		); // 送信
	}
}

function createMultiQrCodeReadersInfoForSend() {
	var multiQrCodeReadersInfoForSend = {};
	for (var socketId in multiQrCodeReaders) {
		multiQrCodeReadersInfoForSend[socketId] = 'I am multiQrCodeReader';
	}

	return multiQrCodeReadersInfoForSend;
}
