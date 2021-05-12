sdk_version: PhoneGap v7.1

!!! note "Hybrid solutions and the FollowAnalytics SDK"
    Note that if you are working on a hybrid non-native solution, you will have to do some of the procedures on the native side of your app. This will be the case for OS specific as well as more advanced features. When this is necessary, we will provide the information for each platform. Each FollowAnalytics SDK for PhoneGap/Cordova are based on a native version of the SDK.


!!! note "Prerequisites"
    The FollowAnalytics PhoneGap/Cordova SDK was tested on :

    - Cordova CLI v9.0.1
    - Cordova platform android v8.1.0
    - Cordova platform iOS v5.0.1

## Integration

This document will cover app setup and the component installation process, as well as basic integration steps for iOS and Android.

If you want an example, check out our [PhoneGap sample integration code on Github](https://github.com/followanalytics/fa-cordova-app).


!!! note "Prerequisites and minimal setup"
    In this section, we explain how to get started with FollowAnalytics SDK for iOS. Before you start, be sure to have all the [necessary prerequisites](#integration). These include:

    * Registering the application on the Platform
    * Generating the API Key

    Here are the minimal steps for integrating the SDK in your app:

    * [Installing the SDK in your app](#installation)
    * [Initializing the SDK using your API key](#initialize-the-sdk)
    * [Registering for notifications](#register-for-notifications)

    Once the integration is finished, we highly recommend you test the setup. You will find out how to test your setup in this [section](#test-your-setup). Then, you can start [tagging events and saving attributes](#analytics) in your app.



### Installation

1. Download the FollowAnalytics SDK from the [developer portal](/sdks/downloads/).

2. Add the FollowAnalytics SDK plugin to your cordova project:

    ```SH
    cordova plugin add "/path/to/fa-sdk-phonegap-plugin/"
    ```

### Upgrading

1. Remove the old version of the plugin from your project:

    ```SH
    cordova plugin rm cordova.plugin.followanalytics
    ```

2. Download the new version of the plugin and add it to your project:

    ```SH
    cordova plugin add "/path/to/fa-sdk-phonegap-plugin/"
    ```

3. Run `cordova prepare ios` and `cordova prepare android` to apply the new plugin changes.

### Initialize the SDK

!!! note "Be sure to have your API key"
    Be sure to have your API key for this step of the configuration. You can retrieve you app's API key from the administration section of the FollowAnalytics platform (see [here](#prerequisites))


!!! danger "Add FollowAnalytics Phonegap SDK plugin"
    Be sure to add FollowAnalytics Phonegap SDK plugin in your cordova project by following the [Installation](/sdks/phonegap/documentation/#installation) tutorial. This action will create some default configuration in your cordova project that affects the initialization of FollowAnalytics Phonegap SDK.

FollowAnalytics Phonegap SDK plugin will generate, if not available yet, a `followanalytics_configuration.json` file at your root directory of your cordova project:

```
cordova_project/
  |--- config.xml
  |--- followanalytics_configuration.json // <-
  |--- hooks/
  |--- node_modules/
  |--- package-lock.json
  |--- package.json
  |--- platforms/
  |--- plugins/
  |--- www/
```

This file holds information for initializing FollowAnalytics Phonegap SDK.

You will need to change the content of this file for customising the initialization of FollowAnalytics Phonegap SDK.

For instance :

```JSON
{
  "android" :
  { 
    "debug":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : true,
      "maxBackgroundTimeWithinSession" : 120 
    },
    "release":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : false,
      "maxBackgroundTimeWithinSession" : 120 
    }
  },
  "ios" :
  { 
    "debug":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : true,
      "maxBackgroundTimeWithinSession" : 120 
    },
    "release":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : false,
      "maxBackgroundTimeWithinSession" : 120 
    }
  }
}
```

You can also add custom build variants in both platforms like this:

```JSON
  { 
    "debug":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : true,
      "maxBackgroundTimeWithinSession" : 120 
    },
    "release":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : false,
      "maxBackgroundTimeWithinSession" : 120 
    },
    "customVariant":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : true,
      "maxBackgroundTimeWithinSession" : 120 
    }
  }
```


!!! note "Use `cordova prepare <platform>`"
    Apply the changes on `followanalytics_configuration.json` running `cordova prepare android` for Android or `cordova prepare ios` for IOS.


Below, a description table that FollowAnalytics Phonegap SDK accepts as properties to add for customizing the initialization :

| Properties                       | Availability | Type      | Default Value   | Description                                                                     |
| -------------------------------- |--------------| --------- | --------------- | ------------------------------------------------------------------------------- |
| `apiKey`                         | Required     | string    |     null        | Your app api key to use our SDK                                                 |
| `isVerbose`                      | Optional     | boolean   |     false       | To see internal logs made by the SDK                                            |
| `maxBackgroundTimeWithinSession` | Optional     | number    |     120         | To determine the lifetime of a session when in background (between 15 and 3600) |
| `apiMode`                        | Optional     | string    |     PROD        | To set your API Mode to prodution or develop (PROD or DEV)                      |
| `archiveInAppMessages`           | Optional     | boolean   |     false       | `true` to archive InApp campaigns messages                                      |
| `archivePushMessages`            | Optional     | boolean   |     false       | `true` to archive Push campaigns messages                                       |
| `appGroup`                       | Optional     | string    |     undefined   | An app group identifier to link the extension target the app                    |
| `onNotificationTapped`          | Optional     | boolean   |     false       | Allows you to perform specific actions when a notification is tapped            |
| `onMessageReceived`             | Optional     | boolean   |     false       | Allows you to perform specific actions when a notification is received          |
| `onNativeInAppButtonTapped`     | Optional     | boolean   |     false       | Allows you to perform specific actions when a native alert button is tapped     |

##### Android

!!! note "Properties in android platform"
    Be sure to add any properties inside of `"android"` json object. Otherwise the properties won't be affected to the initialization of FollowAnalytics Phonegap SDK.

!!! note "Change build variant"
    The built variant will be the same as the configuration of the `app.iml`. If the file as not found, the build variant will be set to `debug`.

!!! danger "If you got an error like `Program type already present: android.support.v4...` at build"
    To fix that, use AndroidX in your project.
    To do so, go to `gradle.properties` and add this:

    ```groovy
    android.useAndroidX=true
    android.enableJetifier=true
    ```


##### iOS

!!! note "Properties in ios platform"
    Be sure to add any properties inside of `"ios"` json object. Otherwise the properties won't be affected to the initialization of FollowAnalytics Phonegap SDK.


!!! warning "Change build variant"
    To choose what build variant you want to use in IOS you need to create a new environment variable called `FA_CONFIGURATION` with value `NameOfYourBuild`. If `FA_CONFIGURATION` was not found, the plugin will try to use the properties on the `release` variant else will use the first value on the JSON.



### Register for notifications

!!! danger "Important"
    Push notifications on `debug` mode don't work. If you wish to test your notifications, which is highly recommended, switch to `release` mode.

#### Android and Firebase Cloud Messaging

!!! note "Get started with Firebase"
    Sending push notifications for Android requires Firebase Cloud Messaging, Google's standard messaging service. If you don't already use Firebase, you will need to do the following:

    * Create Firebase project to Firebase console

    Before you start adding Firebase to your project, we recommend you take the time to familiarize yourself with firebase and its console. You will find this information (and much more) by referring to the [Google documentation](https://firebase.google.com/docs/android/setup#console).

FollowAnalytics SDK supports push notifications based on [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/).

In this section we will explain to you how to use Firebase Cloud Messaging (or FCM) with FollowAnalytics SDK.

#### Register your application

Copy the FCM Server key **token** (available through Firebase Console in your project settings).

<img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/SDK/firebase-cloud-messaging-server-key.png" />

and paste it to our platform in the application's administration.

<img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/SDK/application-administration-fcm-token.png" />

#### Install Firebase Cloud Messaging

Download your [Firebase Cloud Messaging config file](https://support.google.com/firebase/answer/7015592) in your Firebase console and add it into your cordova project at your root directory:

```
cordova_project/
  |--- config.xml
  |--- followanalytics_configuration.json
  |--- google-services.json // <-
  |--- hooks/
  |--- node_modules/
  |--- package-lock.json
  |--- package.json
  |--- platforms/
  |--- plugins/
  |--- www/
```

That's it, FollowAnalytics SDK will now manage to install it into your application.

!!! warning "Verify your Google Services configuration"
    Be sure to check the configuration of Google Services as they have to be the following if you want FollowAnalytics SDK and Firebase to work.

    - The JSON for Google Services has the **correct** bundle id.
    - google-services.json file is in the root directory of your cordova project.

#### Call the register for push method (iOS only)

!!! note Registering for push notifications
    While on Android, the devices are registered for push notifications automatically after Firebase is integrated, this is not the case for iOS devices. You must first call a method that will let your device authorize the notifications

 Add a call to `registerForPush`, either from your HTML code whenever you think the moment has come to ask the user for it. _If_, however your app code is already registered to send push notifications, then the you have nothing to do here and skip to the next section.

**HTML**

```HTML
<a href="#" onclick="FollowAnalytics.registerForPush()">register for push</a>
```

!!! warning "Build in release mode for Android"
    The app must be built in release mode in order to receive push notifications






## Analytics

!!! note "Events vs Attributes"
    The FollowAnalytics SDK allows you to tag both events and attributes. In this section, we explain how to utilize both of them in your app and benefit from analytics capabilities. If you are unsure about the difference, you may refer to the [corresponding FAQ entry](https://intercom.help/followanalytics/en/articles/3049135-what-is-the-difference-between-events-and-attributes).

!!! warning "Data sent in debug mode will not appear on dashboards"
    When your app runs in DEBUG mode or in a simulator, the data is automatically sent as development logs, and is therefore not processed to be shown on the main UI page. DEBUG logs can be checked using the method given in the [FAQ section](https://intercom.help/followanalytics/en/articles/3049145-how-do-i-check-that-followanalytics-receives-my-data).

### App tags

The SDK allows you to log events happening in your code. These are the methods that you can call on the SDK:

```html
// Log an event/error
<a href="#" onclick="FollowAnalytics.logEvent('My event')">Log an event</a>
<a href="#" onclick="FollowAnalytics.logError('My error')">Log an error</a>
```

You can also add details to the events and errors

```html
// Log an event/error with details
<a href="#" onclick="FollowAnalytics.logEvent('My event', 'My event details')">Log an event</a>
<a href="#" onclick="FollowAnalytics.logError('My error', 'My error details')">Log an error</a>
```

The details could be a single string like showed before or a key/value object like the following:

```html
// Log an event/error with details
<a href="#" onclick="FollowAnalytics.logEvent('My event', {'Key1':'Value1', 'Key2':'Value2'})">Log an event</a>
<a href="#" onclick="FollowAnalytics.logError('My error', {'Key1':'Value1', 'Key2':'Value2'})">Log an error</a>
```

Use the name as the unique identifier of your log. Use the details to be more specific and add some context. The details allow you to associate multiple key-values for additional context.

For logging geolocations, you can use the following methods:

```html
// Log a location coordinates
<a href="#" onclick="FollowAnalytics.logLocationCoordinates(latitude, longitude)">Log Location</a>
<a href="#" onclick="FollowAnalytics.logLocationPosition(position)">Log Location</a> // Takes a Position object provided by the Geolocation API
```

The `logLocationPosition(position)` method can be used to pass to FollowAnalytics SDK a `position` object provided by the [Geolocation API](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/index.html).


!!! note "Events can be renamed on the FollowAnalytics platform"
    The name that you give to your event here can be overridden in the FollowAnalytics platform. For more information, reach out to your Customer Success Manager or [message support](mailto:support@followanalytics.com).

!!! note "Logging best practices"
    To ensure your tags are relevant and will end up empowering your team through FollowAnalytics, please read the [Logging best practices](https://intercom.help/followanalytics/en/articles/3049146-logging-best-practices) entry in the FAQ section.

### User ID and attributes

This section covers the integration of a user ID and customer attributes. The SDK allows you to set values for attributes FollowAnalytics has _predefined_ as well as _custom_ attributes which you can make yourself.

!!! note "You don't need a user ID to set attributes"
    Attributes are tied to the device when no user ID is provided. If a user ID is set, a profile is created and can be shared across apps.

    In both cases, attributes can be used in segments and campaigns to target users.

#### User ID

!!! note "What is a _user ID_?"
    If users can sign in somewhere in your app, you can specify their identifier to the SDK. Unique to each user, this identifier can be an e-mail address, internal client identifier, phone number, or anything else that ties your customers to you. This is what we call the _user ID_.

    A _user ID_ enables you to relate any event to a specific user across several devices. It is also an essential component for transactional campaigns. A common user ID enables you connect to a CRM or other external systems.

To register the user identifier, use:

```JavaScript
FollowAnalytics.setUserId("user_id@email.com");
```

If you want to remove the user identifier (in case of a sign out for instance) use the following method:

```JavaScript
FollowAnalytics.unsetUserID();
```

#### Predefined attributes

The SDK allows to set values for both custom and predefined attributes.

For predefined attributes, the SDK has the following properties:

```JavaScript
FollowAnalytics.UserAttributes.setFirstName("Peter");
FollowAnalytics.UserAttributes.setLastName("Jackson");
FollowAnalytics.UserAttributes.setCity("San Francisco");
FollowAnalytics.UserAttributes.setRegion("California");
FollowAnalytics.UserAttributes.setCountry("USA");
FollowAnalytics.UserAttributes.setGender(FollowAnalytics.Gender.Male);
FollowAnalytics.UserAttributes.setEmail("mail@mail.com");
FollowAnalytics.UserAttributes.setBirthDate("2001-02-22");
FollowAnalytics.UserAttributes.setProfilePicture("https://picture/picture");
```


They are "predefined" in the sense that they will be attached to default fields on your user profiles.

#### Custom attributes

!!! warning "Double check your custom attribute types"
    When a value for an unknown attribute is received by the server, the attribute is declared with the type of that first value.

    If you change the type of an attribute in the SDK, values might be refused server-side. Please ensure the types match by visiting the [profile data section](https://clients.follow-apps.com/sor/dashboard) of the product.

##### Set a custom attribute

To set your custom attributes, you can use methods that are adapted for each type:

```JavaScript
FollowAnalytics.UserAttributes.setNumber('key', "1");
FollowAnalytics.UserAttributes.setString('key', "A custom string attribute");
FollowAnalytics.UserAttributes.setBoolean('key', "true");
FollowAnalytics.UserAttributes.setDate('key', "2016-10-26");
FollowAnalytics.UserAttributes.setDateTime('key', "2020-06-30T12:56:01.928+0100"); // Example using a string
FollowAnalytics.UserAttributes.setDateTime('key', new Date().toISOString()); // Example with a JavaScript Date object converted to an ISO String
```

For example, to set the user's job:

```JavaScript
FollowAnalytics.setString("job", "Taxi driver");
```

##### Delete a custom attribute value

You can clear the value of an attribute using its key. For example, to delete the user's job:

```JavaScript
FollowAnalytics.clear("job");
```

##### Set of Attributes

You can add or remove an item to or from a set of attributes.

To add an item:

```JavaScript
FollowAnalytics.addToSet("fruits", "apple");
FollowAnalytics.addToSet("fruits", "banana");
```

To remove an item:

```JavaScript
FollowAnalytics.removeFromSet("fruits", "apple");
```

And to clear a set:

```JavaScript
FollowAnalytics.clearSet("fruits");
```

### Opt-Out Analytics

!!! note "What is _Opt-out analytics_?"
		The SDK can be configured to no longer track user information. This is what we call to _opt out_ of analytics.

		Once _opted-out_, no new data is collected, nor is it stored in the app. New session are not generated at launch and nothing is sent back to the server. This data includes the following:

 		- tagged elements such as events, errors
 		- new user identification and attributes
 		- crash reports

		When a user is _opted-out_ of analytics, campaigns will continue to work with the following limitations:

  	- No Contextual campaigns -  _as they depend on log tracking_
  	- No Transactional campaigns - _as they depend on the user ID_
  	- No Dynamic campaigns - _as they depend on users entering a segment_
    - Campaigns filters will depend on old data (before the user opted-out)

    All data collected before the user has opted-out is preserved within FollowAnalytics servers. This means that a user having opted-out will still receive campaigns based on data acquired before opting out (previous campaigns, existing segments, etc).
		The opt-in state is persisted between app starts (unless storage of the app is emptied).

To inspect and set the opt-out state, call the following methods:

```javascript
FollowAnalytics.getOptInAnalytics(function(error, result) {
    if (!error) {
        // do something with the result
        // console.log(result);
    } else {
        // do something with the error
        // console.log(error);
    }      
});
```

```HTML
    FollowAnalytics.setOptInAnalytics(true); // accepts true/false as input
```


### GDPR

You can record when the user expresses his demand to access or delete his personal data by calling one of the following methods:

```javascript
FollowAnalytics.GDPR.requestToAccessMyData();
FollowAnalytics.GDPR.requestToDeleteMyData();
```

The SDK will record all requests and send them to FollowAnalytics servers as soon as network conditions allow it. The SDK remembers pending requests between app restarts.

## Campaigns

!!! note "Campaign basics"
    What we mean by campaigns are the messages that you with to send to your user from the FollowAnalytics platform. Currently, FollowAnalytics enables you to send two types of campaigns: **push notifications** and **in-app messages**. Push notifications allow you to send messages to your user's home screen, whereas an in-app a message that is displayed in the app while the user is actively using it.

    Before you start, be sure that the SDK is properly initialized. This includes registration for push notifications, which is covered in the [integration](#register-for-notifications) section.


### Rich push notifications (iOS Specific)

!!! note "Rich push notifications on iOS"
    Rich push notifications are notifications with embedded rich media (images, GIFs, videos). They are **only available on iOS 10 and above**. Should a user have a version under iOS 10, they will receive rich push notifications but not be able to see the rich media included.

#### Notification Service Extension Framework

##### Requirement

**To make your app able to receive rich notifications & badge incrementation, follow these steps**:

1. In your Xcode project, add a new target. <br><br>

    <img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/ios-doc-new-target.png" width="450" /><br><br>

2. Select _Notification Service Extension_, give it a name and confirm. Then when prompted, activate the scheme.<br><br>

    <img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/ios-doc-target-choice.png" width="450" /><br><br>


##### Add the FANotificationExtension framework

1. In your project settings, select your target and select the `Build Phases` tab:
    1. Press the **+** button, and select `New Copy File Phase`.<br><br>
    <img src="https://fa-assets.s3-eu-west-1.amazonaws.com/documentation/ios_new_copy_phase.png" width="450" /><br><br>
    2. On the newly added Copy File phase, change Destination to `Frameworks`.<br><br>
    <img src="https://fa-assets.s3-eu-west-1.amazonaws.com/documentation/richPush/addFramework.png" width="750" /><br><br>
    3. Press the **+** button. <br><br>
    <img src="https://fa-assets.s3-eu-west-1.amazonaws.com/documentation/richPush/plusFramework.png" width="750" /><br><br>
    4. In the `Choose item to add` dialog, select the `FANotificationExtension.framework` inside the `Frameworks` folder.
    5. Click on `Open` button.
    6. Uncheck `Copy items if needed` box.
    7. Click on `Finish` button.
    8. In the `Framework Search Paths` fields of the `Build Settings` tab, add the path to the `FANotificationExtension.framework`.<br><br>
    <img src="https://fa-assets.s3-eu-west-1.amazonaws.com/documentation/richPush/frameworkSearchPath.png" width="750" /><br><br>

    Make sure if your `Framework Search Paths` are equal to the `Framework Search Paths` of your main target.

##### Create an app group between your app and the extension

Before all, an [App Group](https://developer.apple.com/account/resources/identifiers/list/applicationGroup)  must be created.

- Go to the `apple developer` portal.
- Choose the `identifier` tab.
- Choose the `App Groups` filed from the list.<br><br>

<img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/richPush/appstep1.png" width="700" />
     

- Tap `+` to create a new `App Group`
- Create your `App Group` and click `Continue` <br><br>

<p align="center" class="border-img">
<img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/richPush/appstep2.png" width="700" />
</p>


- Switch to the `App ID` of the app.
- Add `App Groups` capability<br><br>


<p align="center" class="border-img">
<img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/richPush/appstep3.png" width="700" />
</p>

- Select the new `App Group` recently created.  <br><br>


<p align="center" class="border-img">
<img src="https://fa-assets.s3-eu-west-1.amazonaws.com/documentation/richPush/modified-appstep4.png" width="700" />
</p>


- Then, the `app group` must be added to the `AppId` of app and extension
- Finally, the `app group` capability must be activated in `Xcode` for both app and extension<br><br>


##### Configuring the SDK to work with the extension

First, make sure you have set the proper **App Group** for the app target:

<img src="https://fa-assets.s3-eu-west-1.amazonaws.com/documentation/richPush/appstep7.png" width="700" />

<br>

The `appGroup` parameter should be specified in the `followanalytics_configuration.json` file:

```JSON
{
"ios":
  { 
    "debug":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : true,
      "maxBackgroundTimeWithinSession" : 120,
      "appGroup":"group.your.identifier" 
    },
    "release":
    {
      "apiKey" : "YOUR_API_KEY",
      "isVerbose" : false,
      "maxBackgroundTimeWithinSession" : 120,
      "appGroup":"group.your.identifier"
    }
  }
}
```

!!! note "Note"
    Don't forget to run `cordova prepare ios` after add any configuration on `followanalytics_configuration.json`

##### Implement the Notification Service Extension

First, make sure you have set the proper **App Group** for the extension target:

<img src="https://fa-assets.s3-eu-west-1.amazonaws.com/documentation/richPush/appstep8.png" width="700" />

<br>


Copy and paste the following implementation in the `NotificationService` file of the extension target you created and change the the name of the `appGroup` with the one you defined:

```Objective-C tab=
#import “NotificationService.h”
#import <FANotificationExtension/FANotificationExtension.h>

@interface NotificationService ()

@property(nonatomic, strong) void (^contentHandler)(UNNotificationContent* contentToDeliver);
@property(nonatomic, strong) UNMutableNotificationContent* bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest*)request
   withContentHandler:(void (^)(UNNotificationContent* _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    [FANotificationService
        getFAContentIfNeededWithRequest:request
                            bestContent:self.bestAttemptContent
                            appGroup:@"group.your.identifier"
                            completion:^(UNMutableNotificationContent* _Nullable newContent) {
                            NSLog(@"NotificationService: %@", request);
                            // Modify the notification content here...

                            self.contentHandler(newContent);
                            }];
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content,
    //otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}
@end
```

```Swift  tab=
import UserNotifications
import FANotificationExtension

class NotificationService: UNNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(_ request: UNNotificationRequest,
                                withContentHandler contentHandler:
                                @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)

        if let bestAttemptContent = bestAttemptContent,
        let contentHandler = self.contentHandler {
        // Modify the notification content here...

            FANotificationService.getFAContentIfNeeded(with: request,
                                                        bestContent: bestAttemptContent,
                                                        appGroup: "group.your.identifier") {
                                                        (newContent) in
                                                        if let newC = newContent {
                                                            contentHandler(newC)
                                                        }
            }
        }
    }

    override func serviceExtensionTimeWillExpire() {
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }
}
```



### Badge Management

!!! note "Prerequisites"
    For using this feature, there are 3 prerequisites needed for iOS:
    
    * Have the Notification Service Extension with the FollowAnalytics extension framework. [More information here](#notification-service-extension-framework)
    * Create an app group between your app and the extension. [More information here](#create-an-app-group-between-your-app-and-the-extension)
    * Specify your app group in the `followanalytics_configuration.json`. [More information here](#configuring-the-sdk-to-work-with-the-extension)


!!! warning "Android Version"
    This feature will only work for Android devices with versions below Android 8.

Badges are the numbers displayed on the icon of the app, indicating to user that the app has new information. The FollowAnalytics SDK handles the badge number automatically, but if you need to update it and you want to take in consideration the current value number from our SDK you can do it with the following methods:

```javascript
FollowAnalytics.Badge.set(int); // Set the value of the icon badge number
FollowAnalytics.Badge.updateBy(int); // Update the value of the icon badge number
FollowAnalytics.Badge.get(function) // Get the value of the icon badge number
```

Examples of usage:

```javascript
FollowAnalytics.Badge.set(1); // Set the badge number to 1
FollowAnalytics.Badge.updateBy(2); // Increase the badge number by 2
FollowAnalytics.Badge.get((error, result) => {
    if (!error) {
        console.log(result); // Get the value of the icon badge number
    } else {
        console.log(error);
    }
});
```

### Opt-in Notifications

The FollowAnalytics SDK opt-in notifications status defines whether your app will receive notifications from your Push campaigns. Opt-in notifications is `true` by default, meaning notifications from your Push campaigns will be received by your app. This status is independent from the system notification authorization, which is also needed by your app to display notifications.

Thanks to this opt-in notifications status, you can implement a UI in your app to allow to choose whether to receive notifications, without the need to go to the system notification authorization settings. Note that the opt-in notifications status will have no effect if the system notification authorization is not allowed, and in this case, your app will not receive notifications from your Push campaigns, whatever the opt-in notifications status.

To update your app UI to reflect the current opt-in notifications status, use the `getOptInNotifications` method:

```javascript
FollowAnalytics.getOptInNotifications((error, result) => {
    if (!error) {
        // do something with the result
        // console.log(result);
    } else {
        // do something with the error
        // console.log(error);
    }      
});
```

To update the current opt-in notifications status upon UI change, use the `setOptInNotifications` method:

```javascript
FollowAnalytics.setOptInNotifications(true); // accepts true/false as input
```

!!! note "Handling transistion from opt-out to opt-in notifications"

    Just calling `setOptInNotifications(true)` after the user interacts with your app UI to opts-in for notifications could be insufficient if the system notification authorization is not allowed. For this reason, we recommend to implement the following flow after the user opts-in for notifications in your app:

    - Check the return value of `FollowAnalytics.isRegisteredForPushNotifications()` which is `true` only if the system notification authorization is allowed AND the SDK opt-in notifications status is `true`.
    - If `false`, display a message and button to invite your user to enable the system notification authorization.
    - Call `FollowAnalytics.openNotificationSettingsIfNeeded()` when the user taps the button. The method will take care of either displaying the notification authorization request alert, or directing to the app settings screen. This will allow the user to enable notifications.

    Another possibility is to bypass the first two steps and only implement the last one.



### Customize the Icon Notification (Android specific)

For applications that targets at least Lollipop version, the push notification icon at the status bar needs to be updated according to this [section](https://material.io/guidelines/style/icons.html#icons-system-icons) and this [section](https://developer.android.com/studio/write/image-asset-studio.html) (tutorial for creating icons with android studio).

Make sure to rename all the icon images to `ic_fa_notification.png` for each density created.

Then, place them to your project under `platforms/android/res` folder and make sure that all your notifications looks right with the new color scheme. For example :
`yourproject/platforms/android/res/drawable-mdpi/ic_fa_notification.png`


!!! note "Icon colors"
    Update or remove assets that involve color. The system ignores all non-alpha channels in action icons and in the main notification icon. You should assume that these icons will be alpha-only. The system draws notification icons in white and action icons in dark gray.

### Implement custom behavior on notification tap

You can implement a custom behavior when the user taps on a notification by implementing the `onNotificationTapped` callback in `followAnalytics_configuration.json`. This allows you to perform specific actions when a notification is tapped:

```JSON
    {
        "apiKey" : "YOUR_API_KEY",
        "isVerbose" : true,
        "maxBackgroundTimeWithinSession" : 120,
        "onNotificationTapped" : true
    }
```

!!! note "Use `cordova prepare "platform"`"
    Don't forget to run `cordova prepare ios` and `cordova prepare android` to apply the changes on `followanalytics_configuration.json` file.

To implement `onNotificationTapped`, add the following code to the `onDeviceReady` Cordova callback:

```JavaScript
onDeviceReady: () => {
    FollowAnalytics.handleCallbacks();
    FollowAnalytics.on("onNotificationTapped", (actionInfo) => {
        alert(JSON.stringify(actionInfo));
    });
},
```

The SDK passes some Push campaign information to your app through this callback thanks to the `actionInfo` argument

| Properties                   | Type      | Usage                   | Description                                                                     |
| ---------------------------- | --------- | ----------------------- | ------------------------------------------------------------------------------- |
| `messageId`                  | string    | actionInfo.messageId          | Containing the FollowAnalytics campaign identifier.                             |
| `identifier`                 | string    | actionInfo.identifier         | Containing the notification action button identifier defined in your code when customizing the notification (only doable on the native side of your app). |
| `parameters`                 | object    | actionInfo.parameters.yourKey | Containing the key/value pairs defined in the campaign editor.                  |
| `openingUrl`                 | string    | actionInfo.openingUrl         | Containing the app link  defined in the campaign editor.                        |


### Implement custom behavior on Push reception

You can implement a custom behavior when the device receives a message from a push campaign that contains custom parameters (i.e. at least one key/value pair). This can be used to fetch data from your server if a particular custom parameter is defined in the push message. To do so, implement the `onMessageReceived` callback in `followAnalytics_configuration.json`:

```JSON
    {
        "apiKey" : "YOUR_API_KEY",
        "isVerbose" : true,
        "maxBackgroundTimeWithinSession" : 120,
        "onMessageReceived" : true
    }
```

!!! note "Use `cordova prepare "platform"`"
    Don't forget to run `cordova prepare ios` and `cordova prepare android` to apply the changes on `followanalytics_configuration.json` file.

To implement `onMessageReceived`, add the following code to the `onDeviceReady` Cordova callback:

```JavaScript
onDeviceReady: () => {
    FollowAnalytics.handleCallbacks();
    FollowAnalytics.on("onMessageReceived", (message) => {
        alert(JSON.stringify(message));
    });
},
```

The SDK passes some Push campaign information to your app through this callback thanks to the `message` argument:

| Properties       | Type      | Description                                                                     |
| -----------------| --------- | ------------------------------------------------------------------------------- |
| `body`           | string    | Text provided in the platform's "Content" field of the Push campaign editor. |
| `category`       | string    | Interactive notification action key (Android) or category (iOS)              |
| `openingUrl`     | string    | Url provided in the platform's "App Link" field of the Push campaign editor. |
| `identifier`     | string    | Unique message Identifier. |
| `layout`         | string    | Return layout |
| `parameters`     | object    | Key/Value pairs provided in the Push campaign editor. |
| `type`           | string    | Return message type  |
| `date`           | string    | If message comes from a Push campaign, this is the date at which the message is received on the device. If message comes from an In-App campaign, this is the start date of the campaign. |
| `title`          | string    | Text provided in the platform's "Title" field of the Push campaign editor.                    |
| `contentUrl`     | string    | Url provided in the platform's "URL" field of In-App Custom Web Page campaign editor. If the message comes from a Push campaign, this is the url of the Rich Media. |
| `isInApp`        | boolean   | Returns `true` if message comes from a In-App campaign, `false` if it comes from a Push campaign. |
| `isPush`         | boolean   | Returns `true` if message comes from a Push campaign, `false` if it comes from a In-App campaign. |
| `isRead`         | boolean   | Indicates if the message has been read or not. False at message reception.  |
| `isSilent`       | boolean   | Returns `true` if message comes from a Push campaign with the "Silent" option enabled, `false` otherwise.  |
| `isNotificationDismissed`    | boolean   | This property returns `true` if the notification has been dismissed, `false` otherwise. |
| `notificationId` | integer   | If message comes from a Push campaign, this is the system notification identifier. |
| `subtitle`       | boolean   | Text provided in the platform's "Subtitle" field of the Push campaign editor.|

### Implement custom behavior on Native Alert button tap

You can implement a custom behavior when the user taps on a **Native Alert** button by implementing the `onNativeInAppButtonTapped` callback in the `followanalytics_configuration.json`. This allows you to perform specific actions when a native alert button is tapped:

```JSON
    {
        "apiKey" : "YOUR_API_KEY",
        "isVerbose" : true,
        "maxBackgroundTimeWithinSession" : 120,
        "onNativeInAppButtonTapped" : true
    }
```

!!! note "Use `cordova prepare "platform"`"
    Don't forget to run `cordova prepare ios` and `cordova prepare android` to apply the changes on `followanalytics_configuration.json` file.

!!! note "App Link" 
    On Android the `onNativeInAppButtonTapped` is not called when the taps on a App Link button. It's only called on iOS.

To implement `onNativeInAppButtonTapped`, add the following code to the `onDeviceReady` Cordova callback:

```JavaScript
onDeviceReady: () => {
    FollowAnalytics.handleCallbacks();
    FollowAnalytics.on("onNativeInAppButtonTapped", (actionInfo) => {
        alert(JSON.stringify(actionInfo));
    });
},
```

The SDK passes some Native Alert campaign information to your app through this callback thanks to the `actionInfo` argument:

| Properties                   | Type      | Usage                   | Description                                                                     |
| ---------------------------- | --------- | ----------------------- | ------------------------------------------------------------------------------- |
| `messageId`                  | string    | actionInfo.messageId          | Containing the FollowAnalytics campaign identifier. This field is only set on iOS and will always be undefined on Android. |
| `parameters`                 | object    | actionInfo.parameters.yourKey | Containing the key/value pairs defined in the campaign editor.                  |
| `openingUrl`                 | string    | actionInfo.openingUrl         | Containing the app link  defined in the campaign editor. This field is only set on iOS and will always be undefined on Android. |

### Pausing in-app campaigns

!!! note "What is _pausing and resuming_ an in-app campaign?"
    _Pausing_ campaigns are used to prevent in-app from being displayed on certain screens and views of your app. You may _pause_ a screen of the app when it is too important, or is part of a process that is too important to be interrupted by an in-app (i.e a payment screen in the process of the user making a purchase).

    When the screen is safe to display an in-app, you _resume_ in-app campaigns. Any campaign supposed to be displayed when the mechanism is _paused_, is stacked and shown as soon as the mechanism is _resumed_. This way you can send send in-app campaigns without impacting the user experience.

To pause and resume campaigns, add the following methods in you code at the location you wish the pause and resume to take effect:

```JavaScript
FollowAnalytics.pauseCampaignDisplay();
FollowAnalytics.resumeCampaignDisplay();
```

!!! note "Create safe spaces for you in-app messages"
    Rather than pause everywhere you have an important screen or process, you can pause right at the initialization of the SDK and resume in the areas you think it is safe for in-app campaigns to be displayed.

### Archiving messages

FollowAnalytics SDK allows you to store campaigns's messages received by your app. This makes them available for custom usage, like building an inbox feature. All campaigns displayed by a device can be archived locally and accessed from the developer's code. In order to configure your campaign storage, you have to set the following [FollowAnalyticsConfiguration](#initialize-the-sdk) properties on the `followanalytics_configuration.json`:

```json
{
    "archiveInAppMessages": true,
    "archivePushMessages": true
}
```

#### Get all campaigns

```javascript
FollowAnalytics.InApp.getAll(function(error, result) {
    if (!error) {
        // do something with the result
        // console.log(JSON.stringify(result));
    } else {
        // do something with the error
        // console.log(error);
    }      
});
```
```javascript
FollowAnalytics.Push.getAll(function(error, result) {
    if (!error) {
        // do something with the result
        // console.log(JSON.stringify(result));
    } else {
        // do something with the error
        // console.log(error);
    }      
});
```

#### Get campaign by identifier

```javascript
FollowAnalytics.InApp.get(identifier, function(error, result) {
    if (!error) {
        // do something with the result
        // console.log(JSON.stringify(result));
    } else {
        // do something with the error
        // console.log(error);
    }      
});
```
```javascript
FollowAnalytics.Push.get(identifier, function(error, result) {
    if (!error) {
        // do something with the result
        // console.log(JSON.stringify(result));
    } else {
        // do something with the error
        // console.log(error);
    }      
});
```

#### Mark campaigns as read

```javascript
FollowAnalytics.InApp.markAsRead([identifier1, identifier2, ...]);
FollowAnalytics.Push.markAsRead([identifier1, identifier2, ...]);
```

#### Mark campaigns as unread

```javascript
FollowAnalytics.InApp.markAsUnread([identifier1, identifier2, ...]);
FollowAnalytics.Push.markAsUnread([identifier1, identifier2, ...]);
```

#### Delete campaigns

```javascript
FollowAnalytics.InApp.delete([identifier1, identifier2, ...]);
FollowAnalytics.Push.delete([identifier1, identifier2, ...]);
```

The JavaScript object contains the following properties:

| Properties       | Type      | Description                                                                     |
| -----------------| --------- | ------------------------------------------------------------------------------- |
| `body`           | string    | Text provided in the platform's "Content" field of the Push campaign editor. |
| `category`       | string    | Interactive notification action key (Android) or category (iOS) |
| `openingUrl`     | string    | Url provided in the platform's "App Link" field of the Push campaign editor. |
| `identifier`     | string    | Unique message Identifier. |
| `layout`         | string    | Return layout |
| `parameters`     | object    | Key/Value pairs provided in the Push campaign editor. |
| `type`           | string    | Return message type  |
| `date`           | string    | If message comes from a Push campaign, this is the date at which the message is received on the device. If message comes from an In-App campaign, this is the start date of the campaign. |
| `title`          | string    | Text provided in the platform's "Title" field of the Push campaign editor.                    |
| `contentUrl`     | string    | Url provided in the platform's "URL" field of In-App Custom Web Page campaign editor. If the message comes from a Push campaign, this is the url of the Rich Media. |
| `isInApp`        | boolean   | Returns `true` if message comes from a In-App campaign, `false` if it comes from a Push campaign. |
| `isPush`         | boolean   | Returns `true` if message comes from a Push campaign, `false` if it comes from a In-App campaign. |
| `isRead`         | boolean   | Indicates if the message has been read or not. False at message reception.  |
| `isSilent`       | boolean   | Returns `true` if message comes from a Push campaign with the "Silent" option enabled, `false` otherwise.  |

##### Android only:
| Properties                  | Type      | Description                                                                     |
| ----------------------------| --------- | ------------------------------------------------------------------------------- |
| `isNotificationDismissed` | boolean   | This property returns `true` if the notification has been dismissed, `false` otherwise. |
| `notificationId`          | integer   | If message comes from a Push campaign, this is the Android notification identifier. |

##### iOS only:
| Properties | Type      | Description                                                                     |
| -----------| --------- | ------------------------------------------------------------------------------- |
| `subtitle` | boolean   | Text provided in the platform's "Subtitle" field of the Push campaign editor.|
| `notificationId` | string   | If message comes from a Push campaign, this is the `UNNotificationRequest` unique identifier (iOS >= 10.0), otherwise it's `null`|

### Opening an external webview

The plugin allows you to launch a native web view with a given `url` and be able to performs logs from that external resource. In order to do so, if you want to open url `https://s3-eu-west-1.amazonaws.com/fa-sdk-files/index.html` in a native web view launched from your html code, call the following method from your PhoneGap HTML:

```JavaScript
FollowAnalytics.openWebView(URL, TITLE, CLOSE_BUTTON_TEXT);
```

Something like:

```HTML
<a href="#" onclick="FollowAnalytics.openWebView('https://s3-eu-west-1.amazonaws.com/fa-sdk-files/index.html', 'Test Log', 'Close'); return false;">Open WebView with title</a>
```

The `URL` argument will contain the url of the page to display (required), the `TITLE` argument will be shown as the title for the NavigationBar (optional), and the `CLOSE_BUTTON_TEXT` will contain the text for the close button (optional, defaults to “close”).

Please check the html at `https://s3-eu-west-1.amazonaws.com/fa-sdk-files/index.html` to see how to tag your external pages.

Current available methods are:

- `logEvent(name, details)`
- `logError(name, details)`
- `setUserId(userId)`
- `unsetUserId()`

**NOTE**: if you're tagging from a link and the link has a real `href` set, the SDK will handle that for you, performing the `onclick` action and redirecting you right after.

## Migration and Troubleshooting

### Updating from 6.4.0 to 7.0.0
- Deep Link event `onPushMessageClicked` was been replaced by `onNotificationTapped` callback. If you were using `onPushMessageClicked` to handle notification tap event, consider to move your implementation to `onNotificationTapped`, as `onPushMessageClicked` no longer exists. See implementation details [here.](sdks/phonegap/documentation/#implement-custom-behavior-on-notification-tap)
- If you were calling `FollowAnalytics.handleDeepLink()` in the `onDeviceReady` callback, replace this call by a call to `FollowAnalytics.handleCallbacks()`.

### Updating from 6.3.0 to 6.3.1
- Calling `FABage.enable()` on the native side is no longer necessary to enable the bagde feature. Now the SDK automatically handles the badge number from the received campaigns.
- Calling `FollowAnalytics.initialize()` from the `app.onDeviceReady()` callback in your `index.js` is no longer necessary. Now the plugin automatically adds the SDK initialization code in your `AppDelegate.m`.

### Updating from 6.2 to 6.3

- It's no longer needed to define the SDK Configuration on the native side. Now, for both Android and iOS platforms, the Configuration must be defined in the `followanalytics_configuration.json` file. If you are updating from 6.2, we recommend to follow those steps:
    - Remove the FollowAnalytics plugin: `cordova plugin rm cordova.plugin.followanalytics`
    - Delete the existing `followanalytics_configuration.json` file or edit it to define your desired [SDK Configuration](#initialize-the-sdk).
    - Add the FollowAnalytics plugin back: `cordova plugin add /path/to/fa-sdk-phonegap-plugin/`.
    - Edit the `followanalytics_configuration.json` file to define your desired [SDK Configuration](#initialize-the-sdk) if needed.
    - Run `cordova prepare ios` and `cordova prepare android` to apply the changes on `followanalytics_configuration.json`.
- Some advanced configurations like [rich push notifications](#rich-push-notifications-ios-specific) for iOS still requires native modifications.
- Modify the methods arguments in all your calls to SDK getters. For instance, to get the opt-in analytics state, you have to update your code from this:
    ```JavaScript
    FollowAnalytics.getOptInAnalytics(function(result) {
        // Do something with the result
    });
    ```
    To this:
    ```JavaScript
    FollowAnalytics.getOptInAnalytics(function(error, result) {
        if (!error) {
            // Do something with the result
        } else {
            // Do something with the error
        }      
    });
    ```
    Make sure to read each method's description in the documentation.
- The method `setMaximumBackgroundTimeWithinSession()` is no longer available. Now, you have to use the `maxBackgroundTimeWithinSession` parameter in `followanalytics_configuration.json` instead.

### Migration from 4.x

Although previous versions of the FollowAnalytics plugin respected Cordova guidelines of integration they still required developers to perform modifications to the native code for each supported platform.

This new version changes things as it can be used without having to modify nothing but the `config.xml` and the `html/js` code.
If you plan to update from older versions, the shortest path would be to:

- remove the FollowAnalytics plugin
- remove both platforms (iOS and Android)
- add back the platforms (iOS and Android)
- add back the FollowAnalytics plugin
- follow this installation guide from the top

If you plan to keep the current code you'll need to remove all the code needed to integrate previous plugin versions (please check older plugin documentation to know exactly what to remove).

### Troubleshooting

#### Inline JavaScript not executed

If you eventually run into an error like:

```HTML
Refused to execute inline event handler because it violates the following Content Security Policy directive: "default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'". Note that 'script-src' was not explicitly set, so 'default-src' is used as a fallback.
```

Be sure to replace the line

```HTML
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
```

on your `index.html` by

```HTML
<meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'" >
```

This will enable the logging of events.

#### Cannot find module 'xcode'
Execute the following command : `npm install --save xcode` and reinstall `FollowAnalytics SDK` plugin.

#### Cannot find module 'q'
Execute the following command : `npm install --save q` and reinstall `FollowAnalytics SDK` plugin.

#### Problems with arm64 Architecture or PhaseScriptExecution failed
First of all make sure you removed all `Run Script` from your `Build Phases`. <br>
Remove the plugin with: `cordova plugin remove cordova.plugin.followanalytics`. <br>
Add the plugin again with: `cordova plugin add /path/to/fa-sdk-phonegap-plugin/`
