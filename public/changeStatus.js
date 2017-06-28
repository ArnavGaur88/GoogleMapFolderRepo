

//Needs PAHO, that will be included in the main file
var client;

var connected = false;

var mqttHost = 'm12.cloudmqtt.com';
var topic = 'TrafficLights';
client = new Paho.MQTT.Client("m12.cloudmqtt.com", 36479, "web_" + parseInt(Math.random()));
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
var options = {
    useSSL: true,
    userName: "sxdzesyk",
    password: "dc_pY7Q7gOTw",
    onSuccess:onConnect
}

// connect the client
client.connect(options);

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    connected = true;
    console.log("onConnect");
    var message = new Paho.MQTT.Message("Subscribed to topic");
    message.destinationName = 'TrafficLights';
    client.subscribe(topic);
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// called when a message arrives
// whenever status is changed, it will trigger this event
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);

    var serial = message.payloadString.substring(5, message.payloadString.indexOf("status") - 1);
    var stat = message.payloadString.substring(message.payloadString.indexOf("status") + 8);

    console.log("Serial = " + serial);
    console.log("Status = " + stat);

    //markerPositions is defined in index.html as well as addNew.html
    for(var i = 0; i < markerPositions.length; i++)
    {
        if(markerPositions[i].sno == serial) {
            console.log("Found you!");
            markerPositions[i].marker.setLabel('' + stat);
        }

        console.log(markerPositions[i].sno);
    }

    //change status of markerPositions[i] in back-end
    var sendData = {serial: serial, stat: stat};


    var request = new XMLHttpRequest();
    request.open('POST', 'http://139.59.43.69/changeStatus', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(sendData));

}
