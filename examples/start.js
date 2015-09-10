// simple server example
var uds = require('../index');

var server = new uds.Server();

server.on('connection', function(socket) {
	console.log('new connection');
	socket.on('rpc', function(method, params) {
		console.log('on rpc', arguments);
	});
});

server.listen('./test.sock');