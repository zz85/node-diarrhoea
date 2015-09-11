# Diarrhoea
Diarrhoea is a simple node.js library for making IPC/RPC calls between different processes quickly over UDS. This may be useful for scaling tasks out of a single node process.

Using UDS or Unix Domain Sockets is one of the most efficient approaches for inter-process communication.
They behave almost like TCP Sockets, without the overheads and latency of the network layer.

### Why "Diarrhoea"?
Diarrhoea is the UK spelling of diarrhea, which describes some things that move fluidly and fast, and not very public. It isn't the best experience usually, but is sometimes required for your systems. (It's unfortunate I'm not very creative with names).


## Usage

Npm installable, or git clone the repository. Also see examples below.

```sh
npm install diarrhoea
```

Running 1x `node examples/flood_server.js` and 2x `node examples/flood_client.js` on my macbook air shows handling ~60K requests + 60K responses a second.

![screen shot 2015-09-11 at 11 50 35 am](https://cloud.githubusercontent.com/assets/314997/9806794/37d75f12-587c-11e5-9b0d-4b9d6d91454b.png)

## API
These classes mimics the structure of node.js socket and server objects.

Diarrhoea UDS Classes
- Server
 - listen(path)

- Client
 - connect(path)

- Socket
 - post_message('method', args...)
 - emits `close`, `connect`, `error`, `end`
 - bind(object)
 - end

## Examples
Check out and run the examples in `examples/*` (you may need to npm install for dev dependencies).

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

### Upcoming
- request+response rpc style calls.