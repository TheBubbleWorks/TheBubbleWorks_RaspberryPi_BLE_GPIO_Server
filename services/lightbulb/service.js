var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var UUIDConstants = require('./uuid-constants');
var MainCharacteristic = require('./main-characteristic');

function Service(onDataCallback) {
    Service.super_.call(this, {
        uuid: UUIDConstants.SERVICE_UUID,
        characteristics: [
            new MainCharacteristic(onDataCallback),
        ]
    });

    //self.getTXCharacteristic
}

util.inherits(Service, BlenoPrimaryService);

module.exports = Service;
