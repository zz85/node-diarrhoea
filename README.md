# Diarrhoea
Diarrhoea is a simple node.js library for making IPC/RPC calls over UDS.

Using UDS or Unix Domain Sockets is one of the most efficient approaches for inter-process communication.
They behave almost like TCP Sockets, without the overheads and latency of the network layer.

### Why diarrhoea (UK spelling of diarrhea)?
I was thinking of names that means fast, unfortunately I'm not very creative with names.
Diarrhoea isn't always fun, but hopfully it helps to ease some discomfort.

## Example


```js
var Server = require('diarrhoea').Server;

var udsPath = './hello.sock';
var server = new Server();
server.listen(udsPath);

server.on('connection', onConnection);

var handler = {
	'ping': function(msg) {
		console.log('Received ping', msg);
	}
};

function onConnection(client) {
	client.post_message('hello', 1234); // makes a rpc call to client

	client.bind(handler);

	client.on('rpc', function(method, params) {
	});

	client.on('end', function() {
		console.log('connection dropped');
	});

	setTimeout(function() {
		client.end();
	}, 5000);
}
```

```js
var Client = require('diarrhoea').Client;
var udsPath = './hello.sock';
var client = new Client();
client.connect(udsPath);

client.post_message('ping', Math.random());
// possible to do reflections in es6

var handler = {
	pong: function(msg) {
		console.log('received pong', msg);
	}
};

client.bind(handler);
client.on('rpc', function customHandler(method, params) {});
client.on('end', function() {
	console.log('socket closed!');
});
````

More examples under `examples/`