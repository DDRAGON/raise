Config = require('../config');

exports.dedicatedTable = function(req, res){
	res.render(
		'dedicatedTable',
		{
			title: 'Dedicated table system',
			hostAddress: Config.getHostAddress()
		}
	);
};
