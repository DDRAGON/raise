function setPassword(pw) {
	$('#room_id').attr('value', pw);
}
addUpdatePasswordListener(setPassword);

// PlayerBoxを環状に再配置する
function setLayoutRound() {
	var displayAreaWidth  = Number(config.canvasWidth);
	var displayAreaHeight = Number(config.canvasHeight);

	// name
	var fontSize         = parseInt(displayAreaHeight*10 / DEFAULT_CANVAS_HEIGHT);  // 10:360 = x:displayAreaHeight
	var cardFontSize     = parseInt(displayAreaHeight*16 / DEFAULT_CANVAS_HEIGHT);  // 16:360 = x:displayAreaHeight
	var foldFontSize     = parseInt(displayAreaHeight*12 / DEFAULT_CANVAS_HEIGHT);  // 16:360 = x:displayAreaHeight
	var nameWidth        = parseInt(displayAreaWidth*67  / DEFAULT_CANVAS_WIDTH);  // 67:640 = x:displayAreaWidth
	var dealerWidth      = parseInt(displayAreaWidth*18  / DEFAULT_CANVAS_WIDTH);  // 18:640 = x:displayAreaWidth
	var foldPaddingLeft  = parseInt(displayAreaHeight*20 / DEFAULT_CANVAS_WIDTH); // 10:640 = y:displayAreaWidth
	var cardPaddingTop   = parseInt(displayAreaHeight*5  / DEFAULT_CANVAS_HEIGHT); // 5:360 = y:displayAreaHeight
	var foldPaddingTop   = parseInt(displayAreaHeight*10 / DEFAULT_CANVAS_HEIGHT); // 5:360 = y:displayAreaHeight
	var cardHolderHeight = parseInt(displayAreaHeight*30 / DEFAULT_CANVAS_HEIGHT); // 30:360 = y:displayAreaHeight
	var chipAreaHeight   = 0;
	if (config.isDisplayChipBox == true) {
		chipAreaHeight   = parseInt(displayAreaHeight*18 / DEFAULT_CANVAS_HEIGHT); // 18:360 = y:displayAreaHeight
	}

	// playerBox
	var playerBoxWidth  = dealerWidth + nameWidth + 8;
	var playerBoxHeight = parseInt(displayAreaHeight*66 / DEFAULT_CANVAS_HEIGHT) + chipAreaHeight;// 66:360 = y:displayAreaHeight

	$("#canvas_pane").css({"width": displayAreaWidth+"px" , "height": displayAreaHeight+"px"});

	// board
	var boardTop  = parseInt(210*displayAreaHeight / DEFAULT_CANVAS_HEIGHT); // 360:210 = displayAreaHeight: y
	var boardLeft = parseInt(203*displayAreaWidth  / DEFAULT_CANVAS_WIDTH ); // 640:203 = displayAreaWidth: x
	var boardCardWidth  = parseInt(39*displayAreaWidth  / DEFAULT_CANVAS_WIDTH ); // 640:39 = displayAreaWidth: x
	var boardCardHeight = parseInt(48*displayAreaWidth  / DEFAULT_CANVAS_WIDTH ); // 640:48 = displayAreaHeight: y
	$("#board").css({"top": boardTop+"px" , "left": boardLeft+"px"});
	$("#board0").css({"width": boardCardWidth+"px" , "height": boardCardHeight+"px", font: cardFontSize+"pt Arial, sans-serif"});
	$("#board1").css({"width": boardCardWidth+"px" , "height": boardCardHeight+"px", font: cardFontSize+"pt Arial, sans-serif"});
	$("#board2").css({"width": boardCardWidth+"px" , "height": boardCardHeight+"px", font: cardFontSize+"pt Arial, sans-serif"});
	$("#board3").css({"width": boardCardWidth+"px" , "height": boardCardHeight+"px", font: cardFontSize+"pt Arial, sans-serif"});
	$("#board4").css({"width": boardCardWidth+"px" , "height": boardCardHeight+"px", font: cardFontSize+"pt Arial, sans-serif"});

	// playerBox
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
	for (var seatId = 0; seatId < 10; seatId++) {
		$('#player'+seatId+'Hand').css({height: cardHolderHeight+"px"});
		$('#player'+seatId+'HandLeft').css({'padding-top': cardPaddingTop+"px", font: cardFontSize+"pt Arial, sans-serif"});
		$('#player'+seatId+'HandRight').css({'padding-top': cardPaddingTop+"px", font: cardFontSize+"pt Arial, sans-serif"});
		$('#player'+seatId+'Name').css({width: nameWidth+"px"});
		$('#player'+seatId+'Dealer').css({width: dealerWidth+"px", 'font-size': fontSize+"pt"});
		$('#player'+seatId+'Box').css({'font-size': fontSize+"pt"});
		$('#player'+seatId+'Odds').css({'font-size': fontSize+"pt"});
		$('#player'+seatId+'Folded').css({'font-size': foldFontSize+"pt", 'padding-left': foldPaddingLeft+"px", 'padding-left': "-5px"});
	}
}

