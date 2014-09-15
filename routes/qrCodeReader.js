Config = require('../config');

exports.qrCodeReader = function(req, res){
	res.render(
		'qrCodeReader',
		{
			title: 'QR Code Reader',
			hostAddress: Config.getHostAddress()
		}
	);
};