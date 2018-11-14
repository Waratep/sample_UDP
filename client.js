var dgram = require('dgram');
var client = dgram.createSocket("udp4");

var message = new Buffer("Hello");

client.send(message, 0, message.length, 7000, "localhost", function(err) {
    if (err) throw err;
    // client.close();
});

client.on("message", function(message, rinfo) {
    console.log("recieved: " + message + " from " + rinfo.address + ":" + rinfo.port);
    client.close();
});