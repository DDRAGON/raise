var async = require('async');

var clients = {};


function connect(name, callback) {
	if (!clients[name]) {
		clients[name] = {};
	}
	callback();
}

module.exports = {
	connect: connect
};
