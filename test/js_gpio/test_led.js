var Gpio = require('onoff').Gpio,
    led = new Gpio(27, 'out');
 
var iv = setInterval(function(){
	led.writeSync(led.readSync() === 0 ? 1 : 0)
}, 500);
 
// Stop blinking the LED and turn it off after 5 seconds.
setTimeout(function() {
    clearInterval(iv); // Stop blinking
    led.writeSync(0);  // Turn LED off.
    led.unexport();    // Unexport GPIO and free resources
}, 5000);

