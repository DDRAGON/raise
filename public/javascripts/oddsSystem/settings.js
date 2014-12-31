function setPassword(pw) {
	$('#room_id').attr('value', pw);
}
addUpdatePasswordListener(setPassword);

// PlayerBoxを左右に再配置する
function setLayoutSides() {
	$('#player0Box').css({left:"0px", top:"10px"});
	$('#player1Box').css({left:"0px", top:"80px"});
	$('#player2Box').css({left:"0px", top:"150px"});
	$('#player3Box').css({left:"0px", top:"220px"});
	$('#player4Box').css({left:"0px", top:"290px"});
	$('#player5Box').css({left:"560px", top:"10px"});
	$('#player6Box').css({left:"560px", top:"80px"});
	$('#player7Box').css({left:"560px", top:"150px"});
	$('#player8Box').css({left:"560px", top:"220px"});
	$('#player9Box').css({left:"560px", top:"290px"});
}

// PlayerBoxを環状に再配置する
function setLayoutRound() {
	$('#player0Box').css({left:"0px", top:"150px"});
	$('#player1Box').css({left:"40px", top:"0px"});
	$('#player2Box').css({left:"200px", top:"0px"});
	$('#player3Box').css({left:"360px", top:"0px"});
	$('#player4Box').css({left:"520px", top:"0px"});
	$('#player5Box').css({left:"560px", top:"150px"});
	$('#player6Box').css({left:"520px", top:"294px"});
	$('#player7Box').css({left:"360px", top:"294px"});
	$('#player8Box').css({left:"200px", top:"294px"});
	$('#player9Box').css({left:"40px", top:"294px"});
}

function changePlayerName(seatId) {
	var updateName = $('#inputPlayer'+seatId).val();
	emitUpdatePlayerName(seatId, updateName, $('#assistant_id').val());
}

function deletePlayer(seatId) {
	$('#inputPlayer'+seatId).val('');
	emitUpdatePlayerName(seatId, '', $('#assistant_id').val());
}

$(function(){
	setLayoutRound(); // playerBoxの初期配置を環状にする

	$('.selectpicker').selectpicker({ 'selectedText': 'cat' });
	$('.selectpicker.btn').addClass('btn-sm');

	$('.playerList.1').addClass('stripe');

	$('#show_name').on('click', function(){ $('.action_form').hide(); $('.chip_form').hide(); });
	$('#show_name_action').on('click', function(){ $('.action_form').show(); $('.chip_form').hide(); });
	$('#show_name_action_chip').on('click', function(){ $('.action_form').show(); $('.chip_form').show(); });

	$('#player_header').on('click', function() { $('#player_items').collapse('toggle'); });
	$('#config_header').on('click', function() { $('#config_items').collapse('toggle'); });

	$('#config_header').on('click', function() { $('#config_items').collapse('toggle'); });

	$(".draggable").draggable({
		containment: "#canvas_pane",
		snap: "#canvas_pane"
	});

	$('#card_selector_toggle').on('click', function() {
		$('#card_selector').slideToggle();
		if($(this).text()=="Show"){
			$(this).text('Hide');
		} else {
			$(this).text('Show');
		}
	});

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

	$('#layoutRound').on('click', function() { setLayoutRound(); });
	$('#layoutSides').on('click', function() { setLayoutSides(); });
	$('#layoutShow').on('click', function() { $('.playerBox').show(); $('.board').show(); });
});
