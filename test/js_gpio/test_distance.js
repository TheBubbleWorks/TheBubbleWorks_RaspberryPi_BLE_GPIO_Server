var usonic = require('r-pi-usonic');

function handleError(error) {
    if (error)
        console.log("ERROR: " + error);
}

usonic.init(function (error) {
    if (error) {
        handleError(error)
    } else {
        var sensor = usonic.createSensor(18, 17, 1000);
        setTimeout(function () {
            console.log('Distance: ' + sensor().toFixed(2) + ' cm');
        }, 60);
    }
});



