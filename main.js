


process.env['BLENO_DEVICE_NAME'] = 'BubblePi';


var bleno = require('bleno');

var GPIO = require("./lib/bubble-rpigpio.js");
var gpio = new GPIO();


//var GPIOService = require('./services/rpi-gpio/rpi-gpio-service');
//var gpioService = new GPIOService(gpio);

var UARTService = require('./services/uart/uart-service');
var uartService = new UARTService(onUARTReceiveData);



function onUARTReceiveData(data) {
    if (data.length>=5) {
        // Check if RPI GPIO command
        if (data[1] == 0x31) {
            // Check if set pin state sub-commmand
            if (data[2] == 0x02) {
                gpio.setPinState(data[3], data[4]);
            }
        }
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


