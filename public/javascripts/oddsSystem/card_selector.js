var passWord = '';
var easyMode = false;
var mark = '';
var markRegExp = /[^shdc]/;
var num = '　'
var numRegExp = /[^2-9TJQKA]/;
var cards = [
	'As', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks',
	'Ah', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh',
	'Ad', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd',
	'Ac', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc'
];
var cardsForEasyMode = [
	'Ta', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', 'Qa', 'Wa', 'Ea', 'Ra',
	'Ts', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Qs', 'Ws', 'Es', 'Rs',
	'Td', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Qd', 'Wd', 'Ed', 'Rd',
	'Tf', '2f', '3f', '4f', '5f', '6f', '7f', '8f', '9f', 'Qf', 'Wf', 'Ef', 'Rf'
];

function setPassword(pw) {
	passWord = pw;
}

addUpdatePasswordListener(setPassword);

function markClick(mark) {
	this.mark = mark;
	drawImage();
}

function numClick(num) {
	this.num = num;
	drawImage();
}

function sendImage(image) {
	emitImageSendWithPassWord(image, $('#passwordArea').val());
	sound();
	$('#message').html('send '+image);
	this.mark = '';
	this.num = '　';
	drawImage();
	drawSentImage(image);
	if (image == 'start') {
		for (var seatId=0; seatId<10; seatId++) {
			$('#inputPlayer'+seatId).val('');
		}
	}
}

function sendCard() {
	if ((this.mark+"").match(markRegExp)) {
		$('#message').html('mark is invalid!');
		return;
	}
	if ((this.num+"").match(numRegExp)) {
		$('#message').html('number is invalid!');
		return;
	}
	sendImage(this.num+this.mark);
}

function drawImage() {
	switch (this.mark) {
		case 's':　$('#image').html('<span style="color:#000000;font-size:64px;">'+this.num+'♠</span>'); break;
		case 'h':　$('#image').html('<span style="color:#ff0000;font-size:64px;">'+this.num+'♥</span>'); break;
		case 'd':　$('#image').html('<span style="color:#0000ff;font-size:64px;">'+this.num+'♦</span>'); break;
		case 'c':　$('#image').html('<span style="color:#00bb00;font-size:64px;">'+this.num+'♣</span>'); break;
		default:   $('#image').html('<span style="color:#000000;font-size:64px;">'+this.num+'</span>'); break;
	}
}

function drawSentImage(sentImage) {
	switch (sentImage[1]) {
		case 's':	$('#sentImage').html('<span style="color:#000000;font-size:64px;">'+sentImage[0]+'♠</span>'); break;
		case 'h':	$('#sentImage').html('<span style="color:#ff0000;font-size:64px;">'+sentImage[0]+'♥</span>'); break;
		case 'd':	$('#sentImage').html('<span style="color:#0000ff;font-size:64px;">'+sentImage[0]+'♦</span>'); break;
		case 'c':	$('#sentImage').html('<span style="color:#00bb00;font-size:64px;">'+sentImage[0]+'♣</span>'); break;
		default: 	$('#sentImage').html('<span style="color:#000000;font-size:64px;">'+sentImage[0]+'</span>'); break;
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
			easyMode = true; break;
		case 'normal':
			easyMode = false; break;
		case 'qrCode':
			document.getElementById("inputArea").innerHTML = passWord;
			return;
	}
	document.getElementById("inputArea").innerHTML =
		'<input type="text" onkeydown="keyDown();" id="inputArea" class="form-control">';
});

function sound() {
	var str = "";
	str = str + "<EMBED id = 'id_sound'";
	str = str + " SRC=/music/cursor6.wav";
	str = str + " AUTOSTART='true'";
	str = str + " HIDDEN='true'>";
	document.getElementById("id_sound").innerHTML = str;
}

