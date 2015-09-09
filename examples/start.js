var uds = require('../index');

var server = new uds.Server({}, function(socket) {
	console.log('meow');
	socket.on('rpc', function() {
		console.log('on rpc', arguments);
	})
});

server.listen('./test.sock');