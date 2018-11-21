var dgram = require("dgram");
var server = dgram.createSocket("udp4");
const request = require('request')

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
    line_notify(msg);
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

function line_notify(msg) {
    request({
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          bearer: 'dvR6TeBMQlqxEJDcRANBpTi6KyJlFMEWeEd9nTFLTbH', //token
        },
        form: {
          message: msg, //ข้อความที่จะส่ง
        },
      }, (err, httpResponse, body) => {
        if (err) {
          console.log(err)
        } else {
          console.log(body)
        }
      })
 } 