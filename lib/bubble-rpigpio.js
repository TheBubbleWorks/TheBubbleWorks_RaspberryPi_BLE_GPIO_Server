
var Gpio = require('onoff').Gpio;

function BBL_GPIO(Gpio) {
}

BBL_GPIO.prototype.setPinState = function( pinNum, state) {
    console.log("Set pin state pin = " + pinNum + " State = " + state);
    // TODO: this should be cached (memoized) and then cleaned up on exit.
    var pin = new Gpio(pinNum, 'out');
    pin.writeSync(state);  // Turn LED off.
    //pin.unexport();    // Unexport GPIO and free resources
}


module.exports = BBL_GPIO;
