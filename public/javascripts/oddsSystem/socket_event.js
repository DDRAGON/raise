var socket = io.connect('http://'+hostAddress+'/oddsSystem');

function addUpdateTableInfoListener(listener) {
	socket.on('tableInfo', listener);
}

function addUpdatePasswordListener(listener) {
	socket.on('passWord', listener);
}

function emitUpdatePlayerName(seatId, name, password) {
	socket.emit('updatePlayerName', {
		seatId: seatId,
		name: name,
		passWord: password
	});
}

function emitChangeAssistantMode(assistantMode) {
	socket.emit('changeAssistantMode', assistantMode);
}

function emitUpdateAssistantPassword(password) {
	socket.emit('updateAssistantPassword', password);
}

function emitImageSendWithPassWord(image, password) {
	socket.emit('imageSendWithPassWord', {
		image: image,
		passWord: password
	});
}
