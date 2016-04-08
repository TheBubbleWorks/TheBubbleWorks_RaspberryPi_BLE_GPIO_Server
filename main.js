// ---------------------------------------------------------------------------------------------------------
// Hardware Config

// This is a bit too specifc at the moment...  will be refactored out.
LINE_SENSOR_PIN     = 25;

SONAR_TRIGGER_PIN   = 17;
SONAR_ECHO_PIN      = 18;
SONAR_TIMEOUT       = 1000; // ms


// ---------------------------------------------------------------------------------------------------------

DEVICE_NAME = 'CamJamEduKit3';
TX_POWER= -25

BEACON_URL   = 'https://goo.gl/uYVEZh'   // https://www.thebubbleworks.com/TheBubbleWorks_WebBluetooth_CamJamEduKitDemo/

//BEACON_URL = 'https://goo.gl/gS7y9Q'   // https://www.thebubbleworks.com/TheBubbleWorks_RaspberryPi_BLE_GPIO_Server/test/www/
//BEACON_URL  = 'https://192.168.1.73:9443'

FLIPFLOP_TIME = 5000;


// ---------------------------------------------------------------------------------------------------------

// GPIO fallback support service (Python based PWM control behind a WebSocket)
WEBSOCKET_GPIO_URL = 'ws://localhost:8000'


LOG_LEVEL = 'info';

// ---------------------------------------------------------------------------------------------------------

process.env['BLENO_DEVICE_NAME'] = DEVICE_NAME;


var log = require('winston');
log.level = LOG_LEVEL;
log.info("Starting...");

var bleno = require('bleno');
var eddystoneBeacon = require('eddystone-beacon');

var WebSocket = require('ws');

var UARTService = require('./services/uart/uart-service');
var uartService = new UARTService(onUARTReceiveData);
var rxChar =uartService.characteristics[1]; // TODO: find this, not assume

var GPIO = require("./lib/bubble-rpigpio.js");
var gpio = new GPIO();


// PWM fallback
var ws = undefined;
try {
    ws = new WebSocket(WEBSOCKET_GPIO_URL);
} catch (error) {
    handleError("ERROR: WebSocket could not be created, " + error );
}


// ---------------------------------------------------------------------------------------------------------
// Robot GPIO stuff...

var isOnLine = false;
var distance = 0;

function lineSensorUpdate(err, value) {
    if (err) {
        throw err;
    }
    debug('LineDector sensor value was ' + value);

    try {
        isOnLine = value;
    } catch  (error) {
        handleError(error);
    }
}



gpio.watchPin(LINE_SENSOR_PIN, lineSensorUpdate);
isOnLine = gpio.readPinState(LINE_SENSOR_PIN)
var distanceSensor = gpio.createDistanceSensor(SONAR_ECHO_PIN, SONAR_TRIGGER_PIN, SONAR_TIMEOUT);

var sensorReadingInterval = setInterval(function(){
    distance = gpio.readDistanceSensor(distanceSensor).toFixed(0);  // TODO: change this to distanceSensor.read();
    info('Distance = ' + distance +" , isOnLine = " + isOnLine);

    if (flipFlopEnabled)
        return;
    sendSensorUpdate([distance, isOnLine])
}, 1000);



// ---------------------------------------------------------------------------------------------------------
// Bluetooth

function sendSensorUpdate(values) {

    rxChar.updateValue(new Buffer([0x00, 0x81, (values[0]) & 0xFF, values[1] & 0xFF]));
}


bleno.on('disconnect', function(clientAddress) {
    info('TODO: stop motors!!!');
});