function changePlayerName(seatId) {
	var updateName = $('#inputPlayer'+seatId).val();
	emitUpdatePlayerName(seatId, updateName, $('#assistant_id').val());
}

function deletePlayer(seatId) {
	$('#inputPlayer'+seatId).val('');
	emitUpdatePlayerName(seatId, '', $('#assistant_id').val());
}

function changeChip(seatId) {
	var chipMany = $('#inputChip'+seatId).val();
	emitChipUpdate(seatId, chipMany, $('#assistant_id').val());
}

function changeAction(seatId, action) {
	/*
	$('.player'+seatId+'.btn_action').removeClass('active');
	$('#inputAction'+action+seatId).addClass('active');
	var $actionBox = $('#player'+seatId+'Action');
	var $chipBox = $('#player'+seatId+'Chip');
	$chipBox.removeClass('actionF actionC actionR actionA ');
	$chipBox.addClass('action'+action);
	$actionBox.removeClass('actionF actionC actionR actionA ');
	$actionBox.addClass('action'+action);
	$actionBox.text(action);
	if(action == 'A') {
		$('#inputChip'+seatId).val('AllIn');
		$('#player'+seatId+'Chip').text('AllIn');
	} else {
		$('#inputChip'+seatId).val('');
		$('#player'+seatId+'Chip').text('');
	}
	$('#inputChip'+seatId).focus();
	*/
}

$(function(){
	setLayoutRound(); // playerBoxの初期配置を環状にする

	// Bootstrap-Select対応
	$('.selectpicker').selectpicker({ 'selectedText': 'cat' });
	$('.selectpicker.btn').addClass('btn-sm');

	// PlayerBoxのドラッグ可能設定
	$(".draggable").draggable({
		containment: "#canvas_pane"
	});

	// プレイヤー一覧のStyle設定
	$('.playerList.0').addClass('stripe_a');
	$('.playerList.1').addClass('stripe_b');

	// プレイヤーアクション 入力表示切替
	$('#showAdditionalForm').on('click', function(){
		// config.isDisplayChipBox の判定をひっくり返す
		if (config.isDisplayChipBox == false) {
			config.isDisplayChipBox = true;
		} else {
			config.isDisplayChipBox = false;
		}

		setLayoutRound();
		$('.actionBox').toggle();
		$('.chipBox').toggle();
		$('.action_form').toggle();
		$('.chip_form').toggle();
	});

	// メニューアコーディオン設定
	$('#howto_header').on('click', function() { $('#howto_items').collapse('toggle'); });
	$('#direction_header').on('click', function() { $('#direction_items').collapse('toggle'); });
	$('#player_header').on('click', function() { $('#player_items').collapse('toggle'); });
	$('#config_header').on('click', function() { $('#config_items').collapse('toggle'); });

	// カード入力フォーム表示切替
	$('#card_selector_toggle').on('click', function() { $('#card_selector').slideToggle(); });

	// アシスタントモード切替
	$('#assistant_id').on('focusout', function() {
		var assistant_id = $(this).val();
		if(assistant_id) {
			emitChangeAssistantMode('Assistant');
			emitUpdateAssistantPassword($('#assistant_id').val());
		} else {
			emitChangeAssistantMode('Original');
			emitUpdateAssistantPassword("");
		}
	});

	// Caption,Description入力設定
	$('#caption').on('keyup',function() {
		var captionMessage = $(this).val();
		emitCaptionMessage(captionMessage, $('#assistant_id').val());
	});
	$('#description').on('keyup',function() {
		var descriptionMessage = $(this).val();
		emitDescriptionMessage(descriptionMessage, $('#assistant_id').val());
	});

	// Main View レイアウト設定
	$('#layoutSetDefault').on('click', function() { setLayoutRound(); });
	$('#layoutShow').on('click', function() {
		$('#captionBox').show();
		$('#descriptionBox').show();
		$('.board').show();
		$('.playerBox').show();
	});
});
