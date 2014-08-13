Config = require('../config');

exports.oddsSystem = function(req, res){
	res.render('oddsSystem', { title: 'poker oddsSystem', hostAddress: Config.getHostAddress() });
};