function markClick(mark) {
	this.mark = mark;
	drawImage();
}

function numClick(num) {
	this.num = num;
	drawImage();
}

function sendImage(image) {
	socket.emit('imageSend', image);
	sound();
	$('#message').html('send '+image);
	this.mark = '';
	this.num  = '　';
	drawImage();
	drawSentImage(image);
	if (image == 'start') {
		for (var seatId=0; seatId<10; seatId++) {
			$('#inputPlayer'+seatId).val('');
		}
	}
}

function sendCard() {
	if (this.mark != 's' && this.mark != 'h' && this.mark != 'd' && this.mark != 'c') {
		$('#message').html('mark is invalid!');
		return;
	}
	if (this.num != '2' && this.num != '3' && this.num != '4' && this.num != '5' && this.num != '6' &&
		this.num != '7' && this.num != '8' && this.num != '9' && this.num != 'T' && this.num != 'J' &&
		this.num != 'Q' && this.num != 'K' && this.num != 'A') {
		$('#message').html('number is invalid!');
		return;
	}
	sendImage(this.num+this.mark);
}

function drawImage() {
	switch (this.mark) {
		case 's':
			$('#image').html('<span style="color:#000000;font-size:64px;">'+this.num+'♠</span>'); break;
		case 'h':
			$('#image').html('<span style="color:#ff0000;font-size:64px;">'+this.num+'♥</span>'); break;
		case 'd':
			$('#image').html('<span style="color:#0000ff;font-size:64px;">'+this.num+'♦</span>'); break;
		case 'c':
			$('#image').html('<span style="color:#00bb00;font-size:64px;">'+this.num+'♣</span>'); break;
		default:
			$('#image').html('<span style="color:#000000;font-size:64px;">'+this.num+'</span>'); break;
	}
}

function drawSentImage(sentImage) {
	switch (sentImage[1]) {
		case 's':
			$('#sentImage').html('<span style="color:#000000;font-size:64px;">'+sentImage[0]+'♠</span>'); break;
		case 'h':
			$('#sentImage').html('<span style="color:#ff0000;font-size:64px;">'+sentImage[0]+'♥</span>'); break;
		case 'd':
			$('#sentImage').html('<span style="color:#0000ff;font-size:64px;">'+sentImage[0]+'♦</span>'); break;
		case 'c':
			$('#sentImage').html('<span style="color:#00bb00;font-size:64px;">'+sentImage[0]+'♣</span>'); break;
		default:
			$('#sentImage').html('<span style="color:#000000;font-size:64px;">'+sentImage[0]+'</span>'); break;
	}
}

function keyDown() {
	var inputString = $('#inputArea').val().toUpperCase() + String.fromCharCode(event.keyCode).toLowerCase();
	if (easyMode == true) { // 簡易入力モード
		var indexOfResult = cardsForEasyMode.indexOf(inputString);
		if (indexOfResult >= 0) { // Hit!
			sendImage(cards[indexOfResult]);
			setTimeout(function(){ $('#inputArea').val(''); }, 100);
			return;
		}
		if (inputString == 'g') {
			sound();
			setTimeout(function(){ $('#inputArea').val(''); }, 100);
		}
	} else {
		if (cards.indexOf(inputString) >= 0) { // Hit!
			sendImage(inputString);
			setTimeout(function(){ $('#inputArea').val(''); }, 100);
		}
	}
}

$("#changeInputMode").change(function(){
	switch ($(this).val()) {
		case 'easy':
			easyMode = true;  break;
		case 'normal':
			easyMode = false; break;
		case 'qrCode':
			document.getElementById("inputArea").innerHTML = passWord;
			return;
	}
	document.getElementById("inputArea").innerHTML =
		'<input type="text" onkeydown="keyDown();" id="inputArea" class="form-control">';
});
