var DEFAULT_CANVAS_WIDTH  = 640;
var DEFAULT_CANVAS_HEIGHT = 360;
var KEY_CODE_ESC = 27;

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
	isFullScreen169Mode: false,
	colorPattern: '1'
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
	switch ($(this).val()) {
		case 'green':
			$('#canvas_pane').attr('class', 'wall_green');
			config.colorPattern = '3';
			break;
		case 'blue':
			$('#canvas_pane').attr('class', 'wall_blue');
			config.colorPattern = '2';
			break;
		case 'RGB(255,255,0)':
			$('#canvas_pane').attr('class', 'wall_yellow');
			config.colorPattern = '1';
			break;
		default:
			$('#canvas_pane').attr('class', 'wall_'+config.background);
			config.colorPattern = '1';
			break;
	}
	hideTable(); // テーブル情報削除
	drawTableInfo(lastTableInfo); // テーブル書き直し
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

	// フラグの設定
	config.adjustToWindowResize = false;
	config.isFullScreenMode     = false;
	config.isFullScreen169Mode  = false;

	// 設定要素を表示する。
	$('#settings').show();
	$('.navbar-wrapper').show();
	$('#footer_contents').show();

	displayUpdate(); // 表示更新
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
	displayUpdate(); // 表示更新
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


	setSizeToFullScreen(); // キャンバスサイズやカメラサイズ設定
	$('#escKeyAdvice').show().fadeOut(5000); // フルクリーンは esc キーで解除できる文言を表示します。
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

	setSizeToFullScreen169(); // キャンバスサイズやカメラサイズ設定
	$('#escKeyAdvice').show().fadeOut(5000); // フルクリーンは esc キーで解除できる文言を表示します。
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
	displayUpdate(); // 表示更新
}

function setSizeToFullScreen169() {
	var windowWidth  = $(window).width();
	var windowHeight = Number(windowWidth*9/16); // windowWidth:windowHeight = 16:9
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
	displayUpdate(); // 表示更新
}

// スクリーンサイズの変更
$(window).resize(function() {
	if (config.adjustToWindowResize === false) return;

	if (config.isFullScreenMode === true) { // フルスクリーンモードなら
		setSizeToFullScreen(); // フルスクリーンサイズに合わせる。
		return;
	}

	if (config.isFullScreen169Mode === true) { // フルスクリーン169モードなら
		setSizeToFullScreen169(); // フルスクリーン169サイズに合わせる。
	}
});

function displayUpdate() {
	$('#canvas_pane').css({width: config.canvasWidth + 'px', height: config.canvasHeight + 'px'});
	$('#canvasForVideo').css({width: config.canvasWidth + 'px', height: config.canvasHeight + 'px'});
	$('#canvas').css({width: config.canvasWidth + 'px', height: config.canvasHeight + 'px'});
	$('.centerAdvice').css({
		width: config.canvasWidth*4/5 + 'px',
		"margin-left": -config.canvasWidth*4/5/2 + 'px'
	});
	setLayoutRound();
	if (config.background === 'camera') { // 背景カメラモードならカメラを描画
		redrawCamera(
			config.videoSourceX, config.videoSourceY,
			config.videoSourceWidth, config.videoSourceHeight,
			config.videoDisplayX, config.videoDisplayY,
			config.videoDisplayWidth, config.videoDisplayHeight
		);
	}
}

$(window).keydown(function(e){
	if (config.adjustToWindowResize === true) { // スクリーン自動変動設定で
		if (e.keyCode === KEY_CODE_ESC) { // escが押された時。
			setDefaultSize();
		}
	}
});

$(function(){
	$('.container').css({"width": 'auto', "padding-left": "0px", "padding-right": "0px"});
	canvasForVideo = $('#canvasForVideo').get(0);
	canvasForVideo.width  = DEFAULT_CANVAS_WIDTH;
	canvasForVideo.height = DEFAULT_CANVAS_HEIGHT;
	config.ctxForVideo = canvasForVideo.getContext("2d");
});
