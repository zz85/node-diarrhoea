// server example with bind
var uds = require('../index');

var server = new uds.Server();

server.on('connection', function(socket) {
	console.log('New connection');

	socket.bind({
		ping: function(x) {
			console.log('Received ping', x);
			setTimeout(function() {
				var pong = Math.random() * 99999 | 0;
				console.log('Sending pong', pong)
				socket.post_message('pong', pong);
			}, Math.random() * 5000)
		}
	});
});

server.listen('./test.sock');