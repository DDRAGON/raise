var MONTE_CARLO_LOOP = 10000;
var DEBUG_MODE = false;

function getWinPer(obj) {
	var boardLength = getBoardLegth(obj.board);
	if (boardLength < 3 || hasRandomHand(obj.players)) {
		return calculateByMonteCarloLoop(obj); // フロップがないときはモンテカルロで確率を求める。
	} else if (boardLength == 3) {
		return calculateByAllPatternsAddingTurnAndRiver(obj); // ターンとリバーを追加する全パターン計算。
	} else if (boardLength == 4) {
		return calculateByAllPatternsAddingRiver(obj); // リバーを追加する全パターン計算。
	} else if (boardLength == 5) {
		return calculateByAllPatternsWithoutAdding(obj); // 何も追加しない。
	}
}

function calculateByMonteCarloLoop(obj) {
	var winCount = {};
	var tieCount = {};
	var deck = makeDeck(obj.board, obj.players); // deckは外に出たカードを除いたトランプデッキ
	var originalBoard = obj.board;
	var originalHand = {};
	for (var key in obj.players) {
		originalHand[obj.players[key].id] = [].concat(obj.players[key].hand);
	}

	// モンテカルロループ開始！
	for (var i=0; i<MONTE_CARLO_LOOP; i++) {
		var verificationDeck = [].concat(deck);
		obj.board            = [].concat(originalBoard);
		for (var key in obj.players) {
			if (!originalHand[obj.players[key].id][0]) {
				var cardPosition = Math.floor(Math.random() * verificationDeck.length);
				obj.players[key].hand[0] = verificationDeck[cardPosition];
				verificationDeck.splice(cardPosition, 1);
			}
			if (!originalHand[obj.players[key].id][1]) {
				var cardPosition = Math.floor(Math.random() * verificationDeck.length);
				obj.players[key].hand[1] = verificationDeck[cardPosition];
				verificationDeck.splice(cardPosition, 1);
			}
		}
		for (var key=0; key<5; key++) {
			if (!obj.board[key]) {
				var cardPosition = Math.floor(Math.random() * verificationDeck.length);
				obj.board[key] = verificationDeck[cardPosition];
				verificationDeck.splice(cardPosition, 1);
			}
		}

		// 準備ができたら勝者を求めよう!
		getPlayersPointAndKicker(obj);
		var winPlayers = getWinPlayer(obj);
		if (winPlayers.length == 1) {
			if (!winCount[winPlayers[0].id]) winCount[winPlayers[0].id] = 0;
			winCount[winPlayers[0].id] += 1;
		} else {
			for (var key in winPlayers) {
				if (!tieCount[winPlayers[key].id]) tieCount[winPlayers[key].id] = 0;
				tieCount[winPlayers[key].id] += 1;
			}
		}
	}
	for (var key in obj.players) {
		if (obj.players[key].isActive == true) { // 参加プレイヤー
			if (!winCount[obj.players[key].id] && !tieCount[obj.players[key].id]) {
				obj.players[key].win = 0.0;
			} else {
				if (!winCount[obj.players[key].id]) winCount[obj.players[key].id] = 0;
				if (!tieCount[obj.players[key].id]) tieCount[obj.players[key].id] = 0;
				obj.players[key].win = Math.round((winCount[obj.players[key].id] + tieCount[obj.players[key].id])/ MONTE_CARLO_LOOP * 1000) / 10;
			}
			if (!tieCount[obj.players[key].id]) {
				obj.players[key].tie = 0.0;
			} else {
				obj.players[key].tie = Math.round(tieCount[obj.players[key].id] / MONTE_CARLO_LOOP * 1000) / 10;
			}
		} else { // 不参加プレイヤー
			obj.players[key].win = 0.0;
			obj.players[key].tie = 0.0;
		}
	}
	// 勝率計算が終わった後の処理
	obj.board = originalBoard;
	for (var key in obj.players) {
		obj.players[key].hand = originalHand[obj.players[key].id];
	}

	return obj;
}

