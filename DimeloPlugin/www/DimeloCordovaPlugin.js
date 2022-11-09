var exec = require('cordova/exec');
var PLUGIN_NAME = 'DimeloCordovaPlugin';

var dimelo = {
  openChat: function (username, msisdn, cb, er) {
    exec(cb, er, PLUGIN_NAME, 'openChat', [username, msisdn]);
  },
};

module.exports = dimelo;
