var socket = io.connect('http://'+hostAddress+'/oddsSystem');
var easyMode = false;
var mark = '';
var num  = '　'
var passWord = '';
var config = {
	canvasWidth:  640,
	canvasHeight: 360,
	originalCardWidth:  48,
	originalCardHeight: 64,
	displayCardWidth:  36,
	displayCardHeight: 48,
	space: 8,
	boardWidthSpace:  6,
	boardHeightSpace: 6,
	cardFontSize: 30,
	markFontSize: 30,
	markAdjust: 20
};
config.displayCardWidth  = config.cardFontSize*2-11;
config.displayCardHeight = config.cardFontSize;
config.displayWidth = config.displayCardWidth*2;
config.displayHeight = Number(config.canvasHeight/5);
config.boxWidth    = config.displayWidth;
config.boxHeight   = config.displayHeight-config.displayCardHeight-config.space;
config.boardWidth  = config.displayCardWidth*5 + config.boardWidthSpace*2;
config.boardHeight = config.cardFontSize + config.boardHeightSpace*2;
config.fontSize  = Number(config.boxHeight/2);
config.tieFontSize  = config.fontSize - 4;

var cards = [
	'As', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks',
	'Ah', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh',
	'Ad', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd',
	'Ac', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc'
];
var cardsForEasyMode = [
	'Ta', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', 'Qa', 'Wa', 'Ea', 'Ra',
	'Ts', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Qs', 'Ws', 'Es', 'Rs',
	'Td', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Qd', 'Wd', 'Ed', 'Rd',
	'Tf', '2f', '3f', '4f', '5f', '6f', '7f', '8f', '9f', 'Qf', 'Wf', 'Ef', 'Rf'
];


function markClick(mark) {
	this.mark = mark;
	drawImage();
}

function numClick(num) {
	this.num = num;
	drawImage();
}

function sendImage(image) {
	socket.emit('imageSend', image);
	sound();
	$('#message').html('send '+image);
	this.mark = '';
	this.num  = '　';
	drawImage();
	drawSentImage(image);
	if (image == 'start') {
		for (var seatId=0; seatId<10; seatId++) {
			$('#inputPlayer'+seatId).val('');
		}
	}
}

function sendCard() {
	if (this.mark != 's' && this.mark != 'h' && this.mark != 'd' && this.mark != 'c') {
		$('#message').html('mark is invalid!');
		return;
	}
	if (this.num != '2' && this.num != '3' && this.num != '4' && this.num != '5' && this.num != '6' &&
		this.num != '7' && this.num != '8' && this.num != '9' && this.num != 'T' && this.num != 'J' &&
		this.num != 'Q' && this.num != 'K' && this.num != 'A') {
		$('#message').html('number is invalid!');
		return;
	}
	sendImage(this.num+this.mark);
}

function drawImage() {
	switch (this.mark) {
		case 's':
			$('#image').html('<span style="color:#000000;font-size:64px;">'+this.num+'♠</span>'); break;
		case 'h':
			$('#image').html('<span style="color:#ff0000;font-size:64px;">'+this.num+'♥</span>'); break;
		case 'd':
			$('#image').html('<span style="color:#0000ff;font-size:64px;">'+this.num+'♦</span>'); break;
		case 'c':
			$('#image').html('<span style="color:#00bb00;font-size:64px;">'+this.num+'♣</span>'); break;
		default:
			$('#image').html('<span style="color:#000000;font-size:64px;">'+this.num+'</span>'); break;
	}
}

function drawSentImage(sentImage) {
	switch (sentImage[1]) {
		case 's':
			$('#sentImage').html('<span style="color:#000000;font-size:64px;">'+sentImage[0]+'♠</span>'); break;
		case 'h':
			$('#sentImage').html('<span style="color:#ff0000;font-size:64px;">'+sentImage[0]+'♥</span>'); break;
		case 'd':
			$('#sentImage').html('<span style="color:#0000ff;font-size:64px;">'+sentImage[0]+'♦</span>'); break;
		case 'c':
			$('#sentImage').html('<span style="color:#00bb00;font-size:64px;">'+sentImage[0]+'♣</span>'); break;
		default:
			$('#sentImage').html('<span style="color:#000000;font-size:64px;">'+sentImage[0]+'</span>'); break;
	}
}