/**
 * ターンとリバーを追加する全パターン計算。
 */
function calculateByAllPatternsAddingTurnAndRiver(obj)
{
	var winCount = {};
	var tieCount = {};
	var deck = makeDeck(obj.board, obj.players); // deckは外に出たカードを除いたトランプデッキ
	var originalBoard = obj.board;
	var loopCounter = 0;

	// 全パターンループ開始！
	for (var i=0; i<deck.length; i++) {
		for (var j=0; j<deck.length; j++) {
			if (i == j) continue; // 同じカードは無視する。
			var verificationDeck = [].concat(deck);
			obj.board            = [].concat(originalBoard);

			// ターンとリバーの追加
			var boardPosition = 0;
			for (var key=0; key<5; key++) {
				if (obj.board[key]) {
					obj.board[boardPosition] = obj.board[key];
					boardPosition += 1;
				}
			}
			obj.board[3] = verificationDeck[i]; // ターン
			obj.board[4] = verificationDeck[j]; // リバー

			// 準備ができたら勝者を求めよう!
			getPlayersPointAndKicker(obj);
			var winPlayers = getWinPlayer(obj);
			if (winPlayers.length == 1) {
				if (!winCount[winPlayers[0].id]) winCount[winPlayers[0].id] = 0;
				winCount[winPlayers[0].id] += 1;
			} else {
				for (var key in winPlayers) {
					if (!tieCount[winPlayers[key].id]) tieCount[winPlayers[key].id] = 0;
					tieCount[winPlayers[key].id] += 1;
				}
			}
			loopCounter += 1;
		}
	}

	// 勝率計算
	for (var key in obj.players) {
		if (!winCount[obj.players[key].id]) winCount[obj.players[key].id] = 0;
		if (!tieCount[obj.players[key].id]) tieCount[obj.players[key].id] = 0;
		obj.players[key].win = Math.round(winCount[obj.players[key].id] / loopCounter * 1000) / 10;
		obj.players[key].tie = Math.round(tieCount[obj.players[key].id] / loopCounter * 1000) / 10;
	}

	// 勝率計算が終わった後の処理
	obj.board = originalBoard;

	return obj;
}

/**
 * リバーを追加する全パターン計算。
 */
function calculateByAllPatternsAddingRiver(obj) {
	var winCount = {};
	var tieCount = {};
	var deck = makeDeck(obj.board, obj.players); // deckは外に出たカードを除いたトランプデッキ
	var originalBoard = obj.board;
	var loopCounter = 0;

	// 全パターンループ開始！
	for (var i=0; i<deck.length; i++) {
		var verificationDeck = [].concat(deck);
		obj.board            = [].concat(originalBoard);

		// リバーの追加
		var boardPosition = 0;
		for (var key=0; key<5; key++) {
			if (obj.board[key]) {
				obj.board[boardPosition] = obj.board[key];
				boardPosition += 1;
			}
		}
		obj.board[4] = verificationDeck[i]; // リバー

		// 準備ができたら勝者を求めよう!
		getPlayersPointAndKicker(obj);
		var winPlayers = getWinPlayer(obj);
		if (winPlayers.length == 1) {
			if (!winCount[winPlayers[0].id]) winCount[winPlayers[0].id] = 0;
			winCount[winPlayers[0].id] += 1;
		} else {
			for (var key in winPlayers) {
				if (!tieCount[winPlayers[key].id]) tieCount[winPlayers[key].id] = 0;
				tieCount[winPlayers[key].id] += 1;
			}
		}
		loopCounter += 1;
	}

	// 勝率計算
	for (var key in obj.players) {
		if (!winCount[obj.players[key].id]) winCount[obj.players[key].id] = 0;
		if (!tieCount[obj.players[key].id]) tieCount[obj.players[key].id] = 0;
		obj.players[key].win = Math.round(winCount[obj.players[key].id] / loopCounter * 1000) / 10;
		obj.players[key].tie = Math.round(tieCount[obj.players[key].id] / loopCounter * 1000) / 10;
	}

	// 勝率計算が終わった後の処理
	obj.board = originalBoard;

	return obj;
}

