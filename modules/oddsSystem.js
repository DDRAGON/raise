var async = require('async');
var request = require('request');
Config = require('../config');

var ASSISTANT_MODE_ORIGINAL = 'Original';
var ASSISTANT_MODE_ASSISTANT = 'Assistant';
var clients = {};
var assistantsMapByOriginalSocketId = {};
var dealersMapByOriginalSocketId = {};


function connect(socket)
{
	var socketId = socket.id;
	if (!clients[socketId]) {
		clients[socketId] = {
			socket: socket
		}
		gotStart(socketId);
	}
	socket.emit('passWord', socketId);
}

function gotImage(socketId, image)
{
	if (!clients[socketId]) return;
	switch (image) {
		case 'start': gotStart(socketId); break;
		case 'preFlop': gotPreFlop(socketId); break;
		case 'nextGame': gotNextGame(socketId); break;
		case 'resetGame': gotResetGame(socketId); break;
		default : gotCard(socketId, image); break;
	}
}

function updatePlayerName(socketId, seatId, name) {
	if (!clients[socketId]) return;
	if (typeof clients[socketId].frontObj.players[seatId] == 'undefined') {
		clients[socketId].frontObj.players[seatId] = {
			seatId: seatId,
			hand: []
		};
	}
	clients[socketId].frontObj.players[seatId].name = name;
	if (name == "") {
		delete clients[socketId].frontObj.players[seatId];
	}
	sendTableInfo(socketId);
}

// アシスタントパスワードの変更
function updateAssistantPassword(socket, socketId, assistantPassword) {
	if (clients[assistantPassword]) { // オリジナルが見つかっ場合、アシスタントの作成
		if (!assistantsMapByOriginalSocketId[assistantPassword]) {
			assistantsMapByOriginalSocketId[assistantPassword] = [];
		}
		assistantsMapByOriginalSocketId[assistantPassword].push ({
			socketId: socketId,
			socket: socket,
			originalSocketId: assistantPassword
		});
		sendTableInfo(assistantPassword); // アシスタントを作ったら現在のテーブル情報を送る。
	} else { // オリジナルが見つからない場合
		deleteAssistant(socketId); // アシスタントの削除
	}
}

// アシスタントモードの変更
function changeAssistantMode(socket, socketId, assistantMode) {
	if (assistantMode === ASSISTANT_MODE_ORIGINAL) { // オリジナルに変更ならば
		deleteAssistant(socketId); // アシスタントを削除
		connect(socket); // オリジナルの作成
	}
	if (assistantMode === ASSISTANT_MODE_ASSISTANT) { // アシスタントに変更ならば
		deleteOriginal(socketId); // オリジナルを削除
	}
}

// forDealerのパスワード変更
function dealerChangePassword(socket, socketId, dealerPassword) {
	if (clients[dealerPassword]) { // オリジナルが見つかっ場合、ディーラーの作成
		if (!dealersMapByOriginalSocketId[dealerPassword]) {
			dealersMapByOriginalSocketId[dealerPassword] = [];
		}
		dealersMapByOriginalSocketId[dealerPassword].push ({
			socketId: socketId,
			socket: socket,
			originalSocketId: dealerPassword
		});
		sendTableInfoForDealer(dealerPassword); // ディーラーを作ったら現在のテーブル情報を送る。
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
	deleteAssistant(socketId); return;
}

module.exports = {
	connect: connect,
	gotImage: gotImage,
	updatePlayerName: updatePlayerName,
	updateAssistantPassword: updateAssistantPassword,
	changeAssistantMode: changeAssistantMode,
	dealerChangePassword: dealerChangePassword,
	disconnect: disconnect
};

// 以下エクスポートしない関数

// 初期化
// スタートカードを受け取った時の処理。
function gotStart(socketId) {
	clients[socketId].frontObj = {
		state: 'start',
		allPlayersNum: 0,
		playingPlayersNum: 0,
		button: 0,
		board: [],
		players: []
	};
	clients[socketId].gotCards = [];
	sendTableInfo(socketId);
}

// プリフロップカードを受け取った時の処理。
function gotPreFlop(socketId) {
	if (clients[socketId].frontObj.state === 'start') {
		clients[socketId].frontObj.state = 'preFlop';
		clients[socketId].frontObj.allPlayersNum = clients[socketId].gotCards.length/2;
		clients[socketId].frontObj.playingPlayersNum = clients[socketId].frontObj.allPlayersNum;
		for (var key in clients[socketId].frontObj.players) {
			var player = clients[socketId].frontObj.players[key];
			if (!player) continue;
			var seatId = player.seatId;
			clients[socketId].frontObj.players[seatId].isActive = true;
			clients[socketId].frontObj.players[seatId].win = null;
			clients[socketId].frontObj.players[seatId].tie = null;
		}
		getWinPerFromAPI(socketId, clients[socketId].frontObj);
	}
}

// リセットゲームカードを受け取った時の処理。
function gotResetGame(socketId) {
	if (!clients[socketId]) return;
	clients[socketId].frontObj.state = 'start';
	clients[socketId].frontObj.allPlayersNum = 0;
	clients[socketId].frontObj.playingPlayersNum = 0;
	clients[socketId].frontObj.board = [];
	clients[socketId].gotCards = [];
	for (var key in clients[socketId].frontObj.players) {
		var player = clients[socketId].frontObj.players[key];
		if (!player) continue;
		var seatId = player.seatId;
		clients[socketId].frontObj.players[seatId].hand = [];
		clients[socketId].frontObj.players[seatId].isActive = true;
		clients[socketId].frontObj.players[seatId].win = null;
		clients[socketId].frontObj.players[seatId].tie = null;
	}
	sendTableInfo(socketId);
}

// ネクストゲームカードを受け取った時の処理。
function gotNextGame(socketId) {
	if (!clients[socketId]) return;
	moveDealerButton(socketId); // ディーラーボタンの移動
	gotResetGame(socketId);
}

// トランプのカードを受け取った時の処理。
function gotCard(socketId, card) {
	if (!clients[socketId]) return;
	switch (clients[socketId].frontObj.state) {
		case 'start': gotCardInStart(socketId, card); break;
		case 'preFlop': gotCardInPreFlop(socketId, card); break;
		case 'flop': gotCardInFlop(socketId, card); break;
		case 'turn': gotCardInTurn(socketId, card); break;
		case 'river': gotCardInRiver(socketId, card); break;
	}
	sendTableInfo(socketId);
}

function gotCardInStart(socketId, card) {
	var checkingSeatId = clients[socketId].frontObj.button;
	var lastSeatId = null;
	// １枚目
	for (var key in clients[socketId].frontObj.players) {
		var player = clients[socketId].frontObj.players[key];
		if (!player) continue;
		checkingSeatId = findNextDealerButton(socketId, checkingSeatId);
		if (!clients[socketId].frontObj.players[checkingSeatId].hand[0]) {
			clients[socketId].frontObj.players[checkingSeatId].hand[0] = card;
			clients[socketId].frontObj.players[checkingSeatId].isActive = true;
			return;
		}
		if (clients[socketId].frontObj.players[checkingSeatId].hand[0] == card) {
			return; // 入力カードを持っているプレイヤーがいたら無視する。
		}
		lastSeatId = checkingSeatId;
	}
	// ２枚目
	for (var key in clients[socketId].frontObj.players) {
		var player = clients[socketId].frontObj.players[key];
		if (!player) continue;
		checkingSeatId = findNextDealerButton(socketId, checkingSeatId);
		if (!clients[socketId].frontObj.players[checkingSeatId].hand[1]) {
			clients[socketId].frontObj.players[checkingSeatId].hand[1] = card;
			if (lastSeatId == checkingSeatId) { // 最後の一人を配り終えたら
				gotPreFlop(socketId); // プリフロップ開始だと分かる。
			}
			return;
		}
		if (clients[socketId].frontObj.players[checkingSeatId].hand[1] == card) {
			return; // 入力カードを持っているプレイヤーがいたら無視する。
		}
	}
}

// プリフロップでカード情報を受け取った時の処理。
function gotCardInPreFlop(socketId, card) {
	for (var key in clients[socketId].frontObj.players) {
		var player = clients[socketId].frontObj.players[key];
		if (!player) continue;
		var indexNum = player.hand.indexOf(card);
		if (indexNum != -1) { // 同じカードがみつかった場合降りたと認識
			foldedAndRecalculation(socketId, player.seatId);
			return;
		}
	}
	// 同じカードがない場合
	addCardToBoard(socketId, card);
	if (clients[socketId].frontObj.board.length == 3) { // フロップに３枚が来たのを確認
		clients[socketId].frontObj.state = 'flop'; // フロップになったことを認識
		getWinPerFromAPI(socketId, clients[socketId].frontObj);
	}
}
// フロップでカード情報を受け取った時の処理。
function gotCardInFlop(socketId, card) {
	for (var key in clients[socketId].frontObj.players) {
		var player = clients[socketId].frontObj.players[key];
		if (!player) continue;
		var indexNum = player.hand.indexOf(card);
		if (indexNum != -1) { // 同じカードがみつかった場合降りたと認識
			foldedAndRecalculation(socketId, player.seatId);
			return;
		}
	}
	// 同じカードがない場合
	addCardToBoard(socketId, card);
	if (clients[socketId].frontObj.board.length == 4) { // ターンになったことを認識
		clients[socketId].frontObj.state = 'turn';
		getWinPerFromAPI(socketId, clients[socketId].frontObj);
	}
}
// ターンでカード情報を受け取った時の処理。
function gotCardInTurn(socketId, card) {
	for (var key in clients[socketId].frontObj.players) {
		var player = clients[socketId].frontObj.players[key];
		if (!player) continue;
		var indexNum = player.hand.indexOf(card);
		if (indexNum != -1) { // 同じカードがみつかった場合降りたと認識
			foldedAndRecalculation(socketId, player.seatId);
			return;
		}
	}
	// 同じカードがない場合
	addCardToBoard(socketId, card);
	if (clients[socketId].frontObj.board.length == 5) { // リバーになったことを認識
		clients[socketId].frontObj.state = 'river';
		getWinPerFromAPI(socketId, clients[socketId].frontObj);
	}
}
// リバーでカード情報を受け取った時の処理。
function gotCardInRiver(socketId, card) {
	for (var key in clients[socketId].frontObj.players) {
		var player = clients[socketId].frontObj.players[key];
		if (!player) continue;
		var indexNum = player.hand.indexOf(card);
		if (indexNum != -1) { // 同じカードがみつかった場合降りたと認識
			foldedAndRecalculation(socketId, player.seatId);
			return;
		}
	}
}

// ボードにカードを追加する関数。
function addCardToBoard(socketId, card) {
	var indexNum = clients[socketId].frontObj.board.indexOf(card);
	if (indexNum != -1) { // 同じカードがみつかった場合は無視する。
		return;
	}
	clients[socketId].frontObj.board.push(card);
}

function sendTableInfo(originalSocketId) {
	var tableInfo = clients[originalSocketId].frontObj;
	clients[originalSocketId].socket.emit('tableInfo', tableInfo); // オリジナルに送信
	// アシスタントに送信
	if (assistantsMapByOriginalSocketId[originalSocketId]) {
		for (var key in assistantsMapByOriginalSocketId[originalSocketId]) {
			var assistant = assistantsMapByOriginalSocketId[originalSocketId][key];
			assistant.socket.emit('tableInfo', tableInfo); // 送信
		}
	}
	// ディーラーの送信
	sendTableInfoForDealer(originalSocketId);
}

function sendTableInfoForDealer(originalSocketId) {
	var tableInfoForDealer = createTableInfoForDealer(originalSocketId);
	if (dealersMapByOriginalSocketId[originalSocketId]) {
		for (var key in dealersMapByOriginalSocketId[originalSocketId]) {
			var assistant = dealersMapByOriginalSocketId[originalSocketId][key];
			assistant.socket.emit('tableInfo', tableInfoForDealer); // 送信
		}
	}

}

function createTableInfoForDealer(originalSocketId) {
	var tableInfo = clients[originalSocketId].frontObj;
	var tableInfoForDealer = {
		players: [],
		board: [],
		button: tableInfo.button
	};
	var players = tableInfo.players;
	var board   = tableInfo.board;
	for (var key in players) {
		var player = players[key];
		tableInfoForDealer.players[key] = {
			name: player.name,
			seatId: player.seatId,
			isActive: player.isActive,
			hand: []
		};
		for (var handKey in player.hand) {
			if (player.hand[handKey]) {
				tableInfoForDealer.players[key].hand[handKey] = true;
			}
		}
	}
	for (var key in board)  {
		if (board[key]) {
			tableInfoForDealer.board[key] = true;
		}
	}

	return tableInfoForDealer;
}

// ディーラーボタンを移動する
function moveDealerButton(socketId) {
	clients[socketId].frontObj.button = findNextDealerButton(socketId, clients[socketId].frontObj.button);
	sendTableInfo(socketId);
}

function findNextDealerButton(socketId, button) {
	var firstSeatId = null;
	for (var key in clients[socketId].frontObj.players) {
		var player = clients[socketId].frontObj.players[key];
		if (!player) continue;
		if (firstSeatId === null) firstSeatId = player.seatId;
		if (player.seatId > button) {
			return player.seatId
		}
	}
	return firstSeatId;
}

// アシスタントsocketIdからオリジナルsocketIdを求める。
function getOriginalSocketIdByAssistantSocketId(assistantSocketId) {
	for (var originalSocketId in assistantsMapByOriginalSocketId) {
		var assistants = assistantsMapByOriginalSocketId[originalSocketId];
		for (var key in assistants) {
			var assistant = assistants[key];
			if (assistant.socketId === assistantSocketId) { // アシスタントが見つかったら。
				return originalSocketId;
			}
		}
	}
	return false; // 見つからなかったらfalseを返す。
}

// オリジナルを削除
function deleteOriginal(socketId) {
	delete clients[socketId];
}

// アシスタントを削除
function deleteAssistant(assistantSocketId) {
	for (var originalSocketId in assistantsMapByOriginalSocketId) {
		var assistants = assistantsMapByOriginalSocketId[originalSocketId];
		for (var key in assistants) {
			var assistant = assistants[key];
			if (assistant.socketId === assistantSocketId) { // アシスタントが見つかったら。
				delete assistantsMapByOriginalSocketId[originalSocketId][key]; // 削除
				return;
			}
		}
	}
}

function deleteDealers(socketId) {
	delete dealersMapByOriginalSocketId[socketId];
}

// 降りたプレーヤーが出た時に勝率を再計算する。
function foldedAndRecalculation(socketId, seatId) {
	if (clients[socketId].frontObj.players[seatId].isActive == false) return;
	clients[socketId].frontObj.players[seatId].isActive = false;
	clients[socketId].frontObj.players[seatId].win = 0;
	clients[socketId].frontObj.players[seatId].tie = 0;
	clients[socketId].frontObj.playingPlayersNum -= 1;
	getWinPerFromAPI(socketId, clients[socketId].frontObj);
}

function getWinPerFromAPI(socketId, frontObj) {
	var playerForSend = [];
	var count = 0;
	var ActiveCount = 0;
	for (var key in frontObj.players) {
		var player = frontObj.players[key];
		if(!player) continue;
		playerForSend[count] = player;
		playerForSend[count].id = player.seatId;
		if (player.isActive == true) ActiveCount += 1;
		count += 1;
	}
	if (ActiveCount == 1) { // アクティブプレイヤーが一人だけのときはモックで勝率100%にする。
		winPerApiMock(socketId, frontObj.players);
		return;
	}

	var sendJson = {
		"board": frontObj.board,
		"players": playerForSend
	};
	var url = 'http://'+Config.getWinAPIHostAddress()+':9000/odds';
	var options = {
		url: url,
		headers: { 'Content-Type': 'application/json' },
		json: true,
		body: JSON.stringify(sendJson)
	};
	request.post(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
			// var gotPlayers = JSON.parse(body);
			var players = body['players'];
			console.log(players);
			for (var key in players) {
				var player = players[key];
				if (frontObj.players[Number(player.id)].isActive == true) {
					frontObj.players[Number(player.id)].win = player.win;
					frontObj.players[Number(player.id)].tie = player.tie;
				}
			}
			sendTableInfo(socketId);
		} else {
			console.log('error: '+ response.statusCode);
		}
	});
}

function winPerApiMock(socketId, players) {
	for (var key in players) {
		var player = players[key];
		if (!player) continue;
		if (player.isActive == true) {
			player.win = '100%';
			player.tie = '0.0%';
		}
	}
	sendTableInfo(socketId);
}
