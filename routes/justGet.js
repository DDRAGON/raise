
exports.justGet = function(req, res){
	res.render(req.originalUrl.slice(1), { host: req.headers.host});
};