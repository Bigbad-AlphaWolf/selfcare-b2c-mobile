var exec = require('cordova/exec');

var dimelo = {
    initDimelo: function() {
        cordova.exec(() => {}, () => {},'DimeloCordovaPlugin', '')
    }
}

module.exports = dimelo;