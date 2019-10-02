sdk_version: PhoneGap v6.2

!!! note "Hybrid solutions and the FollowAnalytics SDK"
    Note that if you are working on a hybrid non-native solution, you will have to do some of the procedures on the native side of your app. This will be the case for OS specific as well as more advanced features. When this is necessary, we will provide the information for each platform. Each FollowAnalytics SDK for PhoneGap/Cordova are based on a native version of the SDK.


!!! note "Prerequisites"
    The FollowAnalytics PhoneGap/Cordova SDK was tested on :

    - Cordova CLI v7.0.1
    - Cordova platform android v7.0.0
    - Cordova platform iOS v4.5.0

## Integration

This document will cover app setup and the component installation process, as well as basic integration steps for iOS and Android.

If you want an example, check out our [PhoneGap sample integration code on Github](https://github.com/followanalytics/fa-cordova-app).


!!! note "Prerequisites and minimal setup"
    In this section, we explain how to get started with FollowAnalytics SDK for iOS. Before you start, be sure to have all the [necessary prerequisites](/faq/#prerequisites-for-integrating-the-SDK). These include:

    * Registering the application on the Platform
    * Generating the API Key

    Here are the minimal steps for integrating the SDK in your app:

    * [Installing the SDK in your app](#install-using-cocoapods)
    * [Initializing the SDK using your API key](#initialize-with-your-api-key)
    * [Registering for notifications](#push-notifications) and [location](#location)

    Once the integration is finished, we highly recommend you test the setup. You will find out how to test your setup in this [section](#test-your-setup). Then, you can start [tagging events and saving attributes](#analytics) in your app.



### Installation

1. Download the FollowAnalytics SDK from the [developer portal](/sdks/downloads/).

2. Add FollowAnalytics SDK plugin to your cordova project:


    ```SH
    cordova plugin add /path/to/fa-sdk-phonegap-plugin/
    ```

### Initialize the SDK

!!! note "Be sure to have your API key"
    Be sure to have your API key for this step of the configuration. You can retrieve you app's API key from the administration section of the FollowAnalytics platform (see [here](#prerequisites))

##### Android

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
    "apiKey" : "YOUR_API_KEY",
    "isVerbose" : true,
    "maxBackgroundTimeWithinSession" : 120
  }
}
```

Below, a description table that FollowAnalytics Phonegap SDK accepts as properties to add for customizing the initialization :

| Properties                       | Availability | Type      | Default Value   | Description                                                                     |
| -------------------------------- |--------------| --------- | --------------- | ------------------------------------------------------------------------------- |
| `apiKey`                         | Required     | string    |      null       | Your app api key to use our SDK                                                 |
| `isVerbose`                      | Optional     | boolean   |     false       | To see internal logs made by the SDK                                            |
| `maxBackgroundTimeWithinSession` | Optional     | number    |     120         | To determine the lifetime of a session when in background (between 15 and 3600) |

!!! note "Properties in android plateform"
    Be sure to add any properties inside of `"android"` json object. Otherwise the properties won't be affected to the initialization of FollowAnalytics Phonegap SDK.




##### iOS

Add the following to your `index.js`:

```JavaScript
onDeviceReady: function() {
    FollowAnalytics.initialize(YOUR_API_KEY);
}
```

**Debug mode**

If you want the SDK to be initialized in Debug mode hence being more verbose about the methods called and actions performed, please initialize it as follows:

```JavaScript
onDeviceReady: function() {
    FollowAnalytics.initialize(YOUR_API_KEY, true);
}
```

!!! warning "Remove Debug mode before releasing"
    Don't forget to remove the debug flag when compiling to the stores in order to reduce logging within clients applications.

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
    The FollowAnalytics SDK allows you to tag both events and attributes. In this section, we explain how to utilize both of them in your app and benefit from analytics capabilities. If you are unsure about the difference, you may refer to the [corresponding FAQ entry](/faq/#what-is-the-difference-between-events-and-attributes).

!!! warning "Data sent in debug mode will not appear on dashboards"
    When your app runs in DEBUG mode or in a simulator, the data is automatically sent as development logs, and is therefore not processed to be shown on the main UI page. DEBUG logs can be checked using the method given in the [FAQ section](/faq/#how-do-i-check-that-followanalytics-receives-my-data) (see related entry in FAQ for more information on [debug & release modes](/faq/#what-is-the-difference-between-the-debug-and-release-configurations)).

### App tags

The SDK allows you to log events happening in your code. These are the methods that you can call on the SDK:

```HTML
//Log event with no details
<a href="#" onclick="FollowAnalytics.logEvent('My event')">Log an event</a>

//Log event with details
<a href="#" onclick="FollowAnalytics.logEvent('My event', 'My event details')">Log an event</a>

//Log error with no details
<a href="#" onclick="FollowAnalytics.logError('My error')">Log an error</a>

//Log error with details
<a href="#" onclick="FollowAnalytics.logError('My error', 'My error details')">Log an error</a>

```

!!! note "Events can be renamed on the FollowAnalytics platform"
    The name that you give to your event here can be overridden in the FollowAnalytics platform. For more information, reach out to your Customer Success Manager or [message support](mailto:support@followanalytics.com).

Use the name as the unique identifier of your log. Use the details section to add specific details or context. The details field can either be a **String** or a **Hash**, so that you can associate multiple key-values for additional context.

For example, you can log the display of a view by writing the following:

```JavaScript
FollowAnalytics.logEvent('Product view', Product reference);

FollowAnalytics.logEvent('Add product to cart', {'product_id': 'ABCD123','product_category': 'Jeans'});
```

!!! note "Logging best practices"
    To ensure your tags are relevant and will end up empowering your team through FollowAnalytics, please read the [Logging best practices](/faq/#logging-best-practices) entry in the FAQ section.

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
FollowAnalytics.UserAttributes.setDateTime('key', "2016-10-26T11:22:33+01:00");
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

```HTML
    FollowAnalytics.getOptInAnalytics(function(result){
        // do something with the result
        // console.log(result);
    });
```

```HTML
    FollowAnalytics.setOptInAnalytics(true); // accepts true/false as input
```




### GDPR

You can record when the user expresses his demand to access or delete his personal data by calling one of the following methods:

```HTML
    FollowAnalytics.GDPR.requestToAccessMyData();
    FollowAnalytics.GDPR.requestToDeleteMyData();
```

The SDK will record all requests and send them to FollowAnalytics servers as soon as network conditions allow it. The SDK remembers pending requests between app restarts.

## Campaigns

!!! note "Campaign basics"
    What we mean by campaigns are the messages that you with to send to your user from the FollowAnalytics platform. Currently, FollowAnalytics enables you to send two types of campaigns: **push notifications** and **in-app messages**. Push notifications allow you to send messages to your user's home screen, whereas an in-app a message that is displayed in the app while the user is actively using it.

    Before you start, be sure that the SDK is properly initialized. This includes registration for push notifications, which is covered in the [integration](#### Push notifications) section.


### Rich push notifications (iOS Specific)

!!! note "Rich push notifications on iOS"
    Rich push notifications are notifications with embedded rich media (images, GIFs, videos). They are **only available on iOS 10 and above**. Should a user have a version under iOS 10, they will receive rich push notifications but not be able to see the rich media included.

#### Notification Service Extension Framework

##### Requirement

**To make your app able to receive rich notifications & badge incrementation, follow these steps**:

1. In your xCode project, add a new target.

    <img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/ios-doc-new-target.png" width="450" />

2. Select _Notification Service Extension_, give it a name and confirm. Then when prompted, activate the scheme.

    <img src="https://s3-eu-west-1.amazonaws.com/fa-assets/documentation/ios-doc-target-choice.png" width="450" />

##### Install using Cocoapods

1. If you want to use *Cocoapods* to manage your external dependencies, simply add the following line to your *Podfile* only in the **extension target**:

    ```
    pod 'FANotificationExtension'
    ```
    <!-- This section is redundant because it is covered before. It will be corrected on next version-->

    If you don't have a *podfile* yet, open a console and do a `pod init` in your project directory.

    Then, you only need to update your cocoapods dependencies:

    ```
    pod install
    ```

2. Select the target of your main app, in Build phase
	1. Press the **+** button, and select `New Copy File Phase`.
	2. Change the destination to `Frameworks`
	3. Add the FANotificationExtension.framework, you should find it inside the Pod folder.

3. Still in the Build phase
	1. Press the **+** button, and select `New Run Script Phase`.
	2. Add this script:
    ```shell
    bash "${PODS_ROOT}/FANotificationExtension/FANotificationExtension.framework/strip-frameworks.sh"
    ```

##### Initialise

1. import the `<FANotificationExtension/FANotificationExtension.h>` in your file of your target extension.
2. Implement the code in the method: `didReceiveNotificationRequest`:

**Objective-C**

```Objective-C
- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];

    [FANotificationService getFAContentIfNeededWithRequest:request bestContent:self.bestAttemptContent appGroup:@"APPGROUP" completion:^(UNMutableNotificationContent * _Nullable newContent) {
      // Modify the notification content here...
      self.contentHandler(newContent);
    }];
}
```

 **Swift**

```SWIFT
override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    if let bestAttemptContent = bestAttemptContent {
            FANotificationService.getFAContentIfNeeded(with: request, bestContent: bestAttemptContent, appGroup: "APPGROUP", completion: { (newContent:UNMutableNotificationContent?) in
            // Modify the notification content here...

            contentHandler(newContent!)
        })
    }
}
```

⚠️If you need to increase the **badge number** with a push, you will need an app Group between your main App and you extension.

### Custom handling of rich campaigns

Rich campaigns can be handled directly by the application code, instead of being showed automatically by the SDK. The behavior is defined when creating the campaign, using the "automatically display content" switch.

##### iOS
For campaigns where the content is not handled by FollowAnalytics,
implement the following *FAFollowAppsDelegate* method in your *AppDelegate*:

```Objective-C
- (void)followAppsShouldHandleWebViewUrl:(NSURL *)url withTitle:(NSString *)webviewTitle;
```

##### Android

For campaigns where the content is not handled by FollowAnalytics, you will need to extend `com.followapps.android.CustomRichCampaignBaseReceiver` and declare it in your `AndroidManifest.xml`.
You'll need to use an intent-filter on `BROADCAST_RICH_CAMPAIGNS_ACTION`. For instance:

```XML
<receiver android:name=".RichCampaignDataReceiver" >
    <intent-filter>
        <action android:name="%YOUR_APP_PACKAGE_NAME%.BROADCAST_RICH_CAMPAIGNS_ACTION" />
    </intent-filter>
</receiver>
```

Where `%YOUR_APP_PACKAGE_NAME%` is your application package name.

The method `onRichCampaignDataReceived` must be overridden. Rich campaign parameters are provided as method arguments:

* Campaign title: `title`
* Campaign URL: `url`
* Custom Parameters associated to the campaign: `customParams`


### Customize the Icon Notification (Android specific)

For applications that targets at least Lollipop version, the push notification icon at the status bar needs to be updated according to this [section](https://material.io/guidelines/style/icons.html#icons-system-icons) and this [section](https://developer.android.com/studio/write/image-asset-studio.html) (tutorial for creating icons with android studio).

Make sure to rename all the icon images to `ic_fa_notification.png` for each density created.

Then, place them to your project under `platforms/android/res` folder and make sure that all your notifications looks right with the new color scheme. For example :

        yourproject/platforms/android/res/drawable-mdpi/ic_fa_notification.png


!!! note "Icon colors"
    Update or remove assets that involve color. The system ignores all non-alpha channels in action icons and in the main notification icon. You should assume that these icons will be alpha-only. The system draws notification icons in white and action icons in dark gray.

### Deep-linking: URL, Parameters

Campaigns created through FollowAnalytics allow to deep link to content in your app. You can either use an App Link, or use key-value parameters that are forwarded to your code.

#### App Links
Version _4.1.0_ of the SDK introduced the possibility to use direct App Links like `twitter://messages`, which will send you to the corresponding screen inside the Twitter application.

To use App Links you need to enable Deep Linking switch in our UI, when creating a campaign. Use the _App Link_ field to set the type of URLs schemas.

It can either be an URL Schema to an external application or for your own application.

#### Deep-linking parameters

In FollowAnalytics campaigns, you can specify _deep-linking parameters_, e.g. in your push messages.

These parameters are given to the developer's code by the SDK. **It is then up to the developer to implement the deep-linking** in the app (specific path of screens, format of the arguments, etc.).

##### Deep-linking parameters

To handle the deeplinking from your javascript code, have this run when the device is ready:

```JavaScript
onDeviceReady: function() {
        ...
        FollowAnalytics.handleDeeplink();
        FollowAnalytics.on("onPushMessageClicked", function(data){
            alert(JSON.stringify(data));
        });
        ...
},
```

As you can notice here, the plugin provides the following events : `onPushMessageClicked`.

* **PushMessageClicked**: When the user clicks on the push, you can retrieve all the added custom parameter as following:

    ```javascript
        FollowAnalytics.on("onPushMessageClicked",function(data){
                    //The argument data is an object Json.You can retrieve your value by data.my_key key/value json
        });
    ```

    The argument `data` is the javascript key-value object, you can retrieve the value by the key as following : `data["deepurl"]`


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

### Opening an external webview

The plugin allows you to launch a native web view with a given `url` and be able to performs logs from that external resource. In order to do so, if you want to open url `https://s3-eu-west-1.amazonaws.com/fa-sdk-files/index.html` in a native web view launched from your html code, call the following method from your PhoneGap HTML:

```JavaScript
FollowAnalytics.openWebView(URL, TITLE, CLOSE_BUTTON_TEXT);
```

Something like:

```HTML
<a href="#" onclick="FollowAnalytics.openWebView('https://s3-eu-west-1.amazonaws.com/fa-sdk-files/index.html', 'Test Log', 'Close'); return false;">Open WebView with title</a>
```

The `URL` argument will contain the url of the page to display (required), the `TITLE` argument will be shown as the title for the NavigationBar (optional, iOS only), and the `CLOSE_BUTTON_TEXT` will contain the text for the close button (optional, iOS only, defaults to “close”).

Please check the html at `https://s3-eu-west-1.amazonaws.com/fa-sdk-files/index.html` to see how to tag your external pages.

Current available methods are:

- `logEvent(name, details)`
- `logError(name, details)`
- `setUserId(userId)`
- `unsetUserId()`

**NOTE**: if you're tagging from a link and the link has a real `href` set, the SDK will handle that for you, performing the `onclick` action and redirecting you right after.

## Migration and Troubleshooting

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

```
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
