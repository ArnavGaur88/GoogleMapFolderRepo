var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/triiaffic');
const mqtt = require('mqtt')  
/* GET home page. */




router.get('/', function(req, res, next) {
  res.render('index', { title: 'index' });

});


router.get('/signal',ensureAuthenticated,function(req, res, next) {
  res.render('signal', { title: 'Express' });

var options = {
    port: 16479,
    host: 'tcp://m12.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'sxdzesyk',
    password: 'dc_pY7Q7gOTw',
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('tcp://m12.cloudmqtt.com', options);
//console.log(client);
client.on('connect', function() { // When connected
console.log('connected');
    // subscribe to a topic
client.subscribe('signal1', function() {
// when a message arrives, do something with it
client.on('message', function(topic, message, packet) {
var mymsg=(message);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/abcz";
MongoClient.connect(url, function(err, db) {
if (err) throw err;
var myobj = {name: mymsg.toString()};
console.log("THIS IS 1STH MSG"+""+""+mymsg.toString());
db.collection("data").insertOne(myobj, function(err, res) {
if (err) throw err;
console.log("1 record inserted");
db.close();
});

});
});
});
});

//----------------------------------2nd-------------------------------------------------

var options2 = {
    port: 16479,
    host: 'tcp://m12.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(19).substr(1, 7),
    username: 'sxdzesyk',
    password: 'dc_pY7Q7gOTw',
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client2 = mqtt.connect('tcp://m12.cloudmqtt.com', options2);
//console.log(client);
client2.on('connect', function() { // When connected
    
  console.log('connected2sinal2');
    // subscribe to a topic2
client2.subscribe('signal2', function() {
// when a message arrives, do something with it
client2.on('message', function(topic, message, packet) {
var mymsg2=(message);
//console.log("THIS IS 2rd MSG"+""+""+mymsg2.toString());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/abcz";
MongoClient.connect(url, function(err, db) {
if (err) throw err;
var myobj = {name: mymsg2.toString()};
console.log("THIS IS 1STH MSG"+""+""+mymsg2.toString());
db.collection("data1").insertOne(myobj, function(err, res) {
if (err) throw err;
console.log("1 record inserted(s2)");
db.close();


});
});
});
});
});

//-----------------------------3rd-----------------------------------------------
var options3 = {
    port: 16479,
    host: 'tcp://m12.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(20).substr(4, 6),
    username: 'sxdzesyk',
    password: 'dc_pY7Q7gOTw',
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client3 = mqtt.connect('tcp://m12.cloudmqtt.com', options3);
//console.log(client);
client3.on('connect', function() { // When connected
    
  console.log('connectedsignal3');
    // subscribe to a topic
client3.subscribe('signal3', function() {
// when a message arrives, do something with it
client3.on('message', function(topic, message, packet) {
var mymsg3=(message);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/abcz";
MongoClient.connect(url, function(err, db) {
if (err) throw err;
var myobj = {name: mymsg3.toString()};
console.log("THIS IS 3rd MSG"+""+""+mymsg3.toString());
db.collection("data2").insertOne(myobj, function(err, res) {
if (err) throw err;
console.log("1 record inserted(s3)");
db.close();


});
});

});
});
});

//---------------------------------------------4th--------------------------------------------------
var options4 = {
    port: 16479,
    host: 'tcp://m12.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(21).substr(5, 9),
    username: 'sxdzesyk',
    password: 'dc_pY7Q7gOTw',
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client4 = mqtt.connect('tcp://m12.cloudmqtt.com', options4);
//console.log(client);
client4.on('connect', function() { // When connected
    
  console.log('connectedsignal4');
    // subscribe to a topic
client4.subscribe('signal4', function() {
// when a message arrives, do something with it
client4.on('message', function(topic, message, packet) {
var mymsg4=(message);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/abcz";
MongoClient.connect(url, function(err, db) {
if (err) throw err;
var myobj = {name: mymsg4.toString()};
console.log("THIS IS 4STH MSG"+""+""+mymsg4.toString());
db.collection("data3").insertOne(myobj, function(err, res) {
if (err) throw err;
console.log("1 record inserted(s4)");
db.close();


});
});

});
});
});



});


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register' });
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });

});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}








module.exports = router;