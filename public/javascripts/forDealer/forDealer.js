var socket = io.connect('http://'+hostAddress+'/forDealer');
var password;

socket.on('tableInfo', function(tableInfo) {
	$('#debugWindow').html('tableInfo come');
	drawTableInfo(tableInfo);
});

function sendPassword() {
	password = $('#inputPasswordArea').val();
	$('#debugWindow').html(password);
	socket.emit('changePassword', password);
	$('#passwordArea').remove();
	$('#canvas_pane').show();
	$('#controlButton').show();
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
	//$selector.text("●");
	$selector.text('O');
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
var DEFAULT_BUTTON_WIDTH  = 120;
var DEFAULT_BUTTON_HEIGHT = 36;
// PlayerBoxを環状に再配置する
function setLayoutRound() {
	var windowWidth  = $(window).width();
	var windowHeight = $(window).height();
	var buttonWidth  = parseInt(DEFAULT_BUTTON_WIDTH*windowWidth / DEFAULT_CANVAS_WIDTH); // DEFAULT_CANVAS_WIDTH:DEFAULT_BUTTON_WIDTH = windowWidth:x
	var buttonHeight = parseInt(DEFAULT_BUTTON_HEIGHT*windowHeight / DEFAULT_CANVAS_HEIGHT); // DEFAULT_CANVAS_HEIGHT:DEFAULT_BUTTON_HEIGHT = windowHeight:y
	var displayAreaWidth  = windowWidth;
	var displayAreaHeight = windowHeight - buttonHeight;

	$("#canvas_pane").css({"width": displayAreaWidth+"px" , "height": displayAreaHeight+"px"});
	var boardTop  = parseInt(210*displayAreaHeight / DEFAULT_CANVAS_HEIGHT); // 360:210 = displayAreaHeight: y
	var boardLeft = parseInt(203*displayAreaWidth  / DEFAULT_CANVAS_WIDTH ); // 640:203 = displayAreaWidth: x
	$("#board").css({"top": boardTop+"px" , "left": boardLeft+"px"});

	// playerBox
	var playerBoxWidth  = parseInt(displayAreaWidth*85  / DEFAULT_CANVAS_WIDTH); // 85:640 = x:displayAreaWidth
	var playerBoxHeight = parseInt(displayAreaHeight*66 / DEFAULT_CANVAS_HEIGHT);// 66:360 = y:displayAreaHeight
	$('#player0Box').css({left: 0 + "px", top: displayAreaHeight/2 - playerBoxHeight/2 + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player1Box').css({left: 0 + "px", top: 0 + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player2Box').css({left: displayAreaWidth/3*1 - playerBoxWidth/2 + "px", top: 0 + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player3Box').css({left: displayAreaWidth/3*2 - playerBoxWidth/2 + "px", top: 0 + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player4Box').css({left: displayAreaWidth - playerBoxWidth + "px", top: 0 + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player5Box').css({left: displayAreaWidth - playerBoxWidth + "px", top: displayAreaHeight/2 - playerBoxHeight/2 + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player6Box').css({left: displayAreaWidth - playerBoxWidth + "px", top: displayAreaHeight - playerBoxHeight + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player7Box').css({left: displayAreaWidth/3*2 - playerBoxWidth/2 + "px", top: displayAreaHeight - playerBoxHeight + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player8Box').css({left: displayAreaWidth/3*1 - playerBoxWidth/2 + "px", top: displayAreaHeight - playerBoxHeight + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});
	$('#player9Box').css({left: 0 + "px", top: displayAreaHeight - playerBoxHeight + "px", width: playerBoxWidth+"px", height: playerBoxHeight+"px"});

	// name
	var fontSize       = parseInt(displayAreaWidth*10 / DEFAULT_CANVAS_WIDTH);  // 10:640 = x:displayAreaWidth
	var cardFontSize   = parseInt(displayAreaWidth*16 / DEFAULT_CANVAS_WIDTH);  // 16:640 = x:displayAreaWidth
	var nameWidth      = parseInt(displayAreaWidth*67 / DEFAULT_CANVAS_WIDTH);  // 67:640 = x:displayAreaWidth
	var dealerWidth    = parseInt(displayAreaWidth*18 / DEFAULT_CANVAS_WIDTH);  // 18:640 = x:displayAreaWidth
	var cardPaddingTop = parseInt(displayAreaHeight*5 / DEFAULT_CANVAS_HEIGHT); // 5:360 = y:displayAreaHeight
	var cardHolderHeight = parseInt(displayAreaHeight*30 / DEFAULT_CANVAS_HEIGHT); // 30:360 = y:displayAreaHeight
	for (var seatId = 0; seatId < 10; seatId++) {
		$('#player'+seatId+'Hand').css({height: cardHolderHeight+"px"});
		$('#player'+seatId+'HandLeft').css({'padding-top': cardPaddingTop+"px", font: cardFontSize+"pt Arial, sans-serif"});
		$('#player'+seatId+'HandRight').css({'padding-top': cardPaddingTop+"px", font: cardFontSize+"pt Arial, sans-serif"});
		$('#player'+seatId+'Name').css({width: nameWidth+"px"});
		$('#player'+seatId+'Dealer').css({width: dealerWidth+"px", 'font-size': fontSize+"pt"});
		$('#player'+seatId+'Box').css({'font-size': fontSize+"pt"});
		$('#player'+seatId+'Odds').css({'font-size': fontSize+"pt"});
		$('#player'+seatId+'Folded').css({'font-size': cardFontSize+"pt"});
	}

	// button
	var buttonFontSize = parseInt(buttonHeight / 2);
	$('#nextButton').css({width: buttonWidth+"px", height: buttonHeight+"px", font: buttonFontSize+"px Arial, sans-serif"});
	$('#showOptionButton').css({width: buttonWidth+"px", height: buttonHeight+"px", font: buttonFontSize+"px Arial, sans-serif"});
	$('#resetButton').css({width: buttonWidth+"px", height: buttonHeight+"px", font: buttonFontSize+"px Arial, sans-serif"});
}

$( window ).on( "orientationchange", function( event ) { // 画面が回転したとき
	setLayoutRound(); // レイアウト位置を計算し
	drawTableInfo(lastTableInfo); // 再度描画する。
});

function bindTapAndTapHold() {
	for (var playerId = 0; playerId < 10; playerId++) {
		$('#player'+playerId+'Box').bind("taphold", tapHoldHandler);
		$('#player'+playerId+'Box').bind("tap", tapHandler);
	}
}

function tapHoldHandler(event) {
	var id = event.target.id;
	var seatId = id.substring(6, 7);
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
	socket.emit(
		'foldPlayerWithPassword',
		{
			password: password,
			seatId: seatId
		}
	);
}

function showOption() {
	toggleButtons();
}

function sendNextGame() {
	socket.emit(
		'imageSendWithPassWord',
		{
			password: password,
			image: 'nextGame'
		}
	);
	toggleButtons();
}

function sendResetGame() {
	socket.emit(
		'imageSendWithPassWord',
		{
			password: password,
			image: 'resetGame'
		}
	);
	toggleButtons();
}

function toggleButtons() {
	$('#nextButton').toggle();
	$('#resetButton').toggle();
}


$(function(){
	$('#canvas_pane').hide();
	$('#nextButton').hide();
	$('#resetButton').hide();
	$('#controlButton').hide();
	$(".ui-loader").remove();
	setLayoutRound(); // playerBoxの初期配置を環状にする
	bindTapAndTapHold(); // イベントに合わせたバインド設定
});
