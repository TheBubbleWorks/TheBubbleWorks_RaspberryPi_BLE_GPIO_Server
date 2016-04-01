var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
//var BlenoDescriptor = bleno.Descriptor;

var UUIDConstants = require('./uart-uuid-constants');


function UARTRXCharacteristic() {
    UARTRXCharacteristic.super_.call(this, {
        uuid: UUIDConstants.UART_CHAR_RX_UUID,
        properties: ['read', 'notify'],
        value: new Buffer(0),
        /*descriptors: [
            new BlenoDescriptor({
                uuid: UUIDConstants.RPI_GPIO_PINCHANGE_CHARACTERISTIC_DESCRIPTION_UUID,
                value: 'GPIO pin update'
            })
        ]*/
    });
}

util.inherits(UARTRXCharacteristic, BlenoCharacteristic);


UARTRXCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('UARTRXCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

    callback(this.RESULT_SUCCESS, this._value);
};


UARTRXCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('UARTRXCharacteristic - onSubscribe');

    this._updateValueCallback = updateValueCallback;
};

UARTRXCharacteristic.prototype.onUnsubscribe = function() {
    console.log('UARTRXCharacteristic - onUnsubscribe');

    this._updateValueCallback = null;
};

UARTRXCharacteristic.prototype.updateValue = function(value) {
    if (this._updateValueCallback)
        this._updateValueCallback(value);
}

module.exports = UARTRXCharacteristic;
