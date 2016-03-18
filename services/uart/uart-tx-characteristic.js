var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
//var BlenoDescriptor = bleno.Descriptor;

var UUIDConstants = require('./uart-uuid-constants');


function UARTTXCharacteristic(onDataCallback) {
    this.onDataCallback = onDataCallback
    UARTTXCharacteristic.super_.call(this, {
        uuid: UUIDConstants.UART_CHAR_TX_UUID,
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

util.inherits(UARTTXCharacteristic, BlenoCharacteristic);


UARTTXCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    this._value = data;

    console.log('UARTTXCharacteristic - onWriteRequest: len = ' + data.length + ' value = ' + this._value.toString('hex') );

    if (this.onDataCallback(data, offset, withoutResponse, callback)) {
        callback(this.RESULT_SUCCESS);
    } else {
        callback(this.RESULT_UNLIKELY_ERROR);
    }

};




module.exports = UARTTXCharacteristic;
