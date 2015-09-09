var
	net = require('net'),
	fs = require('fs'),
	UdsSocket = require('./Socket');

function UdsClient() {

}

UdsClient.prototype.connect = function(path) {
	var socket = net.connect({path: path, encoding: 'utf-8'});
	return new UdsSocket(socket);
};

module.exports = UdsClient;