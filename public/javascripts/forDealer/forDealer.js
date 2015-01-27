var socket = io.connect('http://'+hostAddress+'/forDealer');

socket.on('tableInfo', function(tableInfo) {
	$('#debugWindow').html('tableInfo come');
	drawTableInfo(tableInfo);
});

function sendPassword() {
	var password = $('#inputPasswordArea').val();
	$('#debugWindow').html(password);
	socket.emit('changePassword', password);
}

var lastTableInfo = {}; // 直前に取得したテーブル情報
var oddsList = [];
// socket:tableInfo イベント処理
function drawTableInfo(tableInfo) {
	var players = tableInfo.players;
	var board = tableInfo.board;

	displayInit();

	displayDealerButton(tableInfo.button);
	displayBoard(board);
	for (var key in players) {
		var player = players[key];
		if (!player) continue;

		if(isActive(player)) {
			resetPlayerBox(player.seatId);
		}

		displayName(player.seatId, player.name);
		displayHand(player.seatId, player.hand, player.isActive);

		// FOLD検知
		if (
			lastTableInfo.players &&
				lastTableInfo.players[key] &&
				isActive(lastTableInfo.players[key]) &&
				!isActive(player)
			) {
			displayFold(player.seatId);
		}
	}
	lastTableInfo = tableInfo;
}

function displayInit() {
	$('.playerBox').hide(); // 名前を消したプレイヤーのplayerBoxを表示しないための初期化
}

function resetPlayerBox(seatId) {
	// アクションをクリア
	$('#player'+seatId+'Folded').hide();
	$('#player'+seatId+'Box').css({opacity:"1.0"}); // Fold（半透明）状態を解除
}

function isActive(targetPlayer) {
	// 文字列の場合があるのでラップする
	return targetPlayer.isActive == true;
}

function displayDealerButton(seatId) {
	$('.dealer').removeClass('on');
	$('#player'+seatId+'Dealer').addClass('on');
}

function displayBoard(board) {
	if (!board || board.length <= 0) {
		// clear
		$('.board').fadeOut(200, function() {
			$('.board.card').removeClass('color_s color_h color_d color_c mark_s mark_h mark_d mark_c').text('');
		});

	} else {
		// show
		$('#board').show();
		for (var key in board) {
			var cardCode = board[key];
			$selector = $('#board'+key);
			$selector.fadeIn();
		}
	}
}

function displayHand(playerId, playerHands, isActive) {
	$leftCard = $('#player'+playerId+'HandLeft');
	$rightCard = $('#player'+playerId+'HandRight');
	if (!isActive) {
		hideCard($leftCard);
		hideCard($rightCard);
		return;
	}
	if (playerHands && playerHands[0]) {
		displayCard($leftCard, '0s');
	} else {
		hideCard($leftCard);
	}
	if (playerHands && playerHands[1]) {
		displayCard($rightCard, '1h');
	} else {
		hideCard($rightCard);
	}
}
function hideCard($selector) {
	$selector.hide();
	$selector.removeClass('color_s color_h color_d color_c mark_s mark_h mark_d mark_c').text('');
}
function displayCard($selector, code) {
	$selector.text("●");
	$selector.fadeIn();
}

function displayName(seatId, playerName) {
	if(!playerName) return;
	$('#player'+seatId+"Box").show();
	$('#player'+seatId+"Name").text(playerName);
}

function displayFold(seatId) {
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


var DEFAULT_CANVAS_WIDTH  = 640;
var DEFAULT_CANVAS_HEIGHT = 360;
// PlayerBoxを環状に再配置する
function setLayoutRound() {
	var canvasWidth  = DEFAULT_CANVAS_WIDTH;
	var canvasHeight = DEFAULT_CANVAS_HEIGHT;
	var playerBoxWidth = Number($('#player0Box').css('width').replace('px',''));
	var playerBoxHeight = Number($('#player0Box').css('height').replace('px',''));
	$('#player0Box').css({left: 0 + "px", top: canvasHeight/2 - playerBoxHeight/2 + "px"});
	$('#player1Box').css({left: 0 + "px", top: 0 + "px"});
	$('#player2Box').css({left: canvasWidth/3*1 - playerBoxWidth/2 + "px", top: 0 + "px"});
	$('#player3Box').css({left: canvasWidth/3*2 - playerBoxWidth/2 + "px", top: 0 + "px"});
	$('#player4Box').css({left: canvasWidth - playerBoxWidth + "px", top: 0 + "px"});
	$('#player5Box').css({left: canvasWidth - playerBoxWidth + "px", top: canvasHeight/2 - playerBoxHeight/2 + "px"});
	$('#player6Box').css({left: canvasWidth - playerBoxWidth + "px", top: canvasHeight - playerBoxHeight + "px"});
	$('#player7Box').css({left: canvasWidth/3*2 - playerBoxWidth/2 + "px", top: canvasHeight - playerBoxHeight + "px"});
	$('#player8Box').css({left: canvasWidth/3*1 - playerBoxWidth/2 + "px", top: canvasHeight - playerBoxHeight + "px"});
	$('#player9Box').css({left: 0 + "px", top: canvasHeight - playerBoxHeight + "px"});
}

$(function(){
	setLayoutRound(); // playerBoxの初期配置を環状にする
});
