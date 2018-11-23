var dgram = require("dgram");
var server = dgram.createSocket("udp4");
const request = require('request')

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
    checkdata(msg);
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
    address: '0.0.0.0',
    port: 7000,
    exclusive: true
  });

checkdata("DHT11,2,25.00,45.00");


function line_notify(msg) {
    request({
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          bearer: 'dvR6TeBMQlqxEJDcRANBpTi6KyJlFMEWeEd9nTFLTbH', 
        },
        form: {
          message: msg,
        },
      }, (err, httpResponse, body) => {
        if (err) {
          console.log(err)
        } else {
          console.log(body)
        }
      })
 } 

 function checkdata(msg){
    arr = msg.split(',')
    name_sensor_1 = ['Humidity','Temperature'] 
    name_sensor_2 = ['Volt','Current'] 
    name_sensor_3 = ['x','y','z'] 

    if(arr[0] == "DHT11"){
        var i = parseInt(arr[1])
        for(var j = 0 ; j < i; j++){
        console.log(name_sensor_1[j] + " : " + arr[j+2]);
        line_notify(name_sensor_1[j] + " : " + arr[j+2]);
        }
    }else if(arr[0] == "SW"){
        var i = parseInt(arr[1])
        for(var j = 0 ; j < i; j++){
        console.log("SW" + j + " : " + arr[j+2]);
        line_notify("SW" + j + " : " + arr[j+2]);
        }        
    }else if(arr[0] == "Elec"){
        var i = parseInt(arr[1])
        for(var j = 0 ; j < i; j++){
        console.log(name_sensor_2[j] + " : " + arr[j+2]);
        line_notify(name_sensor_2[j] + " : " + arr[j+2]);
        }        
    }else if(arr[0] == "Gyro"){
        var i = parseInt(arr[1])
        for(var j = 0 ; j < i; j++){
        console.log(name_sensor_3[j] + " : " + arr[j+2]);
        line_notify(name_sensor_3[j] + " : " + arr[j+2]);
        }         
    }else{

    }
 }