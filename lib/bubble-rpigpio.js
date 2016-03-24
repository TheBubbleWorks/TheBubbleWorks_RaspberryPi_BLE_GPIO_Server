
var Gpio = require('onoff').Gpio;
var piblaster = require('pi-blaster.js');


function BBL_GPIO(Gpio) {
}

BBL_GPIO.prototype.setPinState = function( pinNum, state) {
    console.log("Set pin state pin = " + pinNum + " State = " + state);
    // TODO: this should be cached (memoized) and then cleaned up on exit.
    var pin = new Gpio(pinNum, 'out');
    pin.writeSync(state);  // Turn LED off.
    //pin.unexport();    // Unexport GPIO and free resources
}

BBL_GPIO.prototype.setPinPWM = function( pinNum, duty) {
    duty = duty/100
    console.log("Set pin PWM duty pin = " + pinNum + " Duty = " + duty);

    piblaster.setPwm(pinNum, duty);
}



module.exports = BBL_GPIO;