function keyDown() {
	var inputString = $('#inputArea').val().toUpperCase() + String.fromCharCode(event.keyCode).toLowerCase();
	if (easyMode == true) { // 簡易入力モード
		var indexOfResult = cardsForEasyMode.indexOf(inputString);
		if (indexOfResult >= 0) { // Hit!
			sendImage(cards[indexOfResult]);
			setTimeout(function(){ $('#inputArea').val(''); }, 100);
			return;
		}
		if (inputString == 'g') {
			sound();
			setTimeout(function(){ $('#inputArea').val(''); }, 100);
		}
	} else {
		if (cards.indexOf(inputString) >= 0) { // Hit!
			sendImage(inputString);
			setTimeout(function(){ $('#inputArea').val(''); }, 100);
		}
	}
}
function keyUpPlayer(seatId) {
	var updateName = $('#inputPlayer'+seatId).val();
	socket.emit('updatePlayerName', {
		seatId: seatId,
		name: updateName
	});
}
function deletePlayer(seatId) {
	$('#inputPlayer'+seatId).val('');
	socket.emit('updatePlayerName', {
		seatId: seatId,
		name: ""
	});
}
function moveDealerButton() {
	socket.emit('moveDealerButton', {});
}

$("#changeInputMode").change(function(){
	switch ($(this).val()) {
		case 'easy':
			easyMode = true;  break;
		case 'normal':
			easyMode = false; break;
		case 'qrCode':
			document.getElementById("inputArea").innerHTML = passWord;
			return;
	}
	document.getElementById("inputArea").innerHTML =
		'<input type="text" onkeydown="keyDown();" id="inputArea" class="form-control">';
});

function sound() {
	var str = "";
	str = str + "<EMBED id = 'id_sound'";
	str = str + " SRC=/music/cursor6.wav";
	str = str + " AUTOSTART='true'";
	str = str + " HIDDEN='true'>";
	document.getElementById("id_sound").innerHTML = str;
}

$(function(){
	var canvasForVideo = $('#canvasForVideo').get(0);
	var canvas = $('#canvas').get(0);
	config.ctxForVideo = canvasForVideo.getContext("2d");
	config.ctx = canvas.getContext("2d");
});

socket.on('tableInfo', function(tableInfo) {
	var players = tableInfo.players;
	var board = tableInfo.board;
	drawBackGround();
	for (var key in players) {
		var player = players[key];
		if (!player) continue;
		drawBox(player.seatId);
		if (player.isActive == true) {
			drawPlayerHands(player.seatId, player.hand);
		}
		drawPlayerWinperAndName(player.seatId, player.win, player.tie, player.name, player.isActive);
		if (board && board.length > 0) {
			drawBoard(board)
		}
	}
	drawDealerButton(tableInfo.button);
});

socket.on('passWord', function(getPassWord) {
	passWord = getPassWord;
});

// ビデオの描画
setInterval(function(){
	config.ctxForVideo.drawImage(video, 0, 0, config.canvasWidth, config.canvasHeight);
}, 50);

// ここからフロント表示部分の関数
function drawBackGround() {
	//setColorAndFont('yellow', 0);
	//config.ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
	config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
}

function drawBox(seatId) {
	var drawX = Math.floor(seatId/5)*(config.canvasWidth-config.boxWidth);
	var drawY = Math.floor(seatId%5)*config.displayHeight + config.displayCardHeight;
	var halfBoxHeight = Math.floor(config.boxHeight/2);
	setColorAndFont('black', 0);
	config.ctx.fillRect(drawX, drawY, config.boxWidth, halfBoxHeight);
	setColorAndFont('white', 0);
	drawY += halfBoxHeight;
	config.ctx.fillRect(drawX, drawY, config.boxWidth, halfBoxHeight);
}
function drawDealerButton(seatId) {
	var radius = Math.floor(config.boxHeight/2);
	var drawX = Math.floor(seatId/5)*(config.canvasWidth-config.boxWidth);
	var drawY = Math.floor(seatId%5)*config.displayHeight + config.displayCardHeight + radius;
	if (seatId < 5) {
		drawX += config.boxWidth + radius;
	} else {
		drawX -= radius;
	}
	setColorAndFont('white', 0);
	config.ctx.beginPath();
	config.ctx.arc(drawX, drawY, radius, 0, Math.PI*2, false);
	config.ctx.fill();
	setColorAndFont('green', config.fontSize+5);
	drawX -= radius/2; drawY += radius/2;
	config.ctx.fillText('D', drawX, drawY);
}

