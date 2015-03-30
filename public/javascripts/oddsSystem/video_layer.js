var DEFAULT_CANVAS_WIDTH  = 640;
var DEFAULT_CANVAS_HEIGHT = 360;

var canvasForVideo;
var background = 'camera';
var videoCutWidth  = 0;
var videoCutHeight = 0;
var flameWidth  = 0;
var flameHeight = 0;
var config = {
	canvasWidth: DEFAULT_CANVAS_WIDTH,
	canvasHeight: DEFAULT_CANVAS_HEIGHT
};

$("#changeScreenSize").change(function(){
	switch ($(this).val()) {
		case 'defaultSize':
			setDefaultSize();
			break;
		case 'camera':
			setCameraSize();
			break;
	}
	setLayoutRound();
});

$("#changeBackground").change(function(){
	background = $(this).val();
	if (background === 'RGB(255,255,0)') {
		$('#canvas_pane').attr('class', 'wall_yellow');
	} else {
		$('#canvas_pane').attr('class', 'wall_'+background);
	}
});

// ビデオの描画
setInterval(function(){
	if (!config.ctxForVideo) return;
	if (background === 'camera') {
		// 背景カメラモードならカメラを描画
		config.ctxForVideo.drawImage(
			video,
			videoCutWidth,
			videoCutHeight,
			config.canvasWidth,
			config.canvasHeight,
			flameWidth,
			flameHeight,
			config.canvasWidth,
			config.canvasHeight
		);
		return;
	}
}, 50);

function setDefaultSize() {
	config.canvasWidth    = DEFAULT_CANVAS_WIDTH;
	config.canvasHeight   = DEFAULT_CANVAS_HEIGHT;
	canvasForVideo.width  = DEFAULT_CANVAS_WIDTH;
	canvasForVideo.height = DEFAULT_CANVAS_HEIGHT;
	videoCutWidth  = parseInt((videoWidth  - config.canvasWidth) / 2);
	videoCutHeight = parseInt((videoHeight - config.canvasHeight) / 2);
	if (videoCutWidth < 0) { // ビデオがデフォルトサイズより小さい時
		flameWidth  = Math.abs(videoCutWidth);
		videoCutWidth  = 0;
	}
	if (videoCutHeight < 0) { // ビデオがデフォルトサイズより小さい時
		flameHeight = Math.abs(videoCutHeight);
		videoCutHeight = 0;
	}
}

function setCameraSize() {
	config.canvasWidth    = videoWidth;
	config.canvasHeight   = videoHeight;
	canvasForVideo.width  = videoWidth;
	canvasForVideo.height = videoHeight;
	flameWidth  = 0;
	flameHeight = 0;
	videoCutWidth  = 0;
	videoCutHeight = 0;
}

$(function(){
	canvasForVideo = $('#canvasForVideo').get(0);
	canvasForVideo.width  = DEFAULT_CANVAS_WIDTH;
	canvasForVideo.height = DEFAULT_CANVAS_HEIGHT;
	config.ctxForVideo = canvasForVideo.getContext("2d");
});
