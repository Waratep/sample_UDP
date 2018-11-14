var dgram = require("dgram");
var server = dgram.createSocket("udp4");

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
    var ack = new Buffer("Hello ack");
    server.send(ack, 0, ack.length, rinfo.port, rinfo.address, function(err, bytes) {
      console.log("sent ACK.");
    }); 
});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});

server.bind({
    address: 'localhost',
    port: 7000,
    exclusive: true
  });