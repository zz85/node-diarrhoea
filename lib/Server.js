var
	net = require('net'),
	fs = require('fs'),
	util = require('util'),
	UdsSocket = require('./Socket');
	EventEmitter = require('events').EventEmitter;

function UdsServer(callback) {
	EventEmitter.call(this);
	this.server = net.createServer(callback);

	var self = this;
	this.server.on('connection', function(client) {
		var socket = new UdsSocket(client);
		self.emit('connection', socket)
	});

	console.log(this.server.maxConnections);

}

util.inherits(UdsServer, EventEmitter);

UdsServer.prototype.listen = function(path) {
	if (fs.existsSync(path)) fs.unlinkSync(path);
	console.log('listening on ' + path);
	this.server.listen(path);
};

module.exports = UdsServer;