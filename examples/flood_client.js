// client example for floding server

var uds = require('../index');
var Meter = require('./Meter');

var client = new uds.Client();
client.connect('./test.sock');

var FLOODING = 40000;
var count = 0;

var recvMeter = new Meter('receive');
var sendMeter = new Meter('send');


client.bind({
	pong: function(msg, time) {
		count++;
		if (count % FLOODING === 0) {
			console.log('RTT', Date.now() - time);
		}
		recvMeter.inc();
	}
});

function flood() {
	var now = Date.now();
	for (var i = 0; i < FLOODING; i++) {
		client.post_message('ping', 'flood' + i, now);

		sendMeter.inc();
	}

	recvMeter.clear();
}

var interval = setInterval(flood, 1000);
client.on('close', function() {
	console.log('Socket closed!');
	clearInterval(interval);
});

client.post_message('ping', 'Hello world!');