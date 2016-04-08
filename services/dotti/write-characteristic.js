var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
//var BlenoDescriptor = bleno.Descriptor;

var UUIDConstants = require('./uuid-constants');


function WriteCharacteristic(onDataCallback) {
    this.onDataCallback = onDataCallback
    WriteCharacteristic.super_.call(this, {
        uuid: UUIDConstants.CHAR_WRITE_UUID,
        properties: ['write'],
        value: null,
        /*descriptors: [
         new BlenoDescriptor({
         uuid: UUIDConstants.RPI_GPIO_PINCHANGE_CHARACTERISTIC_DESCRIPTION_UUID,
         value: 'GPIO pin update'
         })
         ]*/
    });
}

util.inherits(WriteCharacteristic, BlenoCharacteristic);


WriteCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    this._value = data;

    console.log('Dotti - onWriteRequest: len = ' + data.length + ' value = ' + this._value.toString('hex') );

    if (this.onDataCallback(data, offset, withoutResponse, callback)) {
        callback(this.RESULT_SUCCESS);
    } else {
        callback(this.RESULT_UNLIKELY_ERROR);
    }

};




module.exports = WriteCharacteristic;
