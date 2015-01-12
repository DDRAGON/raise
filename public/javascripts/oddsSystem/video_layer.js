var canvasForVideo;
var background = 'camera';
var config = {
	canvasWidth: 640,
	canvasHeight: 360
};

$("#changeBackground").change(function(){
	background = $(this).val();
	$('#canvas_pane').attr('class', 'wall_'+background);
});

// ビデオの描画
setInterval(function(){
	if (!config.ctxForVideo) return;
	if (background === 'camera') {
		// 背景カメラモードならカメラを描画
		config.ctxForVideo.drawImage(video, 0, 0, config.canvasWidth, config.canvasHeight);
		return;
	}
}, 50);

$(function(){
	canvasForVideo = $('#canvasForVideo').get(0);
	config.ctxForVideo = canvasForVideo.getContext("2d");
});
