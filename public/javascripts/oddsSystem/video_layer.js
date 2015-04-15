var DEFAULT_CANVAS_WIDTH  = 640;
var DEFAULT_CANVAS_HEIGHT = 360;

var canvasForVideo;
var config = {
	canvasWidth: DEFAULT_CANVAS_WIDTH,
	canvasHeight: DEFAULT_CANVAS_HEIGHT,
	background: 'camera',
	videoSourceX: 0,
	videoSourceY: 0,
	videoSourceWidth: DEFAULT_CANVAS_WIDTH,
	videoSourceHeight: DEFAULT_CANVAS_HEIGHT,
	videoDisplayX: 0,
	videoDisplayY: 0,
	videoDisplayWidth: DEFAULT_CANVAS_WIDTH,
	videoDisplayHeight: DEFAULT_CANVAS_HEIGHT,
	adjustToWindowResize: false,
	isFullScreenMode: false,
	isFullScreen169Mode: false
};

$("#changeScreenSize").change(function(){
	switch ($(this).val()) {
		case 'defaultSize':
			setDefaultSize();
			break;
		case 'camera':
			setCameraSize();
			break;
		case 'fullScreen':
			fullScreenMode();
			break;
		case '16:9_fullScreen':
			fullScreen169Mode();
			break;
	}
	setLayoutRound();
});

$("#changeBackground").change(function(){
	config.background = $(this).val();
	if (config.background === 'RGB(255,255,0)') {
		$('#canvas_pane').attr('class', 'wall_yellow');
	} else {
		$('#canvas_pane').attr('class', 'wall_'+config.background);
	}
});

// ビデオの描画
setInterval(function(){
	if (!config.ctxForVideo) return;
	if (config.background === 'camera') {
		// 背景カメラモードならカメラを描画
		redrawCamera(
			config.videoSourceX, config.videoSourceY,
			config.videoSourceWidth, config.videoSourceHeight,
			config.videoDisplayX, config.videoDisplayY,
			config.videoDisplayWidth, config.videoDisplayHeight
		);
	}
}, 50);

function redrawCamera(sx,sy, sw,sh, dx,dy, dw,dh) {
	config.ctxForVideo.drawImage(video, sx,sy, sw,sh, dx,dy, dw,dh);
}

function setDefaultSize() {
	canvasForVideo.width  = DEFAULT_CANVAS_WIDTH;
	canvasForVideo.height = DEFAULT_CANVAS_HEIGHT;
	config.canvasWidth  = DEFAULT_CANVAS_WIDTH;
	config.canvasHeight = DEFAULT_CANVAS_HEIGHT;
	config.videoSourceX = parseInt((videoWidth  - config.canvasWidth) / 2);
	config.videoSourceY = parseInt((videoHeight - config.canvasHeight) / 2);
	config.videoSourceWidth  = DEFAULT_CANVAS_WIDTH;
	config.videoSourceHeight = DEFAULT_CANVAS_HEIGHT;
	config.videoDisplayX = 0;
	config.videoDisplayY = 0;
	config.videoDisplayWidth  = DEFAULT_CANVAS_WIDTH;
	config.videoDisplayHeight = DEFAULT_CANVAS_HEIGHT;

	if (config.videoSourceX < 0) { // ビデオ横幅がデフォルト横幅より小さい時
		config.videoSourceX = 0;
		config.videoSourceWidth = videoWidth;
		config.videoDisplayX = Math.abs(config.videoSourceX);
		config.videoDisplayWidth = videoWidth;
	}
	if (config.videoSourceY < 0) { // ビデオ縦幅がデフォルト縦幅より小さい時
		config.videoSourceY = 0;
		config.videoSourceHeight = videoHeight;
		config.videoDisplayY = Math.abs(config.videoSourceY);
		config.videoDisplayHeight = videoHeight;
	}

	$('#canvas_pane').css({width: config.canvasWidth + 'px', height: config.canvasHeight + 'px'});
}

function setCameraSize() {
	canvasForVideo.width  = videoWidth;
	canvasForVideo.height = videoHeight;
	config.canvasWidth    = videoWidth;
	config.canvasHeight   = videoHeight;
	config.videoSourceX = 0;
	config.videoSourceY = 0;
	config.videoSourceWidth  = videoWidth;
	config.videoSourceHeight = videoHeight;
	config.videoDisplayX = 0;
	config.videoDisplayY = 0;
	config.videoDisplayWidth  = videoWidth;
	config.videoDisplayHeight = videoHeight;
	$('#canvas_pane').css({width: config.canvasWidth + 'px', height: config.canvasHeight + 'px'});
}

function fullScreenMode() {
	// フラグの設定
	config.adjustToWindowResize = true;
	config.isFullScreenMode     = true;
	config.isFullScreen169Mode  = false;

	// 他の要素を隠す
	$('#settings').hide();
	$('.navbar-wrapper').hide();
	$('#footer_contents').hide();

	// キャンバスサイズやカメラサイズ設定
	setSizeToFullScreen();
}

function fullScreen169Mode() {
	// フラグの設定
	config.adjustToWindowResize = true;
	config.isFullScreenMode     = false;
	config.isFullScreen169Mode  = true;

	// 他の要素を隠す
	$('#settings').hide();
	$('.navbar-wrapper').hide();
	$('#footer_contents').hide();

	// キャンバスサイズやカメラサイズ設定
	setSizeToFullScreen();
}

function setSizeToFullScreen() {
	var windowWidth  = $(window).width();
	var windowHeight = $(window).height();
	// キャンバスサイズやカメラサイズ設定
	canvasForVideo.width  = windowWidth;
	canvasForVideo.height = windowHeight;
	config.canvasWidth    = windowWidth;
	config.canvasHeight   = windowHeight;
	config.videoSourceX = 0;
	config.videoSourceY = 0;
	config.videoSourceWidth  = windowWidth;
	config.videoSourceHeight = windowHeight;
	config.videoDisplayX = 0;
	config.videoDisplayY = 0;
	config.videoDisplayWidth  = windowWidth;
	config.videoDisplayHeight = windowHeight;
	$('#canvas_pane').css({width: config.canvasWidth + 'px', height: config.canvasHeight + 'px'});
}

$(window).resize(function() {
	if (config.adjustToWindowResize === false) return;
	console.log('resized');
	if (config.isFullScreenMode === true) { // フルスクリーンモードなら
		setSizeToFullScreen(); // フルスクリーンサイズに合わせる。
		setLayoutRound();
		redrawCamera(
			config.videoSourceX, config.videoSourceY,
			config.videoSourceWidth, config.videoSourceHeight,
			config.videoDisplayX, config.videoDisplayY,
			config.videoDisplayWidth, config.videoDisplayHeight
		);
	}
});

$(function(){
	$('.container').css({"width": 'auto', "padding-left": "0px", "padding-right": "0px"});
	canvasForVideo = $('#canvasForVideo').get(0);
	canvasForVideo.width  = DEFAULT_CANVAS_WIDTH;
	canvasForVideo.height = DEFAULT_CANVAS_HEIGHT;
	config.ctxForVideo = canvasForVideo.getContext("2d");
});
