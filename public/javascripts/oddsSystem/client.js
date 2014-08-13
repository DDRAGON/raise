var socket = io.connect('http://'+hostAddress+'/oddsSystem');

var url = 'http://157.7.200.224:3000/';
var url = 'http://localhost:3000/';
var easyMode = true;
var mark = '';
var num  = '　';


function markClick(mark) {
	this.mark = mark;
	drawImage();
}

function numClick(num) {
	this.num = num;
	drawImage();
}

function sendImage(image) {
	$.ajax({
		type: "POST",
		url: url,
		data: { 'image': image }
	}).always(function(data){$('#message').html('send '+image);});
	this.mark = '';
	this.num  = '　';
	drawImage();
	drawSentImage(image)
}

function sendCard() {
	if (this.mark != 's' && this.mark != 'h' && this.mark != 'd' && this.mark != 'c') {
		$('#message').html('mark is invalid!');
		return;
	}
	if (this.num != '2' && this.num != '3' && this.num != '4' && this.num != '5' && this.num != '6' &&
		this.num != '7' && this.num != '8' && this.num != '9' && this.num != 'T' && this.num != 'J' &&
		this.num != 'a' && this.num != 'K' && this.num != 'A') {
		$('#message').html('number is invalid!');
		return;
	}
	sendImage(this.num+this.mark);
}

function drawImage() {
	switch (this.mark){
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
	switch (sentImage[1]){
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
			return;
		}
	} else {
		if (cards.indexOf(inputString) >= 0) { // Hit!
			sendImage(inputString);
			setTimeout(function(){ $('#inputArea').val(''); }, 100);
		}
	}
}
function sound(){
	var str = "";
	str = str + "<EMBED id = 'id_sound'";
	str = str + " SRC=cursor6.wav";
	str = str + " AUTOSTART='true'";
	str = str + " HIDDEN='true'>";
	document.getElementById("id_sound").innerHTML = str;
}

$(function(){
	drawImage()
	/*
	 $.ajax({
	 type: 'GET',
	 url: 'http://157.7.200.224:3000',
	 dataType: 'jsonp',
	 jsonpCallback: 'poker',
	 success: function(json){
	 console.log(json);
	 var len = json.length;
	 for(var i=0; i < len; i++){
	 $("#b").append(json[i].version + ' ' + json[i].codename + '<br>');
	 }
	 }
	 });
	 */
});

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

socket.on('outPutText', function(outPutText) {
	var oldData = $('#ircTextarea').html();
	var newData = oldData + '<font color="#66ff66">'+outPutText+'</font>';
	$('#ircTextarea').html(newData);
	$('#ircTextarea').scrollTop($('#ircTextarea')[0].scrollHeight);
});

socket.on('call', function(data) {
	console.log('call');
});

socket.on('allin', function(data) {
	console.log('allin');
});

socket.on('fold', function(data) {
	console.log('fold');
});

function call() {
	socket.emit('call', {});
}

function allin() {
	socket.emit('allin', {});
}

function fold() {
	socket.emit('fold', {});
}
