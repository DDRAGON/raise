var BROADCAST_ID = '_broadcast_';

var createSignalingSocket = function(io) {
	io.on('connection', function(socket) {

		// ---- multi room ----
		socket.on('enter', function(roomname) {
			socket.join(roomname);
			console.log('id=' + socket.id + ' enter room=' + roomname);
			setRoomname(roomname);
		});

		function setRoomname(room) {
			//// for v0.9
			//socket.set('roomname', room);

			// for v1.0
			socket.roomname = room;
		}

		function getRoomname() {
			var room = null;

			//// for v0.9
			//socket.get('roomname', function(err, _room) {
			//  room = _room;
			//});

			// for v1.0
			room = socket.roomname;

			return room;
		}


		function emitMessage(type, message) {
			// ----- multi room ----
			var roomname = getRoomname();

			if (roomname) {
				console.log('===== message broadcast to room -->' + roomname);
				socket.broadcast.to(roomname).emit(type, message);
			}
			else {
				console.log('===== message broadcast all');
				socket.broadcast.emit(type, message);
			}
		}


		// When a user send a SDP message
		// broadcast to all users in the room
		socket.on('message', function(message) {
			message.from = socket.id;

			// get send target
			var target = message.sendto;
			if ( (target) && (target != BROADCAST_ID) ) {
				console.log('===== message emit to -->' + target);
				socket.to(target).emit('message', message);
				return;
			}

			// broadcast in room
			emitMessage('message', message);
		});

		// When the user hangs up
		// broadcast bye signal to all users in the room
		socket.on('disconnect', function() {
			console.log('-- user disconnect: ' + socket.id);
			// --- emit ----
			emitMessage('user disconnected', {id: socket.id});

			// --- leave room --
			var roomname = getRoomname();
			if (roomname) {
				socket.leave(roomname);
			}

		});

	});

	return createSignalingSocket;
};

module.exports = createSignalingSocket;