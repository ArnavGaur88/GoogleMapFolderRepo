var express = require("express");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/TrafficLights";
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

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