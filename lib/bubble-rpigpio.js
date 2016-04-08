
var Gpio = require('onoff').Gpio;
//var piblaster = require('pi-blaster.js');  // Unable to get PWM working for required pins on Pi3


/* TODO: automatic PWM fallback to WebSocket workaround
WEBSOCKET_GPIO_URL = 'ws://localhost:8000'
var WebSocket = require('ws');
var ws = new WebSocket(WEBSOCKET_GPIO_URL);
*/


var usonic = require('r-pi-usonic');
var usonicInit = 0;



function BBL_GPIO(Gpio) {
    this.echoSensors = {};
    this.pins={};
}

// TODO: destrcutor:
// for all pins ;pin.unexport();    // Unexport GPIO and free resources
// for all echoSensors: ...

BBL_GPIO.prototype._getPin = function( pinNum, mode) {
    if (! (pinNum in this.pins)) {
        //console.log("pin not found, creating ");
        this.pins[pinNum] = new Gpio(pinNum, mode);
    }
    return this.pins[pinNum];
}


BBL_GPIO.prototype.setPinState = function( pinNum, state) {
    //console.log("Set pin state, pin = " + pinNum + " State = " + state);
    pin = this._getPin(pinNum, 'out');
    pin.writeSync(state);  // Turn LED off.
}

BBL_GPIO.prototype.readPinState = function( pinNum ) {
    //console.log("read pin state, pin = " + pinNum);
    pin = this._getPin(pinNum, 'in');
    return pin.readSync();
}


BBL_GPIO.prototype.watchPin = function( pinNum, callback) {

    var pin = new Gpio(pinNum, 'in', 'both');
    pin.watch(callback);
}

BBL_GPIO.prototype._createDistanceSensor = function (key, echoPin, triggerPin, timeout) {
    var sensor = usonic.createSensor(echoPin, triggerPin, timeout);
    this.echoSensors[key] = sensor;
    return key;
}

BBL_GPIO.prototype.createDistanceSensor = function (echoPin, triggerPin, timeout) {

    var key = echoPin + ":" + triggerPin;

    if (!usonicInit) {
        usonic.init(function (error) {
            if (error) {
                console.log("ERROR: r-pi-usonic library init error: " + error);
            } else {
                usonicInit = true;
                this._createDistanceSensor(key, echoPin, triggerPin, timeout);
            }

        }.bind(this));
    } else {
        this._createDistanceSensor(key, echoPin, triggerPin, timeout);
    }
    return key;
}

// invokes read and retutns distance in CM as float
BBL_GPIO.prototype.readDistanceSensor = function (sensorId) {
    var obj = this.echoSensors[sensorId];
    return obj();
}



/*
BBL_GPIO.prototype.setPinPWM = function( pinNum, duty) {
    console.log("Set pin PWM duty pin = " + pinNum + " Duty = " + duty);
    //duty = duty/100
    //piblaster.setPwm(pinNum, duty);

}
*/


module.exports = BBL_GPIO;
