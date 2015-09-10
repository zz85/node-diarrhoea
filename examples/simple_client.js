// simple client example
var uds = require('../index');

var client = new uds.Client();

client.connect('./test.sock');
client.post_message('ping', Math.random());
