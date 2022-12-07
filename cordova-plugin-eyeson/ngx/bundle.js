'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@awesome-cordova-plugins/core');

var EyesOn = /** @class */ (function (_super) {
    tslib.__extends(EyesOn, _super);
    function EyesOn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EyesOn.prototype.initAgent = function () { return core.cordova(this, "initAgent", {}, arguments); };
    EyesOn.prototype.startAgent = function () { return core.cordova(this, "startAgent", {}, arguments); };
    EyesOn.prototype.getDqaId = function () { return core.cordova(this, "getDqaId", {}, arguments); };
    EyesOn.prototype.updateConfiguration = function () { return core.cordova(this, "updateConfiguration", {}, arguments); };
    EyesOn.prototype.getDqaStatus = function () { return core.cordova(this, "getDqaStatus", {}, arguments); };
    EyesOn.prototype.getDataCollectStatus = function () { return core.cordova(this, "getDataCollectStatus", {}, arguments); };
    EyesOn.prototype.onPermissionChanged = function () { return core.cordova(this, "onPermissionChanged", {}, arguments); };
    EyesOn.pluginName = "EyesOn";
    EyesOn.plugin = "cordova-plugin-eyeson";
    EyesOn.pluginRef = "eyeson";
    EyesOn.repo = "http://git.tools.orange-sonatel.com/scm/~ext_diop24/eyes-on-sdk.git";
    EyesOn.install = "";
    EyesOn.installVariables = [];
    EyesOn.platforms = ["Android"];
    EyesOn.decorators = [
        { type: core$1.Injectable }
    ];
    return EyesOn;
}(core.AwesomeCordovaNativePlugin));

exports.EyesOn = EyesOn;
