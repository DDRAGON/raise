var markRegExp = /[shdc]/;
var rankRegExp = /[2-9TJQKA]/;
var cards = [
	'As', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks',
	'Ah', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh',
	'Ad', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd',
	'Ac', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc'
];
var cardsForEasyMode = [
	'Ta', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', 'Qa', 'Wa', 'Ea', 'Ra',
	'Ts', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Qs', 'Ws', 'Es', 'Rs',
	'Td', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Qd', 'Wd', 'Ed', 'Rd',
	'Tf', '2f', '3f', '4f', '5f', '6f', '7f', '8f', '9f', 'Qf', 'Wf', 'Ef', 'Rf'
];

function onClickProgression(progression) {
	$("a.card_selector.mark").removeClass('active');
	$("a.card_selector.rank").removeClass('active');
	$("a.card_selector.progression").removeClass('active');
	$("a#"+progression).addClass('active');
}

function onClickMark(mark) {
	$("a.card_selector.progression").removeClass('active');
	$("a.card_selector.mark").removeClass('active');
	$("a.card_selector.rank").removeClass('color_s color_h color_d color_c');
	$("a#"+mark).addClass('active');
	$("a.card_selector.rank").addClass('color_'+mark);
}

function onClickRank(rank) {
	$("a.card_selector.progression").removeClass('active');
	$("a.card_selector.rank").removeClass('active');
	$("a#"+rank).addClass('active');
}

function sendImage(image) {
	emitImageSendWithPassWord(image, $('#assistant_id').val());
	$('#message').html('send '+image);
	this.mark = '';
	this.rank = '　';
	showBalloon(image);
}

function onClickSend() {
	var progression = $('.card_selector.progression.active').attr('id');
	if(progression) {
		// 進行
		sendImage(progression);

	} else {
		// カード
		var mark = $('.card_selector.mark.active').attr('id');
		var rank = $('.card_selector.rank.active').attr('id');
		if (!mark || !rank || !(mark+"").match(markRegExp) || !(rank+"").match(rankRegExp)) {
			return;
		}
		sendImage(rank+mark);
	}
	$("a.card_selector.mark").removeClass('active');
	$("a.card_selector.rank").removeClass('active');
	$("a.card_selector.progression").removeClass('active');
}

function showBalloon(sentImage) {
	var contents = 'send ';
	if(sentImage.length == 2) {
		contents += sentImage[0];
	} else {
		contents += sentImage;
	}

	$("#send").showBalloon({
		contents : contents,
		position : "right",
		showDuration : 100,
		maxLifetime : 3000,
		hideDuration : 500,
		classname : "send_balloon",
		css : {
			color : "#FFF",
			backgroundColor : "#4e5d6c",
			border : "solid 1px #2e3d4c",
			boxShadow : "2px 2px 2px #999"
		}
	});

	$('.send_balloon').removeClass('color_s color_h color_d color_c mark_s mark_h mark_d mark_c');
	if(sentImage.length == 2) {
		$('.send_balloon').addClass("send_balloon mark_"+sentImage[1]+" color_"+sentImage[1]);
	}
}