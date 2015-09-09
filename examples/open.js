var uds = require('../index');

var c = new uds.Client();
client = c.connect('./test.sock');

// console.log(client);

client.post_message('ping', Math.random())