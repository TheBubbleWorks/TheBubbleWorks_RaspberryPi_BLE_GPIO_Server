var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var UUIDConstants = require('./uart-uuid-constants');
var UARTTXCharacteristic = require('./uart-tx-characteristic');
var UARTRXCharacteristic = require('./uart-rx-characteristic');

function UARTService(onDataCallback) {
    var self = this;
    UARTService.super_.call(this, {
        uuid: UUIDConstants.UART_SERVICE_UUID,
        characteristics: [
            new UARTTXCharacteristic(onDataCallback),
            new UARTRXCharacteristic(),
        ]
    });

    //self.getTXCharacteristic
}

util.inherits(UARTService, BlenoPrimaryService);

module.exports = UARTService;
