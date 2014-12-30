function changePlayerName(seatId) {
	var updateName = $('#inputPlayer'+seatId).val();
	emitUpdatePlayerName(seatId, updateName, $('#passwordArea').val());
}

function deletePlayer(seatId) {
	$('#inputPlayer'+seatId).val('');
	emitUpdatePlayerName(seatId, '', $('#passwordArea').val());
}

$(function(){
	$('.playerList.0').addClass('stripe');

	$('#plain_form').on('click', function(){ $('.action_form').hide(); $('.chip_form').hide(); });
	$('#plain_action_form').on('click', function(){ $('.action_form').show(); $('.chip_form').hide(); });
	$('#plain_action_chip_form').on('click', function(){ $('.action_form').show(); $('.chip_form').show(); });
});
