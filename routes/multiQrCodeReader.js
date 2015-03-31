Config = require('../config');

exports.multiQrCodeReader = function(req, res){
	res.render(
		'multiQrCodeReader',
		{
			title: 'multi QR Code Reader',
			hostAddress: Config.getHostAddress()
		}
	);
};
