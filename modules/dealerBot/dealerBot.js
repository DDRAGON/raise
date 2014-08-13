var async = require('async');
var pokerUtils = require('./pokerutils.js');

var thousandList = [];
for(var i=0; i<2000; i++){
	thousandList.push(i);
}
var statics = {
	player: {
		playCount: 0,
		winCount: 0
	},
	dealer: {
		playCount: 0,
		winCount: 0
	}
};
var players = {
	dealer: {
		playCount: 0,
		winCount: 0
	}
};


function connect(name, callback) {
	if (!players[name]) {
		players[name] = {
			playCount: 0,
			winCount: 0
		}
	}
	deal(name, function(outPutText){
		callback(outPutText);
	});
}

module.exports = {
	connect: connect,
	fold: fold,
	call: call,
	allin: allin
};

function deal(name, callback){
	shuffle(function(data){
		players[name].trumps  = data.trumps;
		players[name].trump50 = data.trump50;
		dealStartHand(name, function(){
			getWinPer(name, function(sumPer, winPer, chopPer){
				var message = 'Your hand is: ' + players[name].hands[0] + players[name].hands[1] + ' call or AllIN ';
				fixColorAndFonts(message, function(outPutText){
					callback(sayWinPer(outPutText, sumPer, winPer, chopPer));
				});
			});
		});
	});
}

function shuffle(mainCallback){
	var trumps =
		[
			'♠1','♠2','♠3','♠4','♠5','♠6','♠7','♠8','♠9','♠10','♠11','♠12','♠13',
			'♥1','♥2','♥3','♥4','♥5','♥6','♥7','♥8','♥9','♥10','♥11','♥12','♥13',
			'♦1','♦2','♦3','♦4','♦5','♦6','♦7','♦8','♦9','♦10','♦11','♦12','♦13',
			'♣1','♣2','♣3','♣4','♣5','♣6','♣7','♣8','♣9','♣10','♣11','♣12','♣13'
		];
	shuffleArray(trumps, function(trumps){
		mainCallback({trumps:trumps, trump50: [].concat(trumps)});
	});
};

function dealStartHand(name, callback){
	var trumps  = players[name].trumps;
	var trump50 = players[name].trump50;
	var hands = [];
	var dealerHands = [];
	hands[0] = trumps[0]; trumps.splice(0, 1); trump50.splice(0, 1);
	dealerHands[0] = trumps[0]; trumps.splice(0, 1);
	hands[1] = trumps[0]; trumps.splice(0, 1); trump50.splice(1, 1);
	dealerHands[1] = trumps[0]; trumps.splice(0, 1);
	players[name].hands        = hands;
	players[name].dealerHands  = dealerHands;
	players[name].trumps       = trumps;
	players[name].trump50      = trump50;
	callback();
}

function fold(name, callback){
	deal(name, function(outPutText){
		callback('folded.<br><br>' + outPutText);
	});
}
function call(name, callback){
	if(!players[name].publish){
		var publish = [];
		var trumps  = players[name].trumps;
		var trump50 = players[name].trump50;
		trumps.splice(0, 1); // 先頭のカードを捨てる。
		publish[0] = trumps[0]; trumps.splice(0, 1); trump50.splice(1, 1);
		publish[1] = trumps[0]; trumps.splice(0, 1); trump50.splice(1, 1);
		publish[2] = trumps[0]; trumps.splice(0, 1); trump50.splice(1, 1);
		players[name].publish  = publish;
		players[name].trumps   = trumps;
		players[name].trump50  = trump50;
		getWinPer(name, function(sumPer, winPer, chopPer){
			var message = 'flop: ' + publish[0] +' '+ publish[1] +' '+ publish[2];
			fixColorAndFonts(message, function(outPutText){
				callback(sayWinPer(outPutText, sumPer, winPer, chopPer));
			});
		});
	} else {
		var publish = player.publish;
		var trumps  = player.trumps;
		var trump50 = player.trump50;
		if(!publish[3]){
			trumps.splice(0, 1); publish[3] = trumps[0]; trumps.splice(0, 1); trump50.splice(1, 1);
			player.publish  = publish;
			player.trumps   = trumps;
			player.trump50  = trump50;
			getWinPer(function(sumPer, winPer, chopPer){
				sayWinPer('turn: ' + publish[0] +' '+ publish[1] +' '+ publish[2]+' '+ publish[3], sumPer, winPer, chopPer);
			});
		}else if(!publish[4]){
			trumps.splice(0, 1); publish[4] = trumps[0]; trumps.splice(0, 1); trump50.splice(1, 1);
			player.publish  = publish;
			player.trumps   = trumps;
			player.trump50  = trump50;
			getWinPer(function(sumPer, winPer, chopPer){
				sayWinPer('river:' + publish[0] +' '+ publish[1] +' '+ publish[2]+' '+ publish[3]+' '+ publish[4], sumPer, winPer, chopPer);
			});
		}else{
			var dealerHands = player.dealerHands;
			say('dealer\'s hand is: ' + dealerHands[0] + dealerHands[1]);
			judge(player.hands, dealerHands, player.publish, function(message){
				player = {};
				say(message);
			});
		}
	}
}

function allin(playerName){
	say('Good luck ' + playerName);
	if(!player.publish){
		call(playerName);
	}
	if(!player.publish[3]){
		call(playerName);
	}
	if(!player.publish[4]){
		call(playerName);
	}
	call(playerName);
}

function say(message){
	fixColorAndFonts(message, function(outPotText){
		bot.say(config.channels[0], outPotText);
	});
}

function sayWinPer(message, sumPer, winPer, chopPer){
	var sumColor = '#ffff22';
	if(sumPer < 50.0) sumColor = '#ff4400';
	var outPutText = message + '<font color="' +sumColor+ '"> ' +sumPer+ '%</font>（chop:' +chopPer+ '%）<br>';
	return outPutText;
}

function fixColorAndFonts(txt, callback){
	replaceAll(txt, '13', 'Ｋ', function(txt){
		replaceAll(txt, '12', 'Ｑ', function(txt){
			replaceAll(txt, '11', 'Ｊ', function(txt){
				replaceAll(txt, '10', 'Ｔ', function(txt){
					replaceAll(txt,  '9', '９', function(txt){
						replaceAll(txt,  '8', '８', function(txt){
							replaceAll(txt,  '7', '７', function(txt){
								replaceAll(txt,  '6', '６', function(txt){
									replaceAll(txt,  '5', '５', function(txt){
										replaceAll(txt,  '4', '４', function(txt){
											replaceAll(txt,  '3', '３', function(txt){
												replaceAll(txt,  '2', '２', function(txt){
													replaceAll(txt,  '1', 'Ａ', function(txt){
														replaceAll(txt,  '0', '０', function(txt){
															replaceAll(txt,  '♠', '<font color="silver">♠</font>', function(txt){
																replaceAll(txt,  '♥', '<font color="red">♥</font>', function(txt){
																	replaceAll(txt,  '♦', '<font color="aqua">♦</font>', function(txt){
																		replaceAll(txt,  '♣', '<font color="lime">♣</font>', function(txt){
															callback(txt);
	}); }); }); }); }); }); }); }); }); }); }); }); }); }); }); }); }); });
}

function judge(hands1, hands2, publish, mainCallback){
	statics.dealer.playCount += 1;
	statics.player.playCount += 1;
	var field = new pokerUtils.Field();
	field.setFlop([publish[0], publish[1], publish[2]]);
	field.setTurn(publish[3]);
	field.setRiver(publish[4]);
	var player = new pokerUtils.Player('player', [hands1[0],hands1[1]], field);
	var dealer = new pokerUtils.Player('dealer', [hands2[0],hands2[1]], field);
	var winner = pokerUtils.judgeWinner(player, dealer);
	if(!winner){
		mainCallback('!!! chop !!!');
	}else{
		var name = winner.getName();
		statics[name].winCount += 1;
		var winPer = Math.floor(statics[name].winCount / statics[name].playCount * 1000) / 10;
		mainCallback(name + ' win with ' + winner.getHandTypeCall() +' '+ name +'の今日の勝率' + winPer + '％');
	}
}

function getWinPer(name, mainCallback){
	var hands1       = [].concat(players[name].hands);
	var checkCounter = 0;
	var winCounter   = 0;
	var chopCounter  = 0;
	async.each(thousandList, function(i, callback){
		var checkTrumps  = [].concat(players[name].trump50);
		var checkPublish = [].concat(players[name].publish);
		shuffleArray(checkTrumps, function(checkTrumps){
			var dealerHands = [];
			dealerHands[0] = checkTrumps[0]; checkTrumps.splice(0, 1);
			dealerHands[1] = checkTrumps[0]; checkTrumps.splice(0, 1); // ディーラーのハンドはこれで良い
			if(!checkPublish[0]){
				checkTrumps.splice(0, 1); // 先頭のカードを捨てる。
				checkPublish[0] = checkTrumps[0]; checkTrumps.splice(0, 1);
				checkPublish[1] = checkTrumps[0]; checkTrumps.splice(0, 1);
				checkPublish[2] = checkTrumps[0]; checkTrumps.splice(0, 1);
			}
			if(!checkPublish[3]){
				checkTrumps.splice(0, 1); // 先頭のカードを捨てる。
				checkPublish[3] = checkTrumps[0]; checkTrumps.splice(0, 1);
			}
			if(!checkPublish[4]){
				checkTrumps.splice(0, 1); // 先頭のカードを捨てる。
				checkPublish[4] = checkTrumps[0]; checkTrumps.splice(0, 1);
			}
			var field = new pokerUtils.Field();
			field.setFlop([checkPublish[0], checkPublish[1], checkPublish[2]]);
			field.setTurn(checkPublish[3]);
			field.setRiver(checkPublish[4]);
			var player = new pokerUtils.Player(name, [hands1[0],hands1[1]], field);
			var dealer = new pokerUtils.Player('dealer', [dealerHands[0],dealerHands[1]], field);
			var winner = pokerUtils.judgeWinner(player, dealer);
			checkCounter += 1;
			if(!winner){
				chopCounter += 1;
				callback();
			}else if(winner.getName() == 'dealer'){
				callback();
			}else{
				winCounter  += 1;
				callback();
			}
		});
	}, function(err){
		var sumPer  = Math.floor((winCounter + chopCounter)/ checkCounter * 1000) / 10;
		var winPer  = Math.floor(winCounter / checkCounter * 1000) / 10;
		var chopPer = Math.floor(chopCounter / checkCounter * 1000) / 10;
		mainCallback(sumPer, winPer, chopPer);
	});
}
// 全ての文字列 s1 を s2 に置き換える
function replaceAll(expression, org, dest, callback){
	callback(expression.split(org).join(dest));
}

function shuffleArray(trumps, mainCallback){
	var i = 0;
	var length = trumps.length;
	async.each(trumps, function(item, callback){
		var j   = Math.floor(Math.random()*length);
		var t   = trumps[j];
		trumps[j] = trumps[i];
		trumps[i] = t;
		i += 1;
		callback();
	}, function(err){
		mainCallback(trumps);
	});
}