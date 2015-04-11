function setPassword(pw) {
	$('#room_id').attr('value', pw);
}
addUpdatePasswordListener(setPassword);

// PlayerBoxを環状に再配置する
function setLayoutRound() {
	var canvasWidth  = Number(config.canvasWidth);
	var canvasHeight = Number(config.canvasHeight);

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

function changePlayerName(seatId) {
	var updateName = $('#inputPlayer'+seatId).val();
	emitUpdatePlayerName(seatId, updateName, $('#assistant_id').val());
}

function deletePlayer(seatId) {
	$('#inputPlayer'+seatId).val('');
	emitUpdatePlayerName(seatId, '', $('#assistant_id').val());
}

function changeChip(seatId) {
	var chip = $('#inputChip'+seatId).val();
	$('#player'+seatId+'Chip').text(chip);
}

function changeAction(seatId, action) {
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
		$('#inputChip'+seatId).val('All In');
		$('#player'+seatId+'Chip').text('All In');
	} else {
		$('#inputChip'+seatId).val('');
		$('#player'+seatId+'Chip').text('');
	}
	$('#inputChip'+seatId).focus();
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
		$('.actionBox').toggle();
		$('.chipBox').toggle();
		$('.action_form').toggle();
		$('.chip_form').toggle();
		setLayoutRound();
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
		var box = $('#captionBox')
		box.text($(this).val());
		if(box.text().length > 0) {
			box.show();
		} else {
			box.hide();
		}
	});
	$('#description').on('keyup',function() {
		var box = $('#descriptionBox')
		box.text($(this).val());
		if(box.text().length > 0) {
			box.show();
		} else {
			box.hide();
		}
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
