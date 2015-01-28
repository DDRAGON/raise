var socket = io.connect('http://'+hostAddress+'/forDealer');

socket.on('tableInfo', function(tableInfo) {
	$('#debugWindow').html('tableInfo come');
	drawTableInfo(tableInfo);
});

function sendPassword() {
	var password = $('#inputPasswordArea').val();
	$('#debugWindow').html(password);
	socket.emit('changePassword', password);
	$('#canvas_pane').show();
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
	var windowWidth  = $(window).width();
	var windowHeight = $(window).height();
	if (windowWidth < windowHeight) { // 大きい方が横幅として調節
		var stack = windowHeight;
		windowHeight = windowWidth;
		windowWidth  = stack;
	}
	$("#canvas_pane").css({"width": windowWidth+"px" , "height": windowHeight+"px"});
	windowHeight -= 80;
	var boardTop  = parseInt(210*windowHeight / DEFAULT_CANVAS_HEIGHT); // 360:210 = windowHeight: y
	var boardLeft = parseInt(203*windowWidth  / DEFAULT_CANVAS_WIDTH ); // 640:203 = windowWidth: x
	$("#board").css({"top": boardTop+"px" , "left": boardLeft+"px"});

	var playerBoxWidth  = parseInt(windowWidth*85 / DEFAULT_CANVAS_WIDTH); // 85:640 = x:windowWidth
	var playerBoxHeight = Number($('#player0Box').css('height').replace('px',''));
	$('#player0Box').css({left: 0 + "px", top: windowHeight/2 - playerBoxHeight/2 + "px"});
	$('#player1Box').css({left: 0 + "px", top: 0 + "px"});
	$('#player2Box').css({left: windowWidth/3*1 - playerBoxWidth/2 + "px", top: 0 + "px"});
	$('#player3Box').css({left: windowWidth/3*2 - playerBoxWidth/2 + "px", top: 0 + "px"});
	$('#player4Box').css({left: windowWidth - playerBoxWidth + "px", top: 0 + "px"});
	$('#player5Box').css({left: windowWidth - playerBoxWidth + "px", top: windowHeight/2 - playerBoxHeight/2 + "px"});
	$('#player6Box').css({left: windowWidth - playerBoxWidth + "px", top: windowHeight - playerBoxHeight + "px"});
	$('#player7Box').css({left: windowWidth/3*2 - playerBoxWidth/2 + "px", top: windowHeight - playerBoxHeight + "px"});
	$('#player8Box').css({left: windowWidth/3*1 - playerBoxWidth/2 + "px", top: windowHeight - playerBoxHeight + "px"});
	$('#player9Box').css({left: 0 + "px", top: windowHeight - playerBoxHeight + "px"});
}

function bindTapAndTapHold() {
	for (var playerId = 0; playerId < 10; playerId++) {
		$('#player'+playerId+'Box').bind("taphold", tapHoldHandler);
		$('#player'+playerId+'Box').bind("tap", tapHandler);
	}
}

function tapHoldHandler(event) {
	var id = event.target.id;
	var seatId = id.substring(6, 7);
	var password = $('#inputPasswordArea').val();
	socket.emit(
		'deletePlayerWithPassword',
		{
			password: password,
			seatId: seatId
		}
	);
}

function tapHandler(event) {
	var id = event.target.id;
	var seatId = id.substring(6, 7);
	var password = $('#inputPasswordArea').val();
	socket.emit(
		'foldPlayerWithPassword',
		{
			password: password,
			seatId: seatId
		}
	);
}

$(function(){
	$('#canvas_pane').hide();
	setLayoutRound(); // playerBoxの初期配置を環状にする
	bindTapAndTapHold(); // イベントに合わせたバインド設定
});