function drawPlayerHands(playerId, playerHands) {
	var drawX = Math.floor(playerId/5)*(config.canvasWidth-config.boxWidth);
	var drawY = Math.floor(playerId%5)*config.displayHeight;
	if (playerHands && playerHands[0]) {
		drawCard(playerHands[0], drawX, drawY);
	}
	if (playerHands && playerHands[1]) {
		drawX += config.displayCardWidth;
		drawCard(playerHands[1], drawX, drawY);
	}
}

function drawPlayerWinperAndName(seatId, winPer, tiePer, playerName, isActive) {
	setColorAndFont('white', config.fontSize);
	var drawX = Math.floor(seatId/5)*(config.canvasWidth - config.boxWidth) + 3;
	var drawY = Math.floor(seatId%5)*config.displayHeight + config.displayCardHeight + config.fontSize - 2;
	if (playerName) {
		config.ctx.fillText(playerName, drawX, drawY);
	}
	drawY += config.fontSize;
	if (typeof isActive == 'undefined') return;
	setColorAndFont('black', config.fontSize);
	if (isActive == false) {
		config.ctx.fillText('Fold', drawX, drawY);
		return;
	}
	if (winPer) {
		var win = Math.round(Number(winPer.slice(0, -1)) * 10 ) / 10;
		var drawPercent = win + '％';
		if (tiePer) {
			var tie = Math.round(Number(tiePer.slice(0, -1)) * 10 ) / 10;
			if (tie >= 5) {
				drawPercent += '(' + tie +'％)';
				setColorAndFont('black', config.tieFontSize);
			}
		}
		config.ctx.fillText(drawPercent, drawX, drawY);
	}
}

function drawBoard(board) {
	setColorAndFont('green', 0);
	var drawX = Number(config.canvasWidth/2)-Number(config.boardWidth/2);
	var drawY = config.canvasHeight - config.boardHeight;
	config.ctx.fillRect(drawX, drawY, config.boardWidth, config.boardHeight);
	drawX += config.boardWidthSpace;
	drawY += config.boardHeightSpace;
	for (var key in board) {
		var card = board[key];
		drawCard(card, drawX, drawY);
		drawX += config.displayCardWidth;
	}
}

function drawCard(card,x,y) {
	setColorAndFont('white', 0);
	config.ctx.fillRect(x, y, config.cardFontSize*2-11, config.cardFontSize);
	drawX = x+2;
	drawY = y+config.cardFontSize-3;
	switch (card.charAt(1)) {
		case 's':
			setColorAndFont('black', config.cardFontSize);
			config.ctx.fillText(card.charAt(0), drawX, drawY);
			setColorAndFont('black', config.markFontSize);
			config.ctx.fillText('♠', drawX+config.markAdjust, drawY);
			return;
		case 'c':
			setColorAndFont('green', config.cardFontSize);
			config.ctx.fillText(card.charAt(0), drawX, drawY);
			setColorAndFont('green', config.markFontSize);
			config.ctx.fillText('♣', drawX+config.markAdjust, drawY);
			return;
		case 'd':
			setColorAndFont('blue', config.cardFontSize);
			config.ctx.fillText(card.charAt(0), drawX, drawY);
			setColorAndFont('blue', config.markFontSize);
			config.ctx.fillText('♦', drawX+config.markAdjust, drawY);
			return;
		case 'h':
			setColorAndFont('red', config.cardFontSize);
			config.ctx.fillText(card.charAt(0), drawX, drawY);
			setColorAndFont('red', config.markFontSize);
			config.ctx.fillText('♥', drawX+config.markAdjust, drawY);
			return;
	}
}

function setColorAndFont(color, size) {
	config.ctx.fillStyle = color;
	config.ctx.font = "bold "+size+"px \'ITC HIGHLANDER\'";
}
