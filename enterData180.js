var express = require("express");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/TrafficLights";
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//MQTT Connection
//Needs PAHO, that will be included in the main file
/*var client;

var connected = false;

//MQTT Server Information
var mqttHost = 'm12.cloudmqtt.com';
var topic = 'TrafficLights';
client = new Paho.MQTT.Client("m12.cloudmqtt.com", 36479, "web_" + parseInt(Math.random()));
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

//Options used to connect
// connect the client
var options = {
    useSSL: true,
    userName: "sxdzesyk",
    password: "dc_pY7Q7gOTw",
    onSuccess:onConnect
}*/



//Headers set here:
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    //Making sure response is sent as JSON
    res.setHeader("Content-Type", "text/html");
    

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.post("/populateMap", function(request, response)
{
    var stringified;
   
   MongoClient.connect(url, function(err, db){
       db.collection('TrafficTable').find({}, {'location': true, '_id': false, 'status': true, 'sno': true}).toArray(function(err, doc){
           stringified = JSON.stringify(doc);
           console.log(doc);
           response.send(stringified);
       });
       });
   });

var server = app.listen(80, "0.0.0.0", function()
{
    var host = server.address().address;
    var port = server.address().port;

    console.log("Running at " + host + ":" + port);
})


app.use(express.static(path.join("", 'public')));

// Where I should receive data from JS written in index.html
app.post('/svPositions', function(req, res) {


    var place = req.body.placeId;
    var ad = req.body.address;
    var s = req.body.sno;
    var d = req.body.dsc;
    var loc = req.body.location;
    var stat = req.body.status;

    var doc = {_id: s, placeId: place, address: ad, sno: s, dsc: d, location: loc, status: stat};

    MongoClient.connect(url, function(err, db)
    {
        if(err)
        {
            window.alert("An error has occurred. It may be possible that the serial number you are trying to enter already exists" +
                " within our database");
        }

        db.collection('TrafficTable').update(
            doc,
            doc,
            {
                upsert: true
            }
        )
    });
});

app.post('/checkMap', function(req, response) {

    var data = "{\"lat\" : "+req.body.lat + ", \"lng\" : "+req.body.lng+"}";

    MongoClient.connect(url, function (err, db) {
        db.collection('TrafficTable').find({"location": {"lat" : req.body.lat, "lng": req.body.lng}}).toArray(function (err, doc) {
            response.send(doc);
        });
    });
});

app.post('/remove', function(request, response){
   var data = {lat: request.body.lat, lng: request.body.lng};
   console.log("Data Received for removal:");
   console.log(data);

   MongoClient.connect(url, function(err, db){
       db.collection('TrafficTable').remove({"location": {"lat": request.body.lat, "lng": request.body.lng}});
   })
});

app.post('/changeStatus', function(request, response){
    var data = request.body.serial;
    var stat = request.body.stat;
    console.log("Serial number received: " + request.body.serial);
    console.log("Changing status to: " + stat);

    MongoClient.connect(url, function(err, db){
        db.collection("TrafficTable").update({"sno": data},{$set: {"status": stat}});
    });

    response.send("Made changes");
})

//--------------------------------MQTT Connection(FORMERLY changeStatus.js)---------------------------------

// connect the client
/*client.connect(options);

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    connected = true;
    console.log("onConnect");
    var message = new Paho.MQTT.Message("Connected");
    message.destinationName = 'TrafficLights';
    client.subscribe(topic);
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        /*connected = false;
         console.log("Trying to reconnect");
         client.connect(options);*/
//    }
//}

//------------------------------------------------------------END OF MQTT Connection--------------------------------------------

// called when a message arrives
// whenever status is changed, it will trigger this event
/*function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);

    var serial = message.payloadString.substring(5, message.payloadString.indexOf("status") - 1);
    var stat = message.payloadString.substring(message.payloadString.indexOf("status") + 8);

    console.log("Serial = " + serial);
    console.log("Status = " + stat);

    //markerPositions is defined in index.html as well as addNew.html
    for(var i = 0; i < markerPositions.length; i++)
    {
        if(markerPositions[i].sno == serial) {
            markerPositions[i].marker.setLabel('' + stat);
        }
    }

    //change status of markerPositions[i] in back-end
    var sendData = {serial: serial, stat: stat};


    var request = new XMLHttpRequest();
    request.open('POST', 'http://139.59.43.69/changeStatus', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(sendData));
}
*/