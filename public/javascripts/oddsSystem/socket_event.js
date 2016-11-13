var socket = io.connect('https://'+hostAddress+'/oddsSystem');

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

function emitCaptionMessage(captionMessage, password) {
	socket.emit('updateCaptionMessage', {
		captionMessage: captionMessage,
		passWord: password
	});
}

function emitDescriptionMessage(descriptionMessage, password) {
	socket.emit('updateDescriptionMessage', {
		descriptionMessage: descriptionMessage,
		passWord: password
	});
}

function emitChipUpdate(seatId, chipMany, password) {
	socket.emit('updateChipMany', {
		seatId: seatId,
		chipMany: chipMany,
		passWord: password
	});
}



socket.on('disconnect', function() {
	disConnected();
});