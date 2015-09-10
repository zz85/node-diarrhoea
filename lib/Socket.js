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

UdsSocket.prototype.bind = function(object) {
	this._bind = object;
};

UdsSocket.prototype.process_line = function(line) {
	if (!line) {
		// likely socket closing
		return;
	}

	console.log('<<< ', line);

	try {
		var args = JSON.parse(line);
		var method = args[0];
		var params = args[1];

		this.emit('rpc', method, params);

		if (this._bind) {
			if (this._bind[method]) {
				this._bind[method].apply(this, params);
			}
			else {
				console.log('warn: bind.' + method + '() is not implemented');
			}
		}
	}
	catch (e) {
		console.log('Error processing line', e, line);
	}
};

UdsSocket.prototype.post_message = function(msg) {
	var params = Array.prototype.slice.call(arguments, 1);
	try {
		this.send(msg, params);
	}
	catch (e) {
		console.log('Error Sending', e);
	}
};

UdsSocket.prototype.send = function(msg, params) {
	if (this.state == 'closed') {
		console.log('socket already closed!');
		return;
	}
	var json = JSON.stringify([msg, params]);
	this.socket.write(json + this.LINE_DELIMITER);
	console.log('>>> ', json);
};

UdsSocket.prototype.end = function() {
	this.socket.end();
};

module.exports = UdsSocket;