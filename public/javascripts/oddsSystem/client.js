var socket = io.connect('http://'+hostAddress+'/oddsSystem');
var easyMode = false;
var mark = '';
var num  = '　'
var passWord = '';
var background = 'camera';
var tableInfo = {};
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
	cardFontSize: 26,
	fontSize: 12,
	visibility: 0.3,
	PlayersXY: [],
	nameFontMargin: 3
};
config.markFontSize = config.cardFontSize - 4;
config.markAdjust   = config.cardFontSize - parseInt(config.cardFontSize/3);
config.displayCardWidth  = config.cardFontSize*2-11;
config.displayCardHeight = config.cardFontSize;
config.displayWidth  = config.displayCardWidth*2;
config.nameBoxHeight = config.fontSize + config.nameFontMargin*2;
config.nameWinPerBoxWidth  = config.displayWidth;
config.nameWinPerBoxHeight = (config.fontSize + config.nameFontMargin*2) * 2;
config.displayHeight = config.displayCardHeight + config.nameWinPerBoxHeight;
config.boxWidth  = config.displayWidth;
config.boxHeight = config.displayHeight;
config.boardWidth  = config.displayCardWidth*5 + config.boardWidthSpace*2;
config.boardHeight = config.cardFontSize + config.boardHeightSpace*2;
config.tieFontSize = config.fontSize - 4;
config.dealerButtonRadius = parseInt(config.nameWinPerBoxHeight/2);

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

function moveDealerButton() {
	socket.emit('moveDealerButton', {});
}

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
	if (background === 'camera') {
		config.ctxForVideo.drawImage(video, 0, 0, config.canvasWidth, config.canvasHeight);
		return;
	}
	config.ctxForVideo.fillStyle = background;
	config.ctxForVideo.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
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
	$('#player'+seatId+'Folded').show();
	$('#player'+seatId+'Folded').textillate({
		in: { effect: 'swing' },
		callback: function() {
			$('#player'+seatId+'Box').stop().animate({ opacity: "0.5"}, 600);
		}
	});
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