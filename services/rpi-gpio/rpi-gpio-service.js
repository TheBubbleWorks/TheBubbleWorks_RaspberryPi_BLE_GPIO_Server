var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var UUIDConstants = require('./rpi-gpio-uuid-constants');
var GPIOPinStateCharacteristic = require('./rpi-gpio-pinstate-characteristic');

function GPIOService(gpio) {
  GPIOService.super_.call(this, {
    uuid: UUIDConstants.RPI_GPIO_SERVICE_UUID,
    characteristics: [
      new GPIOPinStateCharacteristic(gpio),
    ]
  });
}

util.inherits(GPIOService, BlenoPrimaryService);

module.exports = GPIOService;
