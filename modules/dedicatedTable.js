Config = require('../config');

var clients = {};
var multiQrCodeReaders = {};
var managers = {};

// 専用テーブルの接続
function connect(socket) {
	var socketId = socket.id;
	if (!clients[socketId]) {
		clients[socketId] = {
			socket: socket
		}
		gotStart(socketId);
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
function disconnect(socketId) {
	if (clients[socketId]) { // オリジナルが切断したとき。
		deleteOriginal(socketId);
		deleteDealers(socketId);
		return;
	}
	// オリジナルでない時はアシスタントを探し、いいたら削除する。
	deleteAssistant(socketId);
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
	connect: connect,
	multiQrCodeReaderConnect: multiQrCodeReaderConnect,
	manAAgeToolConnect: manAAgeToolConnect,
	disconnect: disconnect,
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
