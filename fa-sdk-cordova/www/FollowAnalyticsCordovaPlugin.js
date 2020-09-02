var exec = require('cordova/exec');

var __successCallback = function (method, value) {
    console.warn('FollowAnalytics:Success :' + method + " value : " + value);
    return false;
};

var __executeCordova = function () {
    if (!window.FollowAnalytics.initialized) {
        console.warn('FollowAnalytics SDK not initialized properly.');
        return;
    }
    if (typeof cordova !== 'undefined') {
        var methodName = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        cordova.exec(null, function (error) {
            console.log('Error: ' + error.toString());
        }, "FollowAnalyticsCordovaPlugin", methodName, args);
    } else {
        console.warn('FollowAnalytics:Error: (cordova not available)');
    }
    return false;
};

var __executeCordovaWithCallBack = function (callback, method, arg1, arg2) {
    if (!window.FollowAnalytics.initialized) {
        console.warn('FollowAnalytics SDK not initialized properly.');
        return;
    }
    cordova.exec(callback, null, "FollowAnalyticsCordovaPlugin", method, [arg1, arg2]);
    return false;
};

require('cordova/channel').onCordovaReady.subscribe(function () {
    if (window.cordova) {
        const platformOS = window.cordova.platformId;
        if (platformOS === "android") {
            require('cordova/exec')(function success() {
                FollowAnalytics.initialized = true;
            }, function error(message) {
                FollowAnalytics.initialized = false;
                console.log(message);
            }, 'FollowAnalyticsCordovaPlugin', 'isSdkInitialized', undefined);
        }
        console.log("[FA] Platform : " + platformOS);
    } else {
        console.log("[FA] Couldn't find cordova object.");
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
    initialize: function (faid, debug_mode) {
        const platformOS = window.cordova.platformId;
        if (platformOS === "ios") {
            this.initialized = true;
            __executeCordova("initialize", faid, debug_mode);
        }
    },
    getUserId: function (callback) {
        var success = function (result) {
            callback(result);
        }.bind(this);
        __executeCordovaWithCallBack(success, "getUserId");
    },
    getDeviceId: function (callback) {
        var success = function (result) {
            callback(result);
        }.bind(this);
        __executeCordovaWithCallBack(success, "getDeviceId");
    },
    logEvent: function (eventName, eventDetails) {
        __executeCordova("logEvent", eventName, eventDetails);
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
    setMaximumBackgroundWithinSession: function (duration) {
        const platformOS = window.cordova.platformId;
        if (platformOS === "ios") {
            __executeCordova("setMaximumBackgroundWithinSession", duration);
        }
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
                callback(jsonValue);
            }
        }.bind(this);
        if (cordova.platformId == 'android') {
            __executeCordovaWithCallBack(success, "lastPushCampaignParams", [senderId]);
        } else {
            __executeCordovaWithCallBack(success, "lastPushCampaignParams");
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
        __executeCordovaWithCallBack(success, "handleDeeplink", [])
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
                callback(result);
            }.bind(this);
            __executeCordovaWithCallBack(success, "InAppgetAll");
        },
        get: function (id, callback) {
            var success = function (result) {
                callback(result);
            }.bind(this);
            __executeCordovaWithCallBack(success, "InAppget", id);
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
                callback(result);
            }.bind(this);
            __executeCordovaWithCallBack(success, "PushgetAll");
        },
        get: function (id, callback) {
            var success = function (result) {
                callback(result);
            }.bind(this);
            __executeCordovaWithCallBack(success, "Pushget", id);
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
    Android: {
        getSenderId: function (callback) {
            if (cordova.platformId != 'android') {
                return;
            }
            var success = function (result) {
                callback(result);
            }.bind(this);
            __executeCordovaWithCallBack(success, "getSenderId", []);
        },
        getGcmToken: function (callback) {
            if (cordova.platformId != 'android') {
                return;
            }
            var success = function (result) {
                callback(result);
            }.bind(this);
            __executeCordovaWithCallBack(success, "getGcmToken", []);
        },
        setPushNotificationsEnabled: function (enabled) {
            if (cordova.platformId != 'android') {
                return;
            }
            __executeCordova("setPushNotificationsEnabled", enabled);
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
            callback(result);
        }.bind(this);
        __executeCordovaWithCallBack(success, "getOptInAnalytics", []);
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
                callback(result);
            }.bind(this);
            __executeCordovaWithCallBack(success, "DataWalletGetPolicy");
        },
        setIsRead: function (value) {
            __executeCordova("DataWalletSetIsRead", value);
        },
        isRead: function (callback) {
            var success = function (result) {
                callback(result);
            }.bind(this);
            __executeCordovaWithCallBack(success, "DataWalletIsRead");
        },
    }
};

module.exports = FollowAnalytics;
