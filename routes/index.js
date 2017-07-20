var getWinPer = require('../modules/getWinPer');

exports.index = function(req, res){

   if (!req.query.player && !req.query.p) {
      res.render('index', { title: 'allin.jp', description:"ポーカーハンド公開配信用サイト" });
   } else {

      var playersName = [];

      if (req.query.player) {
         playersName = req.query.player.split(',');
      } else if (req.query.p){
         playersName = req.query.p.split(',');
      } else {
         res.render('index', { title: 'allin.jp', description:"ポーカーハンド公開配信用サイト" });
         return;
      }

      if (playersName.length > 23) {
         res.render('index', { title: 'allin.jp', description:"ポーカーハンド公開配信用サイト" });
         return;
      }

      var trumps = [
         'As','2s','3s','4s','5s','6s','7s','8s','9s','Ts','Js','Qs','Ks',
         'Ah','2h','3h','4h','5h','6h','7h','8h','9h','Th','Jh','Qh','Kh',
         'Ad','2d','3d','4d','5d','6d','7d','8d','9d','Td','Jd','Qd','Kd',
         'Ac','2c','3c','4c','5c','6c','7c','8c','9c','Tc','Jc','Qc','Kc'
      ];
      var pokerObject = {};
      pokerObject.players = {};
      pokerObject.board = [];
      var description = "";

      var playersObj = [];
      playersName.forEach(function (name, key){

         var hands = [];
         description += name + ": ";

         var cardPosition = Math.floor(Math.random() * trumps.length);
         hands[0] = trumps[cardPosition];
         trumps.splice(cardPosition, 1);
         cardPosition = Math.floor(Math.random() * trumps.length);
         hands[1] = trumps[cardPosition];
         trumps.splice(cardPosition, 1);

         description += changeForDisplay(hands[0])+changeForDisplay(hands[1]) + '\n';

         pokerObject.players[key] = {
            name: name,
            hand: hands,
            isActive: true
         };
      });

      description += '\n';
      description += 'board:[ ';

      var boards = [];
      for(var i = 0; i < 5; i++) {
         var cardPosition = Math.floor(Math.random() * trumps.length);
         boards[i] = trumps[cardPosition];
         trumps.splice(cardPosition, 1);
         description += changeForDisplay(boards[i]) + " ";
      }
      description += ' ]\n';
      pokerObject.board = boards;

      // 勝者を求める
      getWinPer.getPlayersPointAndKicker(pokerObject);
      var winPlayers = getWinPer.getWinPlayer(pokerObject);

      winPlayers.forEach(function (player, key){
         description += player.name + ' ';
      });
      description += 'の勝利です！';



      res.render('index', { title: 'allin.jp', description: description});
   }


};

function changeForDisplay(cardData){
   var returnText = "";
   for(var j = 0; j < cardData.length; j++) {
      if (cardData.charAt(j) == 's') {
         returnText += '♠️';
      } else if (cardData.charAt(j) == 'h') {
         returnText += '♡️';
      } else if (cardData.charAt(j) == 'd') {
         returnText += '♢️';
      } else if (cardData.charAt(j) == 'c') {
         returnText += '♣️';
      } else {
         returnText += cardData.charAt(j);
      }
   }

   return returnText;
}