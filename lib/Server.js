var
	net = require('net'),
	fs = require('fs'),
	UdsSocket = require('./Socket');

function UdsServer(options, callback) {
	this.server = net.createServer(function(client) {
		var socket = new UdsSocket(client);
		if (callback) callback(socket);
	});
}

UdsServer.prototype.listen = function(path) {
	if (fs.existsSync(path)) fs.unlinkSync(path);
	console.log('listening on ' + path);
	this.server.listen(path);
};

module.exports = UdsServer;