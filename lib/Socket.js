var
	split = require('split'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

function UdsSocket(socket) {
	EventEmitter.call(this);

	this.socket = socket;
	this.LINE_DELIMITER = '\n';
	this._bind = null;

	var self = this;
	self.state = 'connected';
	// connecting, connected, closed

	socket.setEncoding('utf-8');

	socket
		.pipe(split(this.LINE_DELIMITER))
		.on('data', this.process_line.bind(this));

	socket.on('connect', function(e) {
		self.emit('connect', e);
	});

	socket.on('error', function(e) {
		console.log('error', e);
		self.emit('error', e);
	});

	socket.on('end', function() {
		self.emit('end');
	});

	socket.on('close', function(e) {
		// server is closing
		// was there error? e.had_error (log something);
		console.log('closing', e.had_error, e);
		self.emit('close', e);
		socket.removeAllListeners();
		self.state = 'closed';
	});
}

util.inherits(UdsSocket, EventEmitter);

UdsSocket.prototype.process_line = function(line) {
	if (!line) {
		// likely socket closing
		return;
	}

	var args = JSON.parse(line);
	var method = args[0];

	console.log('received + emit', line, method, args[1]);

	this.emit('rpc', method, args[1]);

	if (this._bind && this._bind[method]) {
		this._bind[method].apply(this, args[1]);
	}
};

UdsSocket.prototype.post_message = function(msg, params) {
	try {
		this.send(msg, params);
	} catch (e) {
		console.log('Error json');
	}
};

UdsSocket.prototype.send = function(msg, params) {
	var json = JSON.stringify([msg, params]);
	this.socket.write(json + this.LINE_DELIMITER);
	console.log('sending ', json);
};

UdsSocket.prototype.end = function() {
	this.socket.end();
}

module.exports = UdsSocket;