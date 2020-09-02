//
//  FAFollowAnalytics.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 02/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <FollowAnalytics/FABadge.h>
#import <FollowAnalytics/FAMessage.h>
#import <FollowAnalytics/FADataWalletCategory.h>
#import <FollowAnalytics/FADataWalletDataElement.h>
#import <FollowAnalytics/FADataWalletLegalText.h>
#import <FollowAnalytics/FADataWalletPolicy.h>
#import <FollowAnalytics/FADataWalletPolicyTranslation.h>
#import <FollowAnalytics/FADataWalletPurpose.h>
#import <FollowAnalytics/FADataWalletRecipient.h>
#import <FollowAnalytics/FAWKWebViewJSBridge.h>
#import <FollowAnalytics/FollowAnalyticsConfiguration.h>
#import <FollowAnalytics/FollowAnalyticsMutableConfiguration.h>
#import <FollowAnalytics/FollowAnalyticsDataWallet.h>
#import <FollowAnalytics/FollowAnalyticsGDPR.h>
#import <FollowAnalytics/FollowAnalyticsInApp.h>
#import <FollowAnalytics/FollowAnalyticsPush.h>
#import <FollowAnalytics/FollowAnalyticsTypes.h>
#import <FollowAnalytics/FollowAnalyticsUserAttributes.h>
#import <Foundation/Foundation.h>

@interface FollowAnalytics : NSObject

/**
 Configures FollowAnalytics SDK. Must be used before any kind of use.
 
 During startup it swizzles, on the UIApplication delegate, a good part of the methods that are
 present in UIApplicationDelegate protocol. If the original delegate was using some dynamic
 unimplemented selector handling to respond to unimplemented merthods this is no longer going to
 work.
 It also does the same thing on the UNUserNotificationCenter delegate if present, otherwise it sets
 it's own delegate. Continues to monitor for delegate changes and if a new one is set it does the
 method swizzling in order to intercept relevant messages.
 All interepted methods are calling the original implementations except some very specific
 FollowAnalytics functions.

 @param configuration FollowAnalyticsConfiguration
 @param options NSDictionary *options pass launchOptions you get from
 `application:didFinishLaunchingWithOptions`
 @return true is success, false otherwise
 */
+ (BOOL)startWithConfiguration:(nonnull FollowAnalyticsConfiguration*)configuration
                startupOptions:(nullable NSDictionary*)options;

/**
 Used to set the current state of user's opt-in/out from analytics collection. By default the user
 is opted-in, if not overriden in the FollowAnalyticsConfiguration passed to [FollowAnalytics
 startWithConfiguration:startupOptions]. The application can chose to opt-out the user by calling
 [FollowAnalytics setOptInAnalytics:false] at any time.

  The SDK remembers the opt-in state using NSUserDefaults. It is still the responsablity of the
 application to properly set-up the opt-in, according to the choice of the user before sdk
 initialization by passing the appropriate FollowAnalyticsConfiguration to [FollowAnalytics
 startWithConfiguration:startupOptions].

  When opt-out all already collected analytics are still going to be sent as usual.

  After opt-out the SDK will not collect anymore informations such as:

    - analytics
    - user attributes
    - crash reports
 */
+ (void)setOptInAnalytics:(BOOL)optInAnalytics;

/**
 Get the current sate of opt-in analytics.
  */
+ (BOOL)getOptInAnalytics;

