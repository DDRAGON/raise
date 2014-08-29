navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var video1 = document.getElementById('myVideo');
var localStream = null;
navigator.getUserMedia({video: true, audio: false},
	function(stream) { // for success case
		video1.src = window.URL.createObjectURL(stream);
		console.log(video1.videoWidth);
	},
	function(err) { // for error case
		console.log(err);
	}
);
