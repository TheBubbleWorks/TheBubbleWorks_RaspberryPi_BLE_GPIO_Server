var piblaster = require('pi-blaster.js');

LED_PIN = 23

var state=0;

var iv = setInterval(function(){
    if (state) {
        console.log("Duty 50%");
        piblaster.setPwm(LED_PIN, 0.5);
    } else {
        console.log("Duty 100%");
        piblaster.setPwm(LED_PIN, 1.0);
    }
    state = 1 - state;
}, 500);

// Stop blinking the LED and turn it off after 5 seconds.
setTimeout(function() {
    clearInterval(iv); // Stop blinking
}, 5000);

