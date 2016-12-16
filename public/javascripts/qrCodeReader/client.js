var socket = io.connect('https://'+hostAddress+'/qrCodeReader');
var config = {
	canvasWidth:  400,
	canvasHeight: 300
};
var lastCard = '';
var lastCardPassedTimeSec = 0.0;
var readQRCodeIntervalTimeMSec = 50;
var anikiMusicFileName = ['aniki1.wav','aniki2.mp3','aniki3.wav','aniki4.wav','aniki5.wav'];

function sendImage(image) {
	if (image == 'ng' || image == 'j1') image = 'nextGame';
	if (image == 'rg' || image == 'j2') image = 'resetGame';
	socket.emit('imageSendWithPassWord', {
		image: image,
		passWord: $('#inputArea').val()
	});
}


function sound() {
	// 選択されている表示文字列を取り出す
	var fileName = $('[name=musicFileName] option:selected').text();
	if (fileName == 'アニキランダム') {
		fileName = anikiMusicFileName[Math.floor( Math.random() * anikiMusicFileName.length )];
	}
	// 置換処理
	var fileName = fileName.replace(".", "\\.");
	$("#" + fileName).get(0).play();
}

$(function(){
	var canvasForVideo = $('#canvasForVideo').get(0);
	config.ctxForVideo = canvasForVideo.getContext("2d");
	RewriteAndRead();
});

// ビデオの描画とQRコード読み取り
function RewriteAndRead() {
	config.ctxForVideo.drawImage(video, 0, 0, config.canvasWidth, config.canvasHeight);
	var imageData = config.ctxForVideo.getImageData(0, 0, config.canvasWidth, config.canvasHeight);
	lastCardPassedTimeSec += readQRCodeIntervalTimeMSec * 0.001;
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
			sendImage(message);
		} else if (lastCard === message) {
			lastCardPassedTimeSec = 0.0;
		}
	}catch( e ){
		// nice catch!
	}
	setTimeout("RewriteAndRead()", readQRCodeIntervalTimeMSec);
}

$("#changeReadQRCodeIntervalTimeMSec").change(function(){
	switch ($(this).val()){
	case '標準':
		readQRCodeIntervalTimeMSec = 100;
		return;
	case '高速':
		readQRCodeIntervalTimeMSec = 50;
		return;
	}
});

function setLastCard(message)
{
	lastCard = message;
	$('#result').html(message);
}

function setColorAndFont(color, size) {
	config.ctx.fillStyle = color;
	config.ctx.font = "bold "+size+"px \'ITC HIGHLANDER\'";
}