/**
 Requests notification center authorisation to display notifications. This method is going
 to prompt the user for his agreement. The implementations is very close to:
 @code
    if (@available(iOS 10.0, *)) {
        UNAuthorizationOptions options =
          UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge;
        [[UNUserNotificationCenter currentNotificationCenter]
          requestAuthorizationWithOptions:options
                        completionHandler:^(BOOL granted, NSError* _Nullable error){

                        }];
      }else{

      UIUserNotificationSettings* notificationSettings = [UIUserNotificationSettings
        settingsForTypes:UIUserNotificationTypeAlert | UIUserNotificationTypeBadge |
                         UIUserNotificationTypeSound
              categories:nil];

      [[UIApplication sharedApplication] registerUserNotificationSettings:notificationSettings];
     }
 @endcode
 This method is intendend to be used for the basic use case. A sofisticated user should use it's
 own implementation as it seems fit, FollowAnalytics iOS SDK shall adapt without intervention.
 
 When using a custom implementation you can specify the alert types, notification categories etc.
 Then, in order to update what the backend knows about the notification center display permissions,
 you must call:
 @code
 [[UIApplication sharedApplication] registerForRemoteNotifications];
 @endcode
 
 As a courtesy to the user and to increase the efficiency of the opt in, it is recomended to launch
 the authorisation process only in a context that is relevant for the user. It is usualy not a good
 practice to run this method blindly at application startup.
 */
+ (void) requestNotificationCenterDefaultAuthorisation;

/*!
 Enables geofencing functions and logs location when available, also prompts the user to accept the
  location monitoring.
 */
+ (void)enableGeoffencing;


/**
 Sets the user id. If called multiple times, the previous value will be overriden.

 @param userId String for the id of the user.
 */
+ (void)setUserId:(nullable NSString*)userId;

/*!
 @return The currently set user indentifier.
 */
+ (nullable NSString*)getUserId;

/**
 Returns the device ID generated by FollowAnalytics, used to uniquely identify a device.
 */
+ (nullable NSUUID*)getDeviceId;

/**
 Logs an event with details associated.

 For instance, you could log that the user went to on a product view by calling `[FollowAnalytics
 logEvent:@"Product View" details:@"Product name"];`. This way you would be able to see which
 products are seen the most.

 Try to use a limited number of event names. Also, remember that the event name you use with the SDK
 can be different from the one shown on the platform (see Analytics > Settings on the platform), and
 that groups of events can be created on the platform, therefore helping you to classify your
 various events.

 @param name The name of the event.
 @param args A string or dictionary giving context about the event you're logging. Please see the
 documentation at https://developer.apple.com/documentation/foundation/nsjsonserialization in order
 to see the valid NSDictionary content.
 */
+ (void)logEvent:(nonnull NSString*)name details:(nullable id)args;

/*!
 Logs an error that occurred, with its name and some context/details.

 For instance, if you encounter an unexpected return value from your web service, you could call
 `[FollowAnalytics logError:@"Unexpected Webservice X value" details:@"the_value"]`.

 Like for events, the name displayed on the platform can be changed from there, et errors groups can
 be created.

 @param name The name of the error.
 @param args A string or dictionary giving context about the error you're logging. Please see the
 documentation at https://developer.apple.com/documentation/foundation/nsjsonserialization in order
 to see the valid NSDictionary content.
 */
+ (void)logError:(nonnull NSString*)name details:(nullable id)args;

/**
 Used to collect user attributes as per FollowAnalyticsUserAttributes protocol
 */
@property(class, nonatomic, readonly, nonnull) id<FollowAnalyticsUserAttributes> userAttributes;

/**
 Used to manage push notification as per FollowAnalyticsPush protocol
 */
@property(class, nonatomic, readonly, nonnull) id<FollowAnalyticsPush> push;

/**
 Used to manage in app campaigns as per FollowAnalyticsInApp protocol.
 */
@property(class, nonatomic, readonly, nonnull) id<FollowAnalyticsInApp> inApp;

/**
  Used to access GDPR functions such as access / delete user data.
 */
@property(class, nonatomic, readonly, nonnull) id<FollowAnalyticsGDPR> GDPR;

/**
 Access DataWallet functionality
 */
@property(class, nonatomic, readonly, nonnull) id<FollowAnalyticsDataWallet> dataWallet;

/**
 FollowAnalytics SDK version number
 */
+ (nonnull NSString*)getVersion;

@end