/**
 * 何も追加しない。
 */
function calculateByAllPatternsWithoutAdding(obj) {
	getPlayersPointAndKicker(obj);
	var winPlayers = getWinPlayer(obj);
	for (var key in obj.players) {
		var player = obj.players[key];
		obj.players[key].win = 0.0;
		obj.players[key].tie = 0.0;
		for (var key2 in winPlayers) {
			var winPlayer = winPlayers[key2];
			if (winPlayer.id == player.id) {
				if (winPlayers.length == 1) {
					obj.players[key].win = 100;
				} else {
					obj.players[key].tie = 100;
				}
				break;
			}
		}
	}

	return obj;
}

function makeDeck(board, players) {
	var trumps = [
		'As','2s','3s','4s','5s','6s','7s','8s','9s','Ts','Js','Qs','Ks',
		'Ah','2h','3h','4h','5h','6h','7h','8h','9h','Th','Jh','Qh','Kh',
		'Ad','2d','3d','4d','5d','6d','7d','8d','9d','Td','Jd','Qd','Kd',
		'Ac','2c','3c','4c','5c','6c','7c','8c','9c','Tc','Jc','Qc','Kc'
	];
	for (var key in board) {
		trumps.splice(trumps.indexOf(board[key]), 1);
	}
	for (var key in players) {
		if (players[key].hand == null) continue;
		trumps.splice(trumps.indexOf(players[key].hand[0]), 1);
		trumps.splice(trumps.indexOf(players[key].hand[1]), 1);
	}
	return trumps;
}

function getWinPlayer(obj) {
	var winPlayers = [];
	for (var key in obj.players) {
		if (obj.players.isActive == false) continue;
		winPlayers = updateWinPlayers(winPlayers, obj.players[key]);
	}
	return winPlayers;
}

function updateWinPlayers(winPlayers, player) {
	if (winPlayers.length == 0) {
		winPlayers.push(player);
	} else {
		var champion = winPlayers[0];
		if (champion.pointAndKicker.point < player.pointAndKicker.point) {
			return [player];
		} else if (champion.pointAndKicker.point == player.pointAndKicker.point) {
			return getSamePointWinner(winPlayers, player);
		}
	}
	return winPlayers;
}

function getSamePointWinner(winPlayers, player) {
	var champion = winPlayers[0];
	switch (champion.pointAndKicker.point){
		case 0: // ハイカード
			for (var i = 0; i<5; i++) {
				if (getNumFromCard(champion.pointAndKicker.kicker[i]) > getNumFromCard(player.pointAndKicker.kicker[i])) {
					return winPlayers;
				} else if (getNumFromCard(champion.pointAndKicker.kicker[i]) < getNumFromCard(player.pointAndKicker.kicker[i])) {
					return [player]
				}
			}
			winPlayers.push(player);
			return winPlayers;

		case 1: // ワンペア
			if (getNumFromCard(champion.pointAndKicker.pairNumString) > getNumFromCard(player.pointAndKicker.pairNumString)) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.pairNumString) < getNumFromCard(player.pointAndKicker.pairNumString)) {
				return [player]
			}
			for (var i = 0; i<3; i++) {
				if (getNumFromCard(champion.pointAndKicker.kicker[i]) > getNumFromCard(player.pointAndKicker.kicker[i])) {
					return winPlayers;
				} else if (getNumFromCard(champion.pointAndKicker.kicker[i]) < getNumFromCard(player.pointAndKicker.kicker[i])) {
					return [player]
				}
			}
			winPlayers.push(player);
			return winPlayers;

		case 2: // ツーペア
			for (var i = 0; i<2; i++) {
				if (getNumFromCard(champion.pointAndKicker.twoPairStringNum[i]) > getNumFromCard(player.pointAndKicker.twoPairStringNum[i])) {
					return winPlayers;
				} else if (getNumFromCard(champion.pointAndKicker.twoPairStringNum[i]) < getNumFromCard(player.pointAndKicker.twoPairStringNum[i])) {
					return [player]
				}
			}
			if (getNumFromCard(champion.pointAndKicker.kicker[0]) > getNumFromCard(player.pointAndKicker.kicker[0])) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.kicker[0]) < getNumFromCard(player.pointAndKicker.kicker[0])) {
				return [player]
			}
			winPlayers.push(player);
			return winPlayers;

		case 3: // スリーカード
			if (getNumFromCard(champion.pointAndKicker.numStringThere) > getNumFromCard(player.pointAndKicker.numStringThere)) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.numStringThere) < getNumFromCard(player.pointAndKicker.numStringThere)) {
				return [player]
			}
			for (var i = 0; i<2; i++) {
				if (getNumFromCard(champion.pointAndKicker.kicker[i]) > getNumFromCard(player.pointAndKicker.kicker[i])) {
					return winPlayers;
				} else if (getNumFromCard(champion.pointAndKicker.kicker[i]) < getNumFromCard(player.pointAndKicker.kicker[i])) {
					return [player]
				}
			}
			winPlayers.push(player);
			return winPlayers;

		case 4: // ストレート
			if (getNumFromCard(champion.pointAndKicker.kicker[0]) > getNumFromCard(player.pointAndKicker.kicker[0])) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.kicker[0]) < getNumFromCard(player.pointAndKicker.kicker[0])) {
				return [player]
			}
			winPlayers.push(player);
			return winPlayers;

		case 5: // フラッシュ
			for (var i = 0; i<5; i++) {
				if (getNumFromCard(champion.pointAndKicker.kicker[i]) > getNumFromCard(player.pointAndKicker.kicker[i])) {
					return winPlayers;
				} else if (getNumFromCard(champion.pointAndKicker.kicker[i]) < getNumFromCard(player.pointAndKicker.kicker[i])) {
					return [player]
				}
			}
			winPlayers.push(player);
			return winPlayers;

		case 6: // フルハウス
			if (getNumFromCard(champion.pointAndKicker.numStringThere) > getNumFromCard(player.pointAndKicker.numStringThere)) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.numStringThere) < getNumFromCard(player.pointAndKicker.numStringThere)) {
				return [player]
			}
			if (getNumFromCard(champion.pointAndKicker.numStringTwo) > getNumFromCard(player.pointAndKicker.numStringTwo)) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.numStringTwo) < getNumFromCard(player.pointAndKicker.numStringTwo)) {
				return [player]
			}
			winPlayers.push(player);
			return winPlayers;

		case 7: // フォーカード
			if (getNumFromCard(champion.pointAndKicker.numString) > getNumFromCard(player.pointAndKicker.numString)) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.numString) < getNumFromCard(player.pointAndKicker.numString)) {
				return [player]
			}
			if (getNumFromCard(champion.pointAndKicker.kicker[0]) > getNumFromCard(player.pointAndKicker.kicker[0])) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.kicker[0]) < getNumFromCard(player.pointAndKicker.kicker[0])) {
				return [player]
			}
			winPlayers.push(player);
			return winPlayers;

		case 8: // ストレートフラッシュ
			if (getNumFromCard(champion.pointAndKicker.kicker[0]) > getNumFromCard(player.pointAndKicker.kicker[0])) {
				return winPlayers;
			} else if (getNumFromCard(champion.pointAndKicker.kicker[0]) < getNumFromCard(player.pointAndKicker.kicker[0])) {
				return [player]
			}
			winPlayers.push(player);
			return winPlayers;
	}
	winPlayers.push(player);
	return winPlayers;
}

function getPlayersPointAndKicker(obj) {
	for (var key in obj.players) {
		if (obj.players.isActive == false) continue;
		var pointAndKicker = getPointAndKicker(obj.board, obj.players[key].hand);
		obj.players[key].pointAndKicker = pointAndKicker;
	}
}


function getPointAndKicker(board, hand){
	var sevenBord = createSevenBoard(board, hand);
	var hasStraitFlushResult = hasStraitFlush(sevenBord);
	if (hasStraitFlushResult.result == true) {
		if (DEBUG_MODE == true) {
			console.log('has StraitFlush');
			console.log(hasStraitFlushResult.kicker);
		}
		return {
			point: 8,
			kicker: hasStraitFlushResult.kicker
		}
	}
	var hasFourCardResult = hasFourCard(sevenBord);
	if (hasFourCardResult.result == true) {
		if (DEBUG_MODE == true) {
			console.log('has FourCard');
			console.log(hasFourCardResult.numString);
			console.log(hasFourCardResult.kicker);
		}
		return {
			point: 7,
			numString: hasFourCardResult.numString,
			kicker: hasFourCardResult.kicker
		}
	}
	var hasFullHouseResult = hasFullHouse(sevenBord);
	if (hasFullHouseResult.result == true) {
		if (DEBUG_MODE == true) {
			console.log('has FullHouse');
			console.log(hasFullHouseResult.numStringThere);
			console.log(hasFullHouseResult.numStringTwo);
		}
		return {
			point: 6,
			numStringThere: hasFullHouseResult.numStringThere,
			numStringTwo: hasFullHouseResult.numStringTwo
		}
	}
	var hasFlushResult = hasFlush(sevenBord);
	if (hasFlushResult.result == true) {
		if (DEBUG_MODE == true) {
			console.log('has Flush');
			console.log(hasFlushResult.mark);
			console.log(hasFlushResult.kicker);
		}
		return {
			point: 5,
			mark: hasFlushResult.mark,
			kicker: hasFlushResult.kicker
		}
	}
	var hasStraightResult = hasStraight(sevenBord);
	if (hasStraightResult.result == true) {
		if (DEBUG_MODE == true) {
			console.log('has Straight');
			console.log(hasStraightResult.kicker);
		}
		return {
			point: 4,
			kicker: hasStraightResult.kicker
		}
	}
	var hasThreeCardResult = hasThreeCard(sevenBord);
	if (hasThreeCardResult.result == true) {
		if (DEBUG_MODE == true) {
			console.log('has ThreeCard');
			console.log(hasThreeCardResult.nsumStringThere);
			console.log(hasThreeCardResult.kicker);
		}
		return {
			point: 3,
			numStringThere: hasThreeCardResult.numStringThere,
			kicker: hasThreeCardResult.kicker
		}
	}
	var hasTwoPairResult = hasTwoPair(sevenBord);
	if (hasTwoPairResult.result == true) {
		if (DEBUG_MODE == true) {
			console.log('has TwoPair');
			console.log(hasTwoPairResult.twoPairStringNum);
			console.log(hasTwoPairResult.kicker);
		}
		return {
			point: 2,
			twoPairStringNum: hasTwoPairResult.twoPairStringNum,
			kicker: hasTwoPairResult.kicker
		}
	}
	var hasPairResult = hasPair(sevenBord);
	if (hasPairResult.result == true) {
		if (DEBUG_MODE == true) {
			console.log('has hasPair');
			console.log(hasPairResult.pairNumString);
			console.log(hasPairResult.kicker);
		}
		return {
			point: 1,
			pairNumString: hasPairResult.pairNumString,
			kicker: hasPairResult.kicker
		}
	}
	// ハイカード
	if (DEBUG_MODE == true) {
		console.log('high cards');
		console.log([sevenBord[0], sevenBord[1], sevenBord[2], sevenBord[3], sevenBord[4]]);
	}
	return {
		point: 0,
		kicker: [sevenBord[0], sevenBord[1], sevenBord[2], sevenBord[3], sevenBord[4]]
	}
}

function hasPair(sevenBord) {
	for (var i=0; i<6; i++) {
		if (sevenBord[i].charAt(0) == sevenBord[i+1].charAt(0)) { // ペアがあった！
			var pairNumString = sevenBord[i].charAt(0);
			var kicker = [];
			for (var key in sevenBord) {
				if (pairNumString != sevenBord[key].charAt(0))  {
					kicker.push(sevenBord[key]);
					if (kicker.length == 3) {
						return {result: true, pairNumString: pairNumString, kicker: kicker};
					}
				}
			}
		}
	}
	return {result: false};
}

function hasTwoPair(sevenBord) {
	var twoPairStringNum = [];
	var kicker = [];
	for (var i=0; i<6; i++) {
		if (sevenBord[i].charAt(0) == sevenBord[i+1].charAt(0)) {
			twoPairStringNum.push(sevenBord[i].charAt(0));
			if (twoPairStringNum.length == 2) { // ツーペアがあった！
				if (kicker.length == 0) kicker = [sevenBord[4]];
				return {result: true, twoPairStringNum: twoPairStringNum, kicker: kicker[0]};
			}
			i++;
		} else {
			kicker.push(sevenBord[i]);
		}
	}
	return {result: false};
}

function hasThreeCard(sevenBord) {
	var countNum = {};
	for (var key in sevenBord) {
		var numStringThere = sevenBord[key].charAt(0);
		if (!countNum[numStringThere]) {
			countNum[numStringThere] = 1;
		} else {
			countNum[numStringThere] += 1;
			if (countNum[numStringThere] >= 3) { // ３カードあった！（大きい順にならんでいるので、始めにみつけた３カードが最強）
				var kicker = [];
				for (var key in sevenBord) {
					if (numStringThere != sevenBord[key].charAt(0)) {
						kicker.push(sevenBord[key]);
						if (kicker.length == 2) {
							return {result: true, numStringThere: numStringThere, kicker: kicker};
						}
					}
				}
			}
		}
	}
	return {result: false};
}

function hasStraight(sevenBord) {
	var kicker = [];
	var continuingNumCounter = 1;
	for (var key in sevenBord) {
		var num = getNumFromCard(sevenBord[key]);
		if (Number(key) == (sevenBord.length-1)) { // 最後か？（Aと２の結合カウント）
			if (num == 2 && 'A' == sevenBord[0].charAt(0)) {
				continuingNumCounter += 1;
				kicker.push(sevenBord[key]);
				if (continuingNumCounter == 5) {
					kicker.push(sevenBord[0]);
					return {
						result: true,
						kicker: kicker
					};
				}
			}
		} else {
			if ((num - 1) == getNumFromCard(sevenBord[Number(key)+1])) {
				continuingNumCounter += 1;
				kicker.push(sevenBord[key]);
				if (continuingNumCounter == 5) {
					kicker.push(sevenBord[Number(key)+1]);
					return {
						result: true,
						kicker: kicker
					};

				}
			} else if (num == getNumFromCard(sevenBord[Number(key)+1])) { // 同じ数字が連続した場合はスキップ
				continue;
			} else {
				continuingNumCounter = 1;
				kicker = [];
			}
		}
	}
	return {result: false};
}

function hasFullHouse(sevenBord) {
	var countNum = {};
	for (var key in sevenBord) {
		var numStringThere = sevenBord[key].charAt(0);
		if (!countNum[numStringThere]) {
			countNum[numStringThere] = 1;
		} else {
			countNum[numStringThere] += 1;
			if (countNum[numStringThere] >= 3) { // ３カードあった！（大きい順にならんでいるので、始めにみつけた３カードが最強）
				countNum = {};
				for (var key in sevenBord) {
					var numStringTwo = sevenBord[key].charAt(0);
					if (numStringThere != numStringTwo) {
						if (!countNum[numStringTwo]) {
							countNum[numStringTwo] = 1;
						} else {
							countNum[numStringTwo] += 1;
							if (countNum[numStringTwo] >= 2) { // フルハウス発見！（）こちらも始めに見つかった２ペアが最強
								return {result: true, numStringThere: numStringThere, numStringTwo: numStringTwo};
							}
						}
					}
				}
			}
		}
	}
	return {result: false};
}

function hasFourCard(sevenBord) {
	var countNum = {};
	for (var key in sevenBord) {
		var numString = sevenBord[key].charAt(0);
		if (!countNum[numString]) {
			countNum[numString] = 1;
		} else {
			countNum[numString] += 1;
			if (countNum[numString] >= 4) { // ４カードあった！キッカーを見つけよう！
				var kicker = [];
				for (var key in sevenBord) {
					if (numString != sevenBord[key].charAt(0)) {
						kicker.push(sevenBord[key].charAt(0));
						return {result: true, numString: numString, kicker: kicker};
					}
				}
			}
		}
	}
	return {result: false};
}

function hasFlush(sevenBord){
	var countMarks = { s: 0, h: 0, d: 0, c: 0 };
	for (var key in sevenBord) {
		var mark = sevenBord[key].charAt(1);
		countMarks[mark] += 1;
		if (countMarks[mark] >= 5) { // フラッシュがあった（見つけた順からキッカー）
			var kicker = [];
			for (var key in sevenBord) {
				if (sevenBord[key].charAt(1) == mark) {
					kicker.push(sevenBord[key].charAt(0));
					if (kicker.length == 5) return {result: true, mark: mark, kicker: kicker};
				}
			}
		}
	}
	return {result: false};
}

function hasStraitFlush(sevenBord){
	var hasFlushResult = hasFlush(sevenBord);
	if (hasFlushResult.result == false) return false;
	var mark = hasFlushResult.mark;
	return hasStraitByMark(sevenBord, mark);
}

function hasStraitByMark(sevenBord, mark) {
	var sameMarkBoard = [];
	for(var key in sevenBord) {
		if (sevenBord[key].charAt(1) == mark) sameMarkBoard.push(sevenBord[key]);
	}
	var hasStraightResult = hasStraight(sameMarkBoard);
	if (hasStraightResult.result == true) {
		return {
			result: true,
			kicker: hasStraightResult.kicker
		}
	}
	return {result: false};
}

function hasRandomHand(players) {
	for (var key in players) {
		var player = players[key];
		if (!player.hand[0] || !player.hand[1]) {
			return true;
		}
	}
	return false;
}

// 大きい順に並んだ７枚のボードを作成します。
function createSevenBoard(board, hand) {
	var gotSevenBoard = board.concat(hand);
	return gotSevenBoard.sort(function(a, b) {
		return ( getNumFromCard(a) < getNumFromCard(b) ? 1 : -1);
	});
}

// カードから数値を取得します。
function getNumFromCard(card){
	switch (card.charAt(0)){
		case 'A':
			return 14;
		case 'K':
			return 13;
		case 'Q':
			return 12;
		case 'J':
			return 11;
		case 'T':
			return 10;
	}
	return Number(card.charAt(0));
}

// ボードにセットされているカードの数を返す。
function getBoardLegth(board)
{
	var boardCount = 0;
	for (var key in board) {
		if (board[key]) boardCount += 1;
	}
	return boardCount;
}

module.exports = {
	getWinPlayer: getWinPlayer,
	getPlayersPointAndKicker: getPlayersPointAndKicker,
	getWinPer: getWinPer
}
