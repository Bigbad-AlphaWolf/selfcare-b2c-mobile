'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@awesome-cordova-plugins/core');

var DimeloCordovaPlugin = /** @class */ (function (_super) {
    tslib.__extends(DimeloCordovaPlugin, _super);
    function DimeloCordovaPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DimeloCordovaPlugin.prototype.openChat = function (username, msisdn) { return core.cordova(this, "openChat", {}, arguments); };
    DimeloCordovaPlugin.pluginName = "DimeloCordovaPlugin";
    DimeloCordovaPlugin.plugin = "cordova.plugin.dimelo";
    DimeloCordovaPlugin.pluginRef = "dimelo";
    DimeloCordovaPlugin.repo = "";
    DimeloCordovaPlugin.install = "";
    DimeloCordovaPlugin.installVariables = [];
    DimeloCordovaPlugin.platforms = ["Android", "iOS"];
    DimeloCordovaPlugin.decorators = [
        { type: core$1.Injectable }
    ];
    return DimeloCordovaPlugin;
}(core.AwesomeCordovaNativePlugin));

exports.DimeloCordovaPlugin = DimeloCordovaPlugin;
