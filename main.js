process.env['BLENO_DEVICE_NAME'] = 'BubblePi';

// Note that you may need to require a nested version of bleno
// See https://github.com/don/node-eddystone-beacon/issues/30
// See https://github.com/don/node-eddystone-beacon/pull/31

var bleno = require('bleno');
//var bleno = require('eddystone-beacon/node_modules/bleno');
var eddystoneBeacon = require('eddystone-beacon');

//var WebSocket = require('ws');
//var ws = new WebSocket('ws://localhost:8000');

var UARTService = require('./services/uart/uart-service');
var uartService = new UARTService(onUARTReceiveData);


function onUARTReceiveData(data) {
    // We need at least 2 bytes (magic + function code)
    if (data.length<2)
        return;

    // Validate 'magic'
    if (data[0] != 0x00)
        return;

    if (funcCode == 0x04) {
        // We need at least 4 bytes (magic + function code + speed A + speed B)
        if (data.length<4)
            return;
        //var int8Arr = new Int8Array(data);
        var speedA = data[2];
        var speedB = data[3];
        var jsonString = JSON.stringify({MotorASpeed:speedA-100, MotorBSpeed:speedB-100});
        console.log("Sending: " + jsonString);
        ws.send(jsonString);
    }

    return true;
}


bleno.once('advertisingStart', function(err) {
  if (err) {
    throw err;
  }

  console.log('on -> advertisingStart');
  bleno.setServices([
      uartService
  ]);
});

eddystoneBeacon.advertiseUrl('https://goo.gl/BlLKHs');




// -- Non Eddystone beacon bleno code


/*
bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('BubbleWorks', [uartService.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices([
            //gpioService,
            uartService
        ]);
    }
});


bleno.on('accept', function(clientAddress) {
    console.log('on -> stateAccept: ' + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
    console.log('on -> disconnect: ' + clientAddress);
});

bleno.on('rssiUpdate', function(rssi) {
    console.log('on -> rssiUpdate: ' + rssi);
});

bleno.on('servicesSet', function(error) {
    console.log('on -> servicesSet, error?: ' +  error);
});

bleno.on('servicesSetError', function(error) {
    console.log('on -> servicesSetError, error: ' + error);
});


bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart, error?: ' + error);

});

bleno.on('advertisingStartError', function(error) {
    console.log('on -> advertisingStartError, error: ' + error);
});

*/


// -- Generic GPIO serve

/*

var GPIO = require("./lib/bubble-rpigpio.js");
var gpio = new GPIO();

var GPIOService = require('./services/rpi-gpio/rpi-gpio-service');
var gpioService = new GPIOService(gpio);


function onUARTReceiveData(data) {

// ...
    // Check if RPI GPIO command
    var funcCode = data[1]
    if (funcCode == 0x31) {
        // Check if set pin state sub-commmand
        if (data[2] == 0x02) {
            //gpio.setPinState(data[3], data[4]);
        }
    }

// ...
}
 */