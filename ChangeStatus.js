
var mqtt = require('mqtt');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/TrafficLights";

var options = {
    port: 16479,
    host: 'tcp://m12.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'sxdzesyk',
    password: 'dc_pY7Q7gOTw',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('tcp://m12.cloudmqtt.com', options);

client.on('error', function(err){
	console.log(err);
});

    var connected = false;

    client.on('connect', function(){
    	console.log("Connected, or not?");
        client.subscribe('TrafficLights');
        client.publish('TrafficLights', 'Here we are!');
    });

    client.on('message', function(topic, message){
        if(topic == 'TrafficLights') {

            console.log(message.toString());

            if(message.toString().indexOf("sno") == 0) {
                var serial = message.toString().substring(5, message.toString().indexOf("status") - 1);
                var stat = message.toString().substring(message.toString().indexOf("status") + 8);

                console.log("Serial = " + serial);
                console.log("Status = " + stat);

                MongoClient.connect(mongoUrl, function (err, db) {
                    db.collection('TrafficTable').update({"sno": serial}, {$set: {"status": stat}});
                });
            }
            else
            {
                console.log("Waiting for state change...");
            }
      }});

console.log("Server running at http://127.0.0.1:81");
