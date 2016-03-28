DEVICE_NAME = 'CamJamEduKit3';
BEACON_URL = 'https://goo.gl/gS7y9Q'   // https://www.thebubbleworks.com/TheBubbleWorks_RaspberryPi_BLE_GPIO_Server/test/www/
TX_POWER= -4
FLIPFLOP_TIME = 2000;

WEBSOCKET_GPIO_URL = 'ws://localhost:8000'

//BEACON_URL  = 'https://192.168.1.73:9443'

process.env['BLENO_DEVICE_NAME'] = DEVICE_NAME;

// Note that you may need to require a nested version of bleno
// See https://github.com/don/node-eddystone-beacon/issues/30
// See https://github.com/don/node-eddystone-beacon/pull/31

var bleno = require('bleno');
//var bleno = require('eddystone-beacon/node_modules/bleno');
var eddystoneBeacon = require('eddystone-beacon');

var WebSocket = require('ws');
var ws = new WebSocket(WEBSOCKET_GPIO_URL);

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

function handleError(error) {
    console.log("ERROR: " + error);
}



bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        start_advertising_flipflop();
    } else {

    }
});




var BEACON_ADV_STATE= 0;
var GATT_ADV_STATE = 1;



var flipFlopIntervalTimer;
var flipFlopEnabled = true;;
var advertisingState = 0;

function start_advertising_flipflop() {

    flipFlopIntervalTimer = setInterval(function () {

        if (!flipFlopEnabled)
            return;

        try {
            advertisingState = 1 - advertisingState;


            if (advertisingState == BEACON_ADV_STATE) {
                console.log("FLIFLOP: BEACON_ADV_STATE");

                stop_service_advertising();
                start_beacon_advertising();
            } else {
                console.log("FLIFLOP: GATT_ADV_STATE");
                stop_beacon_advertising();
                start_service_advertising();
            }

        } catch(err)
        {
            console.log("ERROR: " + JSON.stringify(err));
        }
    }, FLIPFLOP_TIME);

}

function stop_advertising_flipflop() {
    if (flipFlopIntervalTimer) {
        clearInterval(flipFlopIntervalTimer);
        flipFlopIntervalTimer = undefined;
    }
}


function start_beacon_advertising() {
    console.log("start_beacon_advertising");
    var url = BEACON_URL;
    eddystoneBeacon.advertiseUrl(url, { name: DEVICE_NAME }, { txPowerLevel: TX_POWER });  //
}

function stop_beacon_advertising() {
    console.log("stop_beacon_advertising");
    eddystoneBeacon.stop();
    bleno.stopAdvertising();
    bleno.disconnect();
}

// -- Non Eddystone beacon bleno code
function start_service_advertising() {
    console.log("start_service_advertising");
    bleno.startAdvertising(DEVICE_NAME, [uartService.uuid]);
}

function stop_service_advertising() {
    console.log("stop_service_advertising");
    bleno.stopAdvertising();
    bleno.disconnect();
}

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        //if (advertisingState = GATT_ADV_STATE) {
            console.log("Advertising Services");
            bleno.setServices([
                uartService
            ]);
        //}
    }
});


/*
bleno.once('advertisingStart', function(err) {
  if (err) {
    throw err;
  }

  console.log('on -> advertisingStart');
  bleno.setServices([
      uartService
  ], handleError);
});
*/





bleno.on('accept', function(clientAddress) {
    console.log('on -> stateAccept: ' + clientAddress);
    flipFlopEnabled = false;
});

bleno.on('disconnect', function(clientAddress) {
    console.log('on -> disconnect: ' + clientAddress);
    flipFlopEnabled = true;
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

bleno.on('advertisingStop', function(error) {
    console.log('on -> advertisingStop, error?: ' + error);

});




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