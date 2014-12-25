
function setLocationSide(){
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

function setLocationRound(){
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
	socket.emit('updatePlayerName', {
		seatId: seatId,
		name: updateName
	});
}
function deletePlayer(seatId) {
	$('#inputPlayer'+seatId).val('');
	socket.emit('updatePlayerName', {
		seatId: seatId,
		name: ""
	});
}

$(function(){
	$('.playerList.0').css({backgroundColor:"#F6F6F6"});
	setLocationRound();

	$(".draggable").draggable({
		containment: "#canvas_pane",
		snap: "#canvas_pane"
	});

	$('#plain_form').on('click', function(){ $('.action_form').hide(); $('.chip_form').hide(); });
  $('#plain_action_form').on('click', function(){ $('.action_form').show(); $('.chip_form').hide(); });
  $('#plain_action_chip_form').on('click', function(){ $('.action_form').show(); $('.chip_form').show(); });

  $("#changeArrangement").change(function(){
  	switch ($(this).val()) {
  		case '上下':
  			setLocationRound();
  			break;
  		case '左右':
  			setLocationSide();
  			break;
  	}
  });
});
