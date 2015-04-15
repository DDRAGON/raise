Config = require('../config');

var dedicatedTables = {};
var multiQrCodeReaders = {};
var managers = {};

// 専用テーブルの接続
function dedicatedTableConnect(socket) {
	var socketId = socket.id;
	if (!dedicatedTables[socketId]) {
		dedicatedTables[socketId] = {
			socket: socket,
			addedMultiQrCodeReaders: {}
		}
	}
	socket.emit('passWord', socketId); // パスワードを送り返す
	sendDedicatedTablesInfoToManagers();
}

// マルチQRリーダーの接続
function multiQrCodeReaderConnect(socket) {
	var socketId = socket.id;
	if (!multiQrCodeReaders[socketId]) {
		multiQrCodeReaders[socketId] = {
			socket: socket,
			dedicatedTableId: null,
			seatId: null
		}
	}
	sendMultiQrCodeReadersInfoToManagers();
}

// マネージの接続
function manAAgeToolConnect(socket) {
	var socketId = socket.id;
	if (!managers[socketId]) {
		managers[socketId] = {
			socket: socket
		}
	}
	sendDedicatedTablesInfoToManagers();
	sendMultiQrCodeReadersInfoToManagers();
}

// 専用テーブル接続切断
function dedicatedTableDisconnect(socketId) {
	delete dedicatedTables[socketId];
}

// マルチQRリーダーの接続切断
function multiQrCodeReaderDisconnect(socketId) {
	delete multiQrCodeReaders[socketId];
	sendMultiQrCodeReadersInfoToManagers();
}

// マネージの接続切断
function manAAgeToolDisconnect(socketId) {
	delete managers[socketId];
}

function assignQrCodeReaderAndDedicatedTable(assignData, socket) {
	var multiQrCodeReaderId = assignData.multiQrCodeReaderId;
	var dedicatedTableId    = assignData.dedicatedTableId;
	var seatId              = assignData.seatId;

	if (!dedicatedTables[dedicatedTableId]) {
		socket.emit('assignFail', '専用テーブルID not found'); // 割り当て失敗を返す。
		return;
	}

	if (!multiQrCodeReaders[multiQrCodeReaderId]) {
		socket.emit('assignFail', 'マルチQRコードリーダーID not found'); // 割り当て失敗を返す。
		return;
	}

	// 割り当て設定
	dedicatedTables[dedicatedTableId].addedMultiQrCodeReaders[multiQrCodeReaderId] = {
		id: multiQrCodeReaderId,
		seatId: seatId
	}
	multiQrCodeReaders[multiQrCodeReaderId].dedicatedTableId = dedicatedTableId;
	multiQrCodeReaders[multiQrCodeReaderId].seatId = seatId;

	sendDedicatedTablesInfoToManagers(); // 更新の通知送信（専用テーブル情報）
	sendMultiQrCodeReadersInfoToManagers(); // 更新の通知送信（QRコードリーダー情報）
}


module.exports = {
	dedicatedTableConnect: dedicatedTableConnect,
	multiQrCodeReaderConnect: multiQrCodeReaderConnect,
	manAAgeToolConnect: manAAgeToolConnect,
	dedicatedTableDisconnect: dedicatedTableDisconnect,
	multiQrCodeReaderDisconnect: multiQrCodeReaderDisconnect,
	manAAgeToolDisconnect: manAAgeToolDisconnect,
	assignQrCodeReaderAndDedicatedTable: assignQrCodeReaderAndDedicatedTable
};

/* 以下エクスポートしない関数 */

/**
 * マルチQRコードリーダーについての情報を送信
 */
function sendMultiQrCodeReadersInfoToManagers() {
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
		var multiQrCodeReader = multiQrCodeReaders[socketId];
		if (multiQrCodeReader.dedicatedTableId !== null) continue; // テーブル未割り当てのみにしぼる
		multiQrCodeReadersInfoForSend[socketId] = {
			id: socketId,
			dedicatedTableId: multiQrCodeReader.dedicatedTableId,
			seatId: multiQrCodeReader.seatId,
			comment: 'I am multiQrCodeReader'
		};
	}

	return multiQrCodeReadersInfoForSend;
}

function sendDedicatedTablesInfoToManagers() {
	// 全マネージャーに送信
	for (var key in managers) {
		var manager = managers[key];
		manager.socket.emit(
			'dedicatedTablesInfo',
			createDedicatedTablesInfoForSend()
		); // 送信
	}
}

function createDedicatedTablesInfoForSend() {
	var dedicatedTablesInfoForSend = {};
	for (var socketId in dedicatedTables) {
		var dedicatedTable = dedicatedTables[socketId];
		dedicatedTablesInfoForSend[socketId] = {
			id: socketId,
			addedMultiQrCodeReaders: {},
			comment: 'I am dedicatedTable'
		};

		for (var addedMultiQrCodeReaderId in dedicatedTable.addedMultiQrCodeReaders) {
			var addedMultiQrCodeReader = dedicatedTable.addedMultiQrCodeReaders[addedMultiQrCodeReaderId];
			dedicatedTablesInfoForSend[socketId].addedMultiQrCodeReaders[addedMultiQrCodeReaderId] = {
				id: addedMultiQrCodeReaderId,
				seatId: addedMultiQrCodeReader.seatId
			};
		}
	}

	return dedicatedTablesInfoForSend;
}
