var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
//var BlenoDescriptor = bleno.Descriptor;

var UUIDConstants = require('./uuid-constants');


function Characteristic(onDataCallback) {
    this.onDataCallback = onDataCallback;
    this._value="0";
    Characteristic.super_.call(this, {
        uuid: UUIDConstants.CHAR_WRITE_UUID,
        properties: ['write', 'read', 'notify'],
        value: null,
        /*descriptors: [
         new BlenoDescriptor({
         uuid: UUIDConstants.RPI_GPIO_PINCHANGE_CHARACTERISTIC_DESCRIPTION_UUID,
         value: 'GPIO pin update'
         })
         ]*/
    });
}

util.inherits(Characteristic, BlenoCharacteristic);


Characteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    this._value = data;

    console.log('onWriteRequest: len = ' + data.length + ' value = ' + this._value.toString('hex') );

    if (this.onDataCallback(data, offset, withoutResponse, callback)) {
        callback(this.RESULT_SUCCESS);
    } else {
        callback(this.RESULT_UNLIKELY_ERROR);
    }

};



Characteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('onReadRequest: value = ' + this._value.toString('hex'));

    callback(this.RESULT_SUCCESS, this._value);
};


Characteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('ReadCharacteristic - onSubscribe');

    this._updateValueCallback = updateValueCallback;
};

Characteristic.prototype.onUnsubscribe = function() {
    console.log('onUnsubscribe');

    this._updateValueCallback = null;
};

Characteristic.prototype.updateValue = function(value) {
    if (this._updateValueCallback)
        this._updateValueCallback(value);
}




module.exports = Characteristic;
