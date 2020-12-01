//
//  FAWebView.js
//  FollowApps
//
//  Created by FollowApps on 01/07/13.
//  Copyright (c) 2013 FollowApps. All rights reserved.
//
//  Followapps JS module for UIWebView binding
//

FAReqIndex = 0;
FAIsInWebview = function() {
    return (window.FAFollowAppsInstalled !== undefined);
};

FAWrapCall = function(action, data_hash) {
    var reqName = "FADataToTransfer" + ++FAReqIndex + '_' + new Date().getTime();
    window[reqName] = JSON.stringify(data_hash);
    document.location = "fawebview://" + action + '/' + reqName;
};

FASafeParam = function(param) {
    if (param === undefined || param == null)
        return "";
    else
        return param
};

FALogEvent = function(eventName, eventDetail) {
    if (FAIsInWebview()) {
        FAWrapCall("logEvent", [FASafeParam(eventName), FASafeParam(eventDetail)]);
    }
};

FALogError = function(errorName, errorDetail) {
	if (FAIsInWebview()) {
        FAWrapCall("logError", [FASafeParam(errorName), FASafeParam(errorDetail)]);
    }
};

FARegisterForPush = function(eventName, eventDetail) {
    if (FAIsInWebview()) {
        FAWrapCall("registerForPush", null);
    }
};