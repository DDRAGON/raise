navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var video = document.getElementById('myVideo');
var localStream = null;
navigator.getUserMedia({video: true, audio: false},
	function (stream) { // for success case
		video.src = window.URL.createObjectURL(stream);
	},
	function (err) { // for error case
		console.log(err);
	}
);
