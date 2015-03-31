Config = require('../config');

exports.manAAgeTool = function(req, res){
	res.render(
		'manAAgeTool',
		{
			title: 'manage',
			hostAddress: Config.getHostAddress()
		}
	);
};
