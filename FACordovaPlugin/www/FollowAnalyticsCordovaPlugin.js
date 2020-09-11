var exec = require('cordova/exec');

var __successCallback = function (method, value) {
    console.warn('FollowAnalytics:Success :' + method + " value : " + value);
    return false;
};

var __executeCordova = function () {
    if (!window.FollowAnalytics.initialized) {
        console.error('FollowAnalytics SDK is not initialized.');
        return;
    }
    if (typeof cordova !== 'undefined') {
        var methodName = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        cordova.exec(null, function (error) {
            console.error('FollowAnalytics : ' + error);
        }, "FollowAnalyticsCordovaPlugin", methodName, args);
    } else {
        console.error('FollowAnalytics : cordova not available');
    }
    return false;
};

var __executeCordovaWithCallBack = function (successCallback, errorCallback, method, arg1, arg2) {
    if (!window.FollowAnalytics.initialized) {
        console.error('FollowAnalytics SDK is not initialized.');
        return;
    }
    if (typeof cordova !== 'undefined') {
        cordova.exec(successCallback, errorCallback, "FollowAnalyticsCordovaPlugin", method, [arg1, arg2]);
    } else {
        console.error('FollowAnalytics : cordova not available');
    }
    return false;
};

require('cordova/channel').onCordovaReady.subscribe(function () {
    if (window.cordova) {
        require('cordova/exec')(function success() {
            FollowAnalytics.initialized = true;
        }, function error(error) {
            FollowAnalytics.initialized = false;
            console.error('FollowAnalytics initialization error : ' + error);
        }, 'FollowAnalyticsCordovaPlugin', 'isSdkInitialized');
    } else {
        console.error("FollowAnalytics : couldn't find cordova object.");
    }
});

var FollowAnalytics = {
    initialized: false,
    _handlers: {
        'onPushMessageClicked': [],
        'onPushDeeplinkingClicked': [],
        'onInAppMessageClicked': []
    },

    Gender: {
        MALE: 1,
        FEMALE: 2,
        OTHER: 3
    },
    getUserId: function (callback) {
        var success = function (result) {
            callback(null, result);
        }.bind(this);
        var error = function (error) {
            callback(error);
        }.bind(this);
        __executeCordovaWithCallBack(success, error, "getUserId");
    },
    getDeviceId: function (callback) {
        var success = function (result) {
            callback(null, result);
        }.bind(this);
        var error = function (error) {
            callback(error);
        }.bind(this);
        __executeCordovaWithCallBack(success, error, "getDeviceId");
    },
    getSDKPlatform: function (callback) {
        var success = function (result) {
            callback(null, result);
        }.bind(this);
        __executeCordovaWithCallBack(success, null, "getSDKPlatform");
    },
    getSDKVersion: function (callback) {
        var success = function (result) {
            callback(null, result);
        }.bind(this);
        __executeCordovaWithCallBack(success, null, "getSDKVersion");
    },
    logEvent: function (eventName, eventDetails) {
        __executeCordova("logEvent", eventName, eventDetails);
    },
    logLocationCoordinates: function (latitude, longitude) {
        __executeCordova("logLocationCoordinates", latitude, longitude);
    },
    logLocationPosition: function (position) {
        __executeCordova("logLocationCoordinates", position.coords.latitude, position.coords.longitude);
    },
    registerForPush: function () {
        __executeCordova("registerForPush");
    },
    setUserId: function (userId) {
        __executeCordova("setUserId", userId);
    },
    unsetUserId: function (userId) {
        __executeCordova("unsetUserId");
    },
    logError: function (errorName, errorDetails) {
        __executeCordova("logError", errorName, errorDetails);
    },
    openWebView: function (url, title, closeButtonTitle) {
        if (typeof url == "string" && url.length > 0) {
            closeButtonTitle = (closeButtonTitle.length > 0) ? closeButtonTitle : null;
            __executeCordova("openWebView", url, title, closeButtonTitle);
        }
    },
    retrieveLastMessage: function (callback, senderId) {
        var success = function (result) {
            if (result) {
                var jsonValue;
                try {
                    jsonValue = JSON.parse(result);
                } catch (e) {
                    jsonValue = {};
                }
                callback(null, jsonValue);
            }
        }.bind(this);
        var error = function (error) {
            callback(error);
        }.bind(this);
        if (cordova.platformId == 'android') {
            __executeCordovaWithCallBack(success, error, "lastPushCampaignParams", [senderId]);
        } else {
            __executeCordovaWithCallBack(success, error, "lastPushCampaignParams");
        }
    },
    on: function (eventName, callback) {
        if (this._handlers.hasOwnProperty(eventName)) {
            this._handlers[eventName].push(callback);
        }
    },
    emit: function () {
        var args = Array.prototype.slice.call(arguments);
        var eventName = args.shift();
        if (!this._handlers.hasOwnProperty(eventName)) {
            return false;
        }
        var str = JSON.stringify(args);
        for (var i = 0, length = this._handlers[eventName].length; i < length; i++) {
            this._handlers[eventName][i].apply(undefined, args);
        }
        return true;
    },
    handleDeeplink: function (callback) {
        var success = function (result) {
            if (result) {
                this.emit(result.event, result);
            }
        }.bind(this);
        __executeCordovaWithCallBack(success, null, "handleDeeplink", [])
    },
    InApp: {
        pauseCampaignDisplay: function () {
            __executeCordova("pauseCampaignDisplay");
        },
        resumeCampaignDisplay: function () {
            __executeCordova("resumeCampaignDisplay");
        },
        getAll: function (callback) {
            var success = function (result) {
                callback(null, result);
            }.bind(this);
            var error = function (error) {
                callback(error);
            }.bind(this);
            __executeCordovaWithCallBack(success, error, "InAppgetAll");
        },
        get: function (id, callback) {
            var success = function (result) {
                callback(null, result);
            }.bind(this);
            var error = function (error) {
                callback(error);
            }.bind(this);
            __executeCordovaWithCallBack(success, error, "InAppget", id);
        },
        delete: function (ids) {
            __executeCordova("InAppdelete", ids);
        },
        markAsRead: function (ids) {
            __executeCordova("InAppmarkAsRead", ids);
        },
        markAsUnread: function (ids) {
            __executeCordova("InAppmarkAsUnread", ids);
        }
    },
    Push: {
        getAll: function (callback) {
            var success = function (result) {
                callback(null, result);
            }.bind(this);
            var error = function (error) {
                callback(error);
            }.bind(this);
            __executeCordovaWithCallBack(success, error, "PushgetAll");
        },
        get: function (id, callback) {
            var success = function (result) {
                callback(null, result);
            }.bind(this);
            var error = function (error) {
                callback(error);
            }.bind(this);
            __executeCordovaWithCallBack(success, error, "Pushget", id);
        },
        delete: function (ids) {
            __executeCordova("Pushdelete", ids);
        },
        markAsRead: function (ids) {
            __executeCordova("PushmarkAsRead", ids);
        },
        markAsUnread: function (ids) {
            __executeCordova("PushmarkAsUnread", ids);
        }
    },
    UserAttributes: {
        setFirstName: function (value) {
            __executeCordova("setFirstName", value);
        },
        setLastName: function (value) {
            __executeCordova("setLastName", value);
        },
        setEmail: function (value) {
            __executeCordova("setEmail", value);
        },
        setDateOfBirth: function (value) {
            __executeCordova("setDateOfBirth", value);
        },
        setGender: function (value) {
            __executeCordova("setGender", parseInt(value, 10));
        },
        setCountry: function (value) {
            __executeCordova("setCountry", value);
        },
        setCity: function (value) {
            __executeCordova("setCity", value);
        },
        setRegion: function (value) {
            __executeCordova("setRegion", value);
        },
        setProfilePictureUrl: function (value) {
            __executeCordova("setProfilePictureUrl", value);
        },
        setNumber: function (key, value) {
            __executeCordova("setNumber", key, value);
        },
        setBoolean: function (key, value) {
            __executeCordova("setBoolean", key, value);
        },
        setString: function (key, value) {
            __executeCordova("setString", key, value);
        },
        setDate: function (key, value) {
            __executeCordova("setDate", key, value);
        },
        setDateTime: function (key, value) {
            __executeCordova("setDateTime", key, value);
        },
        clear: function (key) {
            __executeCordova("clear", key);
        },
        clearSet: function (key) {
            __executeCordova("clearSet", key);
        },
        addToSet: function (key, value) {
            __executeCordova("addToSet", key, value);
        },
        removeFromSet: function (key, value) {
            __executeCordova("removeFromSet", key, value);
        }
    },
    setOptInAnalytics: function (value) {
        __executeCordova("setOptInAnalytics", value);
    },
    getOptInAnalytics: function (callback) {
        var success = function (result) {
            callback(null, result);
        }.bind(this);
        var error = function (error) {
            callback(error);
        }.bind(this);
        __executeCordovaWithCallBack(success, error, "getOptInAnalytics", []);
    },
    GDPR: {
        requestToAccessMyData: function () {
            __executeCordova("requestToAccessMyData", []);
        },
        requestToDeleteMyData: function () {
            __executeCordova("requestToDeleteMyData", []);
        }
    },
    DataWallet: {
        getPolicy: function (callback) {
            var success = function (result) {
                callback(null, result);
            }.bind(this);
            var error = function (error) {
                callback(error);
            }.bind(this);
            __executeCordovaWithCallBack(success, error, "DataWalletGetPolicy");
        },
        setIsRead: function (value) {
            __executeCordova("DataWalletSetIsRead", value);
        },
        isRead: function (callback) {
            var success = function (result) {
                callback(null, result);
            }.bind(this);
            var error = function (error) {
                callback(error);
            }.bind(this);
            __executeCordovaWithCallBack(success, error, "DataWalletIsRead");
        },
    }
};
    
module.exports = FollowAnalytics;
