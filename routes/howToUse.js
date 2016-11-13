Config = require('../config');

exports.howToUse = function(req, res){
	res.render(
		'oddsSystem/howTo',
		{
			title: 'how to use.'
		}
	);
};