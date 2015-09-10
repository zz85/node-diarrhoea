// client example with bind

var uds = require('../index');

var client = new uds.Client();
client.connect('./test.sock');

client.bind({
	pong: function(y) {
		console.log('received pong', y);
	}
});

setInterval(function() {
	var ping = Math.random() * 111111 | 0;
	console.log('Sending ping', ping);
	client.post_message('ping', ping);
}, 5000);

client.post_message('ping', 'Hello world!');