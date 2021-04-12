//NAMESPACE
var FollowAnalytics = {} ;

FollowAnalytics.Gender = {
REMOVE: 0,
MALE: 1,
FEMALE: 2,
OTHER: 3
};
//VARIABLE

(function () {
 
 FollowAnalytics.UserAttributes = {};
 FollowAnalytics.CurrentCampaign = {};
 FollowAnalytics.InApp = {};
 FollowAnalytics.Push = {};
 FollowAnalytics.Badge = {};
 
 //PRIVATE
 function callSync(method, args){
 var params = { "data": args };
 return prompt("FollowAnalytics." + method, JSON.stringify(params));
 }
 
 //EVENT
 
 FollowAnalytics.logEvent = function(name,details) {
 window.webkit.messageHandlers.logEvent.postMessage({name: name, details: details});
 };
 
 FollowAnalytics.logError = function(name,details) {
 window.webkit.messageHandlers.logError.postMessage({name: name, details: details});
 };
 
 FollowAnalytics.CurrentCampaign.logAction = function(name) {
 window.webkit.messageHandlers.logAction.postMessage({name: name});
 };
 
 
 FollowAnalytics.getDeviceId = function() {
 return callSync("getDeviceId");
 };
 
 //Location

 FollowAnalytics.logLocation = function(latitude,longitude) {
 window.webkit.messageHandlers.logLocation.postMessage({latitude: latitude, longitude: longitude});
 };

 //ANALYTICS

 FollowAnalytics.getOptInAnalytics = function() {
 return callSync("getOptInAnalytics");
 };

 FollowAnalytics.setOptInAnalytics = function(value) {
 window.webkit.messageHandlers.setOptInAnalytics.postMessage(value);
 };
 
 //USER
 
 FollowAnalytics.getUserId = function() {
 return callSync("getUserId","")
 };
 
 FollowAnalytics.getSDKVersion = function() {
 return callSync("getSDKVersion");
 };
 
 FollowAnalytics.getSDKPlatform = function() {
 return callSync("getSDKPlatform");
 };
 
 FollowAnalytics.setUserId = function(name) {
 window.webkit.messageHandlers.setUserId.postMessage(name);
 };
 
 //USER ATTRIBUTES
 
 FollowAnalytics.UserAttributes.setFirstName = function(name) {
 window.webkit.messageHandlers.setFirstName.postMessage(name);
 };
 
 FollowAnalytics.UserAttributes.setLastName = function(name) {
 window.webkit.messageHandlers.setLastName.postMessage(name);
 };
 
 FollowAnalytics.UserAttributes.setEmail = function(email) {
 window.webkit.messageHandlers.setEmail.postMessage(email);
 };
 
 FollowAnalytics.UserAttributes.setDateOfBirth = function(birthDate) {
 window.webkit.messageHandlers.setDateOfBirth.postMessage(birthDate);
 };
 
 FollowAnalytics.UserAttributes.setGender = function(gender) {
 window.webkit.messageHandlers.setGender.postMessage(gender);
 };
 
 FollowAnalytics.UserAttributes.setCountry = function(country) {
 window.webkit.messageHandlers.setCountry.postMessage(country);
 };
 
 FollowAnalytics.UserAttributes.setCity = function(city) {
 window.webkit.messageHandlers.setCity.postMessage(city);
 };
 
 FollowAnalytics.UserAttributes.setRegion = function(region) {
 window.webkit.messageHandlers.setRegion.postMessage(region);
 };
 
 FollowAnalytics.UserAttributes.setProfilePictureUrl = function(url) {
 window.webkit.messageHandlers.setProfilePictureUrl.postMessage(url);
 };
 
 FollowAnalytics.UserAttributes.setNumber = function(key, value) {
 window.webkit.messageHandlers.setNumber.postMessage({key: key, value: value});
 };
 
 FollowAnalytics.UserAttributes.setString = function(key, value) {
 window.webkit.messageHandlers.setString.postMessage({key: key, value: value});
 };
 
 FollowAnalytics.UserAttributes.setBoolean = function(key, value) {
 window.webkit.messageHandlers.setBoolean.postMessage({key: key, value: value});
 };
 
 FollowAnalytics.UserAttributes.setDate = function(key, value) {
 window.webkit.messageHandlers.setDate.postMessage({key: key, value: value});
 };
 
 FollowAnalytics.UserAttributes.setDateTime = function(key, value) {
 window.webkit.messageHandlers.setDateTime.postMessage({key: key, value: value});
 };
 
 FollowAnalytics.UserAttributes.clear = function(key) {
 window.webkit.messageHandlers.clear.postMessage(key);
 };
 
 FollowAnalytics.UserAttributes.addToSet = function(key, set) {
 window.webkit.messageHandlers.addToSet.postMessage({value: set, key: key});
 };
 
 FollowAnalytics.UserAttributes.removeFromSet = function(key, set) {
 window.webkit.messageHandlers.removeFromSet.postMessage({value: set, key: key});
 };
 
 FollowAnalytics.UserAttributes.clearSet = function(key) {
 window.webkit.messageHandlers.clearSet.postMessage(key);
 };
 
 //INBOX
 FollowAnalytics.InApp.get = function(identifier){
 return JSON.parse(callSync("getInApp", identifier));
 };
 
 FollowAnalytics.InApp.getAll = function(){
 return JSON.parse(callSync("getAllInApp"));
 };
 
 FollowAnalytics.InApp.markAsRead = function(identifiers) {
 window.webkit.messageHandlers.markAsReadInApp.postMessage(identifiers);
 };
 
 FollowAnalytics.InApp.markAsUnread = function(identifiers) {
 window.webkit.messageHandlers.markAsUnreadInApp.postMessage(identifiers);
 };
 
 FollowAnalytics.InApp.delete = function(identifiers) {
 window.webkit.messageHandlers.deleteInApp.postMessage(identifiers);
 };
 
 FollowAnalytics.Push.get = function(identifier){
 return JSON.parse(callSync("getPush",identifier));
 };
 
 FollowAnalytics.Push.getAll = function(){
 return JSON.parse(callSync("getAllPush"));
 };
 
 FollowAnalytics.Push.markAsRead = function(identifiers) {
 window.webkit.messageHandlers.markAsReadPush.postMessage(identifiers);
 };
 
 FollowAnalytics.Push.markAsUnread = function(identifiers) {
 window.webkit.messageHandlers.markAsUnreadPush.postMessage(identifiers);
 };
 
 FollowAnalytics.Push.delete = function(identifiers) {
 window.webkit.messageHandlers.deletePush.postMessage(identifiers);
 };
 
 //CONTROL
 
 FollowAnalytics.CurrentCampaign.close = function() {
 window.webkit.messageHandlers.close.postMessage("close");
 };
 
 FollowAnalytics.close = function() {
 window.webkit.messageHandlers.close.postMessage("close");
 };
 
 FollowAnalytics.deepLinking = function(key,value) {
 window.webkit.messageHandlers.deepLinking.postMessage({key: key, value: value});
 };
 
 //BADGE
 
 FollowAnalytics.Badge.set = function(badgeNumber) {
 window.webkit.messageHandlers.setBadge.postMessage(badgeNumber);
 };
 
 FollowAnalytics.Badge.updateBy = function(badgeDelta) {
 window.webkit.messageHandlers.updateByBadge.postMessage(badgeDelta);
 };
 
 
 //NOTIFICATIONS
 
 FollowAnalytics.requestNotificationAuthorization = function() {
 window.webkit.messageHandlers.requestNotificationAuthorization.postMessage("register");
 };
 
 FollowAnalytics.requestProvisionalNotificationAuthorization = function() {
 window.webkit.messageHandlers.requestProvisionalNotificationAuthorization.postMessage("register");
 };
  
  FollowAnalytics.setOptInNotifications = function(state) {
    window.webkit.messageHandlers.setOptInNotifications.postMessage(state);
  };
  
  FollowAnalytics.getOptInNotifications = function() {
    return callSync("getOptInNotifications");
  };
  
  FollowAnalytics.openNotificationSettingsEventually = function() {
    window.webkit.messageHandlers.openNotificationSettingsEventually.postMessage("register");
  };
  
  // DATA
  
  FollowAnalytics.getData = function(key) {
    return callSync("getData", key);
  };
  
  FollowAnalytics.setData = function(key, value) {
    window.webkit.messageHandlers.setData.postMessage({key: key, value: value});
  };
  
  FollowAnalytics.isRegisteredForPushNotifications = function() {
    var notificationAuthorization = FollowAnalytics.getData("notificationAuthorization");
    if (notificationAuthorization == "true") {
      return FollowAnalytics.getOptInNotifications();
    } else {
      return notificationAuthorization;
    }
  };
 
 })();
