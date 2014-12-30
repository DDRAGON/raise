var assistantMode = 'Original';

function keyUpAssistantPassword() {
	emitUpdateAssistantPassword($('#passwordArea').val());
}

$("#changeAssistantMode").change(function(){
	assistantMode = $(this).val();
	emitChangeAssistantMode(assistantMode);
	var outPutHtml = '<span style="color:#000000;font-size:18px;">　'+assistantMode+'</span>';
	switch (assistantMode) {
		case 'Original':
			emitUpdateAssistantPassword("");
			break;
		case 'Assistant':
			outPutHtml += '<br>pass word:<input type="password" onkeyup="keyUpAssistantPassword();" id="passwordArea">';
			break;
	}
	$('#AssistantModeDisplay').html(outPutHtml);
});