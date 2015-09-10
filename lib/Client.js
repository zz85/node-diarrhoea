var
	net = require('net'),
	fs = require('fs'),
	util = require('util'),
	UdsSocket = require('./Socket');

function UdsClient() {
	var socket = new net.Socket();
	UdsSocket.call(this, socket);
}

util.inherits(UdsClient, UdsSocket);

UdsClient.prototype.connect = function(path) {
	this.socket.connect({path: path});
};

module.exports = UdsClient;