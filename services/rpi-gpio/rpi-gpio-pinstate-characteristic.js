var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var UUIDConstants = require('./rpi-gpio-uuid-constants');


function GPIOPinStateCharacteristic(gpio) {
    this.gpio = gpio;
    GPIOPinStateCharacteristic.super_.call(this, {
        uuid: UUIDConstants.RPI_GPIO_PINCHANGE_CHARACTERISTIC_UUID,
        properties: ['read', 'write', 'notify'],
        value: new Buffer(0),
        descriptors: [
            new BlenoDescriptor({
                uuid: UUIDConstants.RPI_GPIO_PINCHANGE_CHARACTERISTIC_DESCRIPTION_UUID,
                value: 'GPIO pin update'
            })
        ]
    });
}

util.inherits(GPIOPinStateCharacteristic, BlenoCharacteristic);


GPIOPinStateCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('GPIOPinStateCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

    callback(this.RESULT_SUCCESS, this._value);
};

GPIOPinStateCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    this._value = data;

    console.log('GPIOPinStateCharacteristic - onWriteRequest: len = ' + data.length + ' value = ' + this._value.toString('hex') );

    if (data.length<5) {
        console.log("Not enough data");
        return;
    }

    if (this._value[2] == 0x02) {
        this.gpio.setPinState(this._value[3], this._value[4]);
    }

    if (this._updateValueCallback) {
        console.log('GPIOPinStateCharacteristic - onWriteRequest: notifying');

        this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
};

GPIOPinStateCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('GPIOPinStateCharacteristic - onSubscribe');

    this._updateValueCallback = updateValueCallback;
};

GPIOPinStateCharacteristic.prototype.onUnsubscribe = function() {
    console.log('GPIOPinStateCharacteristic - onUnsubscribe');

    this._updateValueCallback = null;
};



module.exports = GPIOPinStateCharacteristic;
