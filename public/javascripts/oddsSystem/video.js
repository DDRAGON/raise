navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

var video = document.getElementById('myVideo');
var localStream = null;
var videoWidth;
var videoHeight;

navigator.getUserMedia({video: true, audio: false},
	function (stream) { // for success case
		video.srcObject = stream;
		video.addEventListener('loadeddata', function() {
			videoWidth  = video.videoWidth;
			videoHeight = video.videoHeight;
			console.log('videoWidth = ' + videoWidth + ', videoHeight = ' + videoHeight);
			setDefaultSize();
		}, false);
	},
	function (err) { // for error case
		console.log(err);
	}
);