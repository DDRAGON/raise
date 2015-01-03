var socket = io.connect('http://'+hostAddress+'/oddsSystem');
var easyMode = false;
var assistantMode = 'Original';
var mark = '';
var num = '　'
var passWord = '';
var background = 'camera';
var canvasForVideo;
var tableInfo = {};
var config = {
	canvasWidth: 640,
	canvasHeight: 360,
	originalCardWidth: 48,
	originalCardHeight: 64,
	displayCardWidth: 36,
	displayCardHeight: 48,
	space: 8,
	boardWidthSpace: 6,
	boardHeightSpace: 6,
	cardFontSize: 26,
	fontSize: 14,
	visibility: 0.3,
	PlayersXY: [],
	nameFontMargin: 3
};
config.markFontSize = config.cardFontSize - 4;
config.markAdjust = config.cardFontSize - parseInt(config.cardFontSize/3);
config.displayCardWidth = config.cardFontSize*2-11;
config.displayCardHeight = config.cardFontSize;
config.displayWidth = config.displayCardWidth*2;
config.nameBoxHeight = config.fontSize + config.nameFontMargin*2;
config.nameWinPerBoxWidth = config.displayWidth;
config.nameWinPerBoxHeight = (config.fontSize + config.nameFontMargin*2) * 2;
config.displayHeight = config.displayCardHeight + config.nameWinPerBoxHeight;
config.boxWidth = config.displayWidth;
config.boxHeight = config.displayHeight;
config.boardWidth = config.displayCardWidth*5 + config.boardWidthSpace*2;
config.boardHeight = config.cardFontSize + config.boardHeightSpace*2;
config.tieFontSize = config.fontSize - 4;
config.dealerButtonRadius = parseInt(config.nameWinPerBoxHeight/2);

var ASSISTANT_MODE_ORIGINAL = 'Original';
var ASSISTANT_MODE_ASSISTANT = 'Assistant';

$(function(){
	canvasForVideo = $('#canvasForVideo').get(0);
	config.ctxForVideo = canvasForVideo.getContext("2d");
});

$("#changeBackground").change(function(){
	background = $(this).val();
	$('#canvas_pane').attr('class', 'wall_'+background);
});

socket.on('tableInfo', function(getTableInfo) {
	drawTableInfo(getTableInfo);
	tableInfo = getTableInfo;
});

socket.on('passWord', function(getPassWord) {
	passWord = getPassWord;
});

// ビデオの描画
setInterval(function(){
	if (!config.ctxForVideo) return;
	if (background === 'camera') {
		// 背景カメラモードならカメラを描画
		config.ctxForVideo.drawImage(video, 0, 0, config.canvasWidth, config.canvasHeight);
		return;
	}
}, 50);

// ここからフロント表示部分の関数

function drawTableInfo(getTableInfo) {
	var players = getTableInfo.players;
	var board = getTableInfo.board;
	clear();

	setDealerButton(getTableInfo.button);
	for (var key in players) {
		var player = players[key];
		if (!player) continue;

		if(player.isActive == true) {
			$('#player'+player.seatId+'Box').css({opacity:"1.0"});
			$('#player'+player.seatId+'Folded').hide();
		}

		setHand(player.seatId, player.hand, player.isActive);
		setName(player.seatId, player.name);
		setOdds(player.seatId, player.win, player.tie);

		// FOLD検知
		if (
				tableInfo.players &&
				tableInfo.players[key] &&
				tableInfo.players[key].isActive == true &&
				player.isActive == false
			) {
			tableInfo = getTableInfo;
			setFold(key);
		}
	}
	setBoard(board);
	updateInputPlayerNames(players);
}

function clear() {
	$('.playerBox').hide();
}

function setDealerButton(seatId) {
	$('.dealer').removeClass('on');
	$('#player'+seatId+'Dealer').addClass('on');
}

function setHand(playerId, playerHands, isActive) {
	$leftCard = $('#player'+playerId+'HandLeft');
	$rightCard = $('#player'+playerId+'HandRight');
	if (!isActive) {
		clearCard($leftCard);
		clearCard($rightCard);
		return;
	}
	if (playerHands && playerHands[0]) {
		setCard($leftCard, playerHands[0]);
	} else {
		clearCard($leftCard);
	}
	if (playerHands && playerHands[1]) {
		setCard($rightCard, playerHands[1]);
	} else {
		clearCard($rightCard);
	}
}

function setCard($selector, code) {
	$selector.text(code.charAt(0));
	$selector.addClass(code.charAt(1));
	$selector.fadeIn();
}

function clearCard($selector) {
	$selector.hide();
	$selector.removeClass('s h d c');
	$selector.text('');
}

function setName(seatId, playerName) {
	if(!playerName) return;
	$('#player'+seatId+"Box").show();
	$('#player'+seatId+"Name").text(playerName);
}

function setFold(seatId) {
	$('#player'+seatId+'Folded')
		.show()
		.textillate({
			in: { effect: 'swing' },
			callback: function() {
				$('#player'+seatId+'Box').stop().animate({ opacity: "0.5"}, 600);
			}
		})
		.textillate('start');
}

function setOdds(seatId, winPer, tiePer, playerName) {
	if(!winPer) {
		$('#player'+seatId+"Odds").text('');
		return;
	}
	var odds = (Math.round(Number(winPer.slice(0, -1)) * 10 ) / 10) + '％';
	if(tiePer) {
		var tie = Math.round(Number(tiePer.slice(0, -1)) * 10 ) / 10;
		if (tie >= 5) {
			odds += '(' + tie +'％)';
		}
	}
	$('#player'+seatId+"Odds").text(odds);
}

function setBoard(board) {
	if (!board || board.length <= 0) {
		$('.board').fadeOut(200, function() {
			$('.board.card').removeClass('s h d c');
			$('.board.card').text('');
		});
		return;
	}
	$('#board').show();
	for (var key in board) {
		var code = board[key];
		$card = $('#board'+key);
		$card.fadeIn();
		$card.text(code.charAt(0));
		$card.addClass(code.charAt(1));
	}
}

// プレイヤー書き込み一覧の書き換え
function updateInputPlayerNames(players) {
	for (var seatId=0; seatId<10; seatId++) {
		if (players[seatId]) {
			var player = players[seatId];
			$('#inputPlayer'+seatId).val(player.name);
		} else {
			$('#inputPlayer'+seatId).val('');
		}
	}
}