function onUARTReceiveData(data) {
    debug("RECV: " + data);
    // We need at least 2 bytes (magic + function code)
    if (data.length<2)
        return true;

    // Validate 'magic'
    if (data[0] != 0x00)
        return true;

    var funcCode = data[1];

    if (funcCode == 0x31)
    {
        if (data.length<5) {
            handleError("Not enough data");
            return true;
        }
        // Check if set pin state sub-commmand
        if (data[2] == 0x02) {
            gpio.setPinState(data[3], data[4]);
        }
    }
    else if (funcCode == 0x01)      // 'common' joystic service   (e.g. Vortex / MicroBorg demos)
    {
        if (data.length<6) {
            handleError("Not enough data");
            return true;
        }
        var x = (data[2] + (data[3] << 8))-255;
        var y = ((data[4] + (data[5] << 8))-255);
        var speedA =  -Math.floor(x * (100/255));
        var speedB =  Math.floor(y * (100/255));

        var jsonString = JSON.stringify({MotorASpeed:speedA, MotorBSpeed:speedB});
        debug("Sending: " + jsonString);

        if (ws)
            ws.send(jsonString);
    }
    else if (funcCode == 0x04)
    {
        // We need at least 4 bytes (magic + function code + speed A + speed B)
        if (data.length<4) {
            handleError("Not enough data");
            return true;
        }
        //var int8Arr = new Int8Array(data);
        var speedA = data[2];
        var speedB = data[3];
        var jsonString = JSON.stringify({MotorASpeed:speedA-100, MotorBSpeed:speedB-100});
        info("Sending: " + jsonString);
        if (ws)
            ws.send(jsonString);
    }

    return true;
}


// ---------------------------------------------------------------------------------------------------------
// Eddystone / GATT FLip flop

var BEACON_ADV_STATE= 0;
var GATT_ADV_STATE = 1;

var flipFlopIntervalTimer;
var flipFlopEnabled = true;;
var advertisingState = 0;


function info(str) {
    log.log('info', str);
}

function debug(str) {
    log.log('debug', str);
}
function handleError(error) {
    log.log('error', error);
}


bleno.on('stateChange', function(state) {
    debug('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        start_advertising_flipflop();
    } else {

    }
});



function start_advertising_flipflop() {

    flipFlopIntervalTimer = setInterval(function () {

        if (!flipFlopEnabled)
            return;

        try {
            advertisingState = 1 - advertisingState;


            if (advertisingState == BEACON_ADV_STATE) {
                info("FLIFLOP: BEACON_ADV_STATE");

                stop_service_advertising();
                start_beacon_advertising();
            } else {
                info("FLIFLOP: GATT_ADV_STATE");
                stop_beacon_advertising();
                start_service_advertising();
            }

        } catch(err)
        {
            handleError(JSON.stringify(err));
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
    debug("start_beacon_advertising");
    var url = BEACON_URL;
    eddystoneBeacon.advertiseUrl(url, { name: DEVICE_NAME }, { txPowerLevel: TX_POWER });  //
}

function stop_beacon_advertising() {
    debug("stop_beacon_advertising");
    eddystoneBeacon.stop();
    bleno.stopAdvertising();
    bleno.disconnect();
}

// -- Non Eddystone beacon bleno code
function start_service_advertising() {
    debug("start_service_advertising");
    bleno.startAdvertising(DEVICE_NAME, [uartService.uuid]);
}

function stop_service_advertising() {
    debug("stop_service_advertising");
    bleno.stopAdvertising();
    bleno.disconnect();
}

bleno.on('advertisingStart', function(error) {
    debug('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        //if (advertisingState = GATT_ADV_STATE) {
            debug("Advertising Services");
            bleno.setServices([
                uartService
            ]);
        //}
    }
});


bleno.on('accept', function(clientAddress) {
    info('onConnect from: ' + clientAddress);
    flipFlopEnabled = false;
});

bleno.on('disconnect', function(clientAddress) {
    info('onDisconnect from: ' + clientAddress);
    flipFlopEnabled = true;
});




// ---------------------------------------------------------------------------------------------------------
// Notes

/*

// -- Generic GPIO serve

/*

var GPIOService = require('./services/rpi-gpio/rpi-gpio-service');
var gpioService = new GPIOService(gpio);  // from: ./lib/bubble-rpigpio.js


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
