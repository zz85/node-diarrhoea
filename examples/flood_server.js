// server example that calculating flood rates
var uds = require('../index');
var Meter = require('./Meter');

var server = new uds.Server();


var recvMeter = new Meter('receive');

server.on('connection', function(socket) {
	console.log('New connection');

	socket.bind({
		ping: function(x, time) {
			recvMeter.inc();
			// socket.post_message('pong', x, time);
		}
	});

	// socket.on('error', function() {
	// 	console.log('error!!')
	// })

	// socket.on('close', function() {
	// 	console.log('close!!')
	// })

	socket.on('end', function() {
		console.log('end!!')
	})


});


setInterval(function() {
	recvMeter.clear();
}, 1000);

server.listen('./test.sock');