var lastTableInfo = {}; // 直前に取得したテーブル情報
var oddsList = [];

// socket:tableInfo イベント処理
function drawTableInfo(tableInfo) {
	var players = tableInfo.players;
	var board = tableInfo.board;
	var captionMessage = tableInfo.captionMessage;
	var descriptionMessage = tableInfo.descriptionMessage;

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
		displayOdds(player.seatId, player.win, player.tie);

		if (
			lastTableInfo.players &&
			lastTableInfo.players[key] &&
			isActive(lastTableInfo.players[key]) &&
			!isActive(player)
		) {
			displayFold(player.seatId);
		}
	}
	calculateOddsStyle();
	updateInputPlayerNames(players);
	updateCaptionMessage(captionMessage);
	updateDescriptionMessage(descriptionMessage);

	lastTableInfo = tableInfo;
}
addUpdateTableInfoListener(drawTableInfo);


function hideTable() { // テーブル情報を消す関数
	$('.board.card').removeClass(
		'color_s color_h color_d color_c ' +
		'color_s_for_blue_background color_h_for_blue_background color_d_for_blue_background color_c_for_blue_background ' +
		'color_s_for_green_background color_h_for_green_background color_d_for_green_background color_c_for_green_background ' +
		'mark_s mark_h mark_d mark_c'
	).text('');
	for (var playerId=0; playerId<10; playerId++) {
		$leftCard = $('#player'+playerId+'HandLeft');
		hideCard($leftCard);
		$rightCard = $('#player'+playerId+'HandRight');
		hideCard($rightCard);
	}
}

function displayInit() {
	$('.playerBox').hide(); // 名前を消したプレイヤーのplayerBoxを表示しないための初期化
	$('#board').hide();
	$('.actionBox').removeClass('actionF actionC actionR actionA ');
	$('.chipBox').removeClass('actionF actionC actionR actionA ');
	$('.btn_action').removeClass('active');
	$('.chipBox').text('');
	$('.chip_form').children().val('');
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
			$('.board.card').removeClass(
				'color_s color_h color_d color_c ' +
				'color_s_for_blue_background color_h_for_blue_background color_d_for_blue_background color_c_for_blue_background ' +
				'color_s_for_green_background color_h_for_green_background color_d_for_green_background color_c_for_green_background ' +
				'mark_s mark_h mark_d mark_c'
			).text('');
		});

	} else {
		// show
		$('#board').show();
		for (var boardNum=0; boardNum < 5; boardNum++) {
			if (!board[boardNum]) { // undoの対応 送られてきたデータに次のボード情報が無いときは消す。
				$('#board'+boardNum).hide();
				continue;
			}
			var cardCode = board[boardNum];
			$selector = $('#board'+boardNum);
			$selector.fadeIn();
			$selector.text(cardCode.charAt(0));
			switch (config.colorPattern) {
				case '1': $selector.addClass('color_'+cardCode.charAt(1)); break;
				case '2': $selector.addClass('color_'+cardCode.charAt(1)+'_for_blue_background'); break;
				case '3': $selector.addClass('color_'+cardCode.charAt(1)+'_for_green_background'); break;
			}
			$selector.addClass('mark_'+cardCode.charAt(1));
		}
	}
}

function displayHand(playerId, playerHands, isActive) {
	$leftCard = $('#player'+playerId+'HandLeft');
	$rightCard = $('#player'+playerId+'HandRight');
	if (playerHands && playerHands[0]) {
		if (isActive) {
			displayCard($leftCard, playerHands[0]);
		} else {
			semitransparentDisplayCard($leftCard, playerHands[0]);
		}
	} else {
		hideCard($leftCard);
	}
	if (playerHands && playerHands[1]) {
		if (isActive) {
			displayCard($rightCard, playerHands[1]);
		} else {
			semitransparentDisplayCard($rightCard, playerHands[1]);
		}
	} else {
		hideCard($rightCard);
	}
}
function hideCard($selector) {
	$selector.hide();
	$selector.removeClass(
		'color_s color_h color_d color_c ' +
		'color_s_for_blue_background color_h_for_blue_background color_d_for_blue_background color_c_for_blue_background ' +
		'color_s_for_green_background color_h_for_green_background color_d_for_green_background color_c_for_green_background ' +
		'mark_s mark_h mark_d mark_c'
	).text('');
}
function displayCard($selector, code) {
	$selector.text(code.charAt(0));
	switch (config.colorPattern) {
		case '1': $selector.addClass('color_'+code.charAt(1)); break;
		case '2': $selector.addClass('color_'+code.charAt(1)+'_for_blue_background'); break;
		case '3': $selector.addClass('color_'+code.charAt(1)+'_for_green_background'); break;
	}
	$selector.addClass('mark_'+code.charAt(1));
	$selector.css({"opacity": 1});
	$selector.fadeIn();
}

function semitransparentDisplayCard($selector, code) {
	$selector.css({"opacity": 0.4});
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

function displayOdds(seatId, winPer, tiePer) {
	var $playerOdds = $('#player'+seatId+"Odds");
	if(!winPer) {
		// clear
		$playerOdds.hide();

	} else {
		//show
		var win = Number(winPer.replace('%',''));
		if(tiePer) {
			win += Number(tiePer.replace('%',''));
		}
		win = Math.round(win);
		oddsList.push(win);
		$playerOdds
			.attr('data-win', win)
			.text(win + '%')
			.show()
	}
}

function calculateOddsStyle() {
	var $odds = $('.odds');
	$odds.removeClass('max win');
	var max = Math.max.apply(null, oddsList);
	$(".odds[data-win='"+max+"']").addClass('max');
	$(".odds[data-win='100']").addClass('win');
	oddsList = [];
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

function updateCaptionMessage(captionMessage) {
	var box = $('#captionBox');
	box.text(captionMessage);

	if(box.text().length > 0) {
		box.show();
	} else {
		box.hide();
	}
}

function updateDescriptionMessage(descriptionMessage) {
	var box = $('#descriptionBox');
	box.text(descriptionMessage);

	if(box.text().length > 0) {
		box.show();
	} else {
		box.hide();
	}
}


function disConnected() {
	alert("接続が切れました！\nリロードし再度設定してください。");
}
