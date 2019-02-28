navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

var video = document.getElementById('myVideo');
var localStream = null;
navigator.getUserMedia({video: true, audio: false},
	function (stream) { // for success case
		video.srcObject = stream;
	},
	function (err) { // for error case
		console.log(err);
	}
);
