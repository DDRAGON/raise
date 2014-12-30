
// PlayerBoxを左右に再配置する
function setLayoutSide(){
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
function setLayoutRound(){
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

$(function(){
	setLayoutRound(); // playerBoxの初期配置を環状にする

	$(".draggable").draggable({
		containment: "#canvas_pane",
		snap: "#canvas_pane"
	});

	$("#changeArrangement").change(function(){
		switch ($(this).val()) {
			case '上下':
				setLayoutRound();
				break;
			case '左右':
				setLayoutSide();
				break;
		}
	});
});