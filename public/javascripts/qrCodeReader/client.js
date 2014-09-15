var socket = io.connect('http://'+hostAddress+'/qrCodeReader');
var config = {
	canvasWidth:  400,
	canvasHeight: 300
};
var lastCard = '';
var lastCardPassedTimeSec = 0.0;

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

function sound() {
	var str = "";
	str = str + "<EMBED id = 'id_sound'";
	str = str + " SRC=/music/cursor6.wav";
	str = str + " AUTOSTART='true'";
	str = str + " HIDDEN='true'>";
	document.getElementById("id_sound").innerHTML = str;
}

$(function(){
	var canvasForVideo = $('#canvasForVideo').get(0);
	config.ctxForVideo = canvasForVideo.getContext("2d");
});

// ビデオの描画
setInterval(function(){
	config.ctxForVideo.drawImage(video, 0, 0, config.canvasWidth, config.canvasHeight);
	var imageData = config.ctxForVideo.getImageData(0, 0, config.canvasWidth, config.canvasHeight);
	lastCardPassedTimeSec += 0.1;
	if (lastCardPassedTimeSec >= 1) {
		lastCardPassedTimeSec = 0.0;
		setLastCard('');
		lastCard = '';
	}
	try{
		var reader = new com.google.zxing.qrcode.QRCodeReader();
		var source = new RGBLuminanceSource(imageData.data, imageData.width, imageData.height);
		var bitmap = new com.google.zxing.BinaryBitmap(new com.google.zxing.common.HybridBinarizer(source));
		var result = reader.decode1(bitmap);
		var message = result.get_text();
		if (lastCard === '' || lastCard !== message) {
			setLastCard(message);
			lastCardPassedTimeSec = 0.0;
			sound();
		} else if (lastCard === message) {
			lastCardPassedTimeSec = 0.0;
		}
	}catch( e ){
		// nice catch!
	}
}, 100);

function setLastCard(message)
{
	lastCard = message;
	$('#result').html(message);
}

function setColorAndFont(color, size) {
	config.ctx.fillStyle = color;
	config.ctx.font = "bold "+size+"px \'ITC HIGHLANDER\'";
}
