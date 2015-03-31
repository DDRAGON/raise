var socket = io.connect('http://'+hostAddress+'/manAAgeTool');

socket.on('multiQrCodeReadersInfo', function(multiQrCodeReaders) {
	console.log(multiQrCodeReaders);
});
