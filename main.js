process.env['BLENO_DEVICE_NAME'] = 'BubblePi';


var bleno = require('bleno');

//var GPIO = require("./lib/bubble-rpigpio.js");
//var gpio = new GPIO();

//var GPIOService = require('./services/rpi-gpio/rpi-gpio-service');
//var gpioService = new GPIOService(gpio);


var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8000');


var UARTService = require('./services/uart/uart-service');
var uartService = new UARTService(onUARTReceiveData);


function onUARTReceiveData(data) {
    // We need at least 2 bytes (magic + function code)
    if (data.length<2)
        return;

    // Validate 'magic'
    if (data[0] != 0x00)
        return;

    // Check if RPI GPIO command
    var funcCode = data[1]
    if (funcCode == 0x31) {
        // Check if set pin state sub-commmand
        if (data[2] == 0x02) {
            //gpio.setPinState(data[3], data[4]);
        }
    }

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


