Config = require('../config');

exports.forDealer = function(req, res){
	res.render(
		'forDealer',
		{
			title: 'Dealer',
			hostAddress: Config.getHostAddress()
		}
	);
};