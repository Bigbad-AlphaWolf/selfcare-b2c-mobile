//
//  FollowAnalytics.h
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
#import <FollowAnalytics/FollowAnalyticsImmutableConfiguration.h>
#import <FollowAnalytics/FollowAnalyticsConfiguration.h>
#import <FollowAnalytics/FollowAnalyticsDataWallet.h>
#import <FollowAnalytics/FollowAnalyticsGDPR.h>
#import <FollowAnalytics/FollowAnalyticsInApp.h>
#import <FollowAnalytics/FollowAnalyticsPush.h>
#import <FollowAnalytics/FollowAnalyticsTypes.h>
#import <FollowAnalytics/FollowAnalyticsUserAttributes.h>
#import <FollowAnalytics/FACustomButtonInfo.h>
#import <FollowAnalytics/FANotificationInfo.h>
#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

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

 @param configuration FollowAnalyticsImmutableConfiguration
 @param options NSDictionary *options pass launchOptions you get from
 `application:didFinishLaunchingWithOptions`
 @return true is success, false otherwise
 */
+ (BOOL)startWithConfiguration:(nonnull FollowAnalyticsConfiguration*)configuration
                startupOptions:(nullable NSDictionary*)options;

/**
 Used to set the current state of user's opt-in/out from analytics collection. By default the user
 is opted-in, if not overriden in the FollowAnalyticsImmutableConfiguration passed to [FollowAnalytics
 startWithConfiguration:startupOptions]. The application can chose to opt-out the user by calling
 [FollowAnalytics setOptInAnalytics:false] at any time.

  The SDK remembers the opt-in state using NSUserDefaults. It is still the responsablity of the
 application to properly set-up the opt-in, according to the choice of the user before sdk
 initialization by passing the appropriate FollowAnalyticsImmutableConfiguration to [FollowAnalytics
 startWithConfiguration:startupOptions].

  When opt-out all already collected analytics are still going to be sent as usual.

  After opt-out the SDK will not collect anymore informations such as:

    - analytics
    - user attributes
    - crash reports
 */
+ (void)setOptInAnalytics:(BOOL)state;

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
+ (void) requestNotificationAuthorization;

/**
 In iOS 12, it was introduced provisional authorization, and this is an automatic trial of the
 notifications for apps. This will help users make a more informed decision on whether they want
 these notifications or not. With this, users will not get the authorization prompt, instead, the
 notifications will automatically start getting delivered. But these notifications will be delivered
 quietly and will only show up in notifications center, and they will not play a sound.
*/
+ (void) requestProvisionalNotificationAuthorization API_AVAILABLE(ios(12));

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
 Logs an event with a given name and details.
 
 See our documentation at https://dev.followanalytics.com/sdks/ios/documentation/#tagging-events-and-errors
 for more information.

 @param name The name of the event.
 @param details A string or dictionary providing context about the logged event.
 */
+ (void)logEvent:(nonnull NSString*)name details:(nullable id)details;

/*
 Logs an error with a given name and details.
 
 See our documentation at https://dev.followanalytics.com/sdks/ios/documentation/#tagging-events-and-errors
 for more information.

 @param name The name of the error.
 @param details A string or dictionary providing context about the logged error.
 */
+ (void)logError:(nonnull NSString*)name details:(nullable id)details;

/**
 Logs a geo location.

 @param latitude The latitude of the logged location.
 @param longitude The longitude of the logged location.
 */
+ (void)logLocationWithLatitude:(double)latitude longitude:(double)longitude;

/**
 Logs a geo location.
 
 @param location The CLLocation to log.
 */
+ (void)logLocation:(nonnull CLLocation*)location;

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
+ (nonnull NSString*)getSDKVersion;

/**
 FollowAnalytics SDK platform
 */
+ (nonnull NSString*)getSDKPlatform;


#pragma mark-- deprecated
/**
 FollowAnalytics SDK version number
 */
+ (nonnull NSString*)getVersion __deprecated_msg("Please use FollowAnalytics.getSDKVersion()");

#pragma mark - Manual Swizzling - This methods needs to be called on the Application Delegate class.

+ (void) application:(UIApplication*_Nonnull) application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData*_Nonnull) deviceToken;

+ (void) applicationDidEnterBackground:(UIApplication*_Nonnull) application;

+ (void) applicationWillEnterForeground:(UIApplication*_Nonnull)application;

+ (void) applicationDidBecomeActive:(UIApplication*_Nonnull)application;

+ (void) applicationWillTerminate:(UIApplication*_Nonnull)application;

+ (void) applicationDidReceiveMemoryWarning:(UIApplication*_Nonnull) application;

+ (void) application:(UIApplication*_Nonnull) application
didReceiveRemoteNotification:(NSDictionary*_Nullable) userInfo;

+ (void) application:(UIApplication*_Nonnull) application
handleActionWithIdentifier:(NSString*_Nullable) identifier
forRemoteNotification:(NSDictionary*_Nonnull) userInfo
   completionHandler:(void (^_Nullable)(void)) completionHandler;

+ (void) application:(UIApplication*_Nonnull) application
handleActionWithIdentifier:(NSString*_Nullable) identifier
forLocalNotification:(UILocalNotification*_Nonnull) notification
   completionHandler:(void (^_Nullable)(void)) completionHandler;

+ (BOOL) application:(UIApplication*_Nonnull) application handleOpenURL:(NSURL*_Nonnull) url;

+ (BOOL) application:(UIApplication*_Nonnull) application
             openURL:(NSURL*_Nonnull) url
   sourceApplication:(NSString*_Nullable) sourceApplication
          annotation:(id _Nonnull) annotation;

+ (BOOL) application:(UIApplication*_Nonnull) app openURL:(NSURL*_Nonnull) url options:(NSDictionary<id, id>* _Nullable) options;

+ (void) application:(UIApplication*_Nonnull) application
didReceiveLocalNotification:(UILocalNotification*_Nonnull) notification;

// Check Swizzler!
+ (void) application:(UIApplication*_Nonnull) application
performFetchWithCompletionHandler:(void (^_Nullable)(UIBackgroundFetchResult)) completionHandler;

+ (void) application:(UIApplication*_Nonnull) application
didReceiveRemoteNotification:(NSDictionary*_Nonnull) userInfo
fetchCompletionHandler:(void (^_Nonnull)(UIBackgroundFetchResult)) completionHandler;

// Check Swizzler!
+ (void) application:(UIApplication*_Nonnull) application
handleEventsForBackgroundURLSession:(NSString*_Nonnull) identifier
   completionHandler:(void (^_Nullable)(void)) completionHandler;

// MARK :- NotificationCenter

+ (void) userNotificationCenter:(UNUserNotificationCenter*_Nonnull) center
 didReceiveNotificationResponse:(UNNotificationResponse*_Nonnull) response
          withCompletionHandler:(void (^_Nullable)(void)) completionHandler API_AVAILABLE(ios(10.0));

+ (void) userNotificationCenter:(UNUserNotificationCenter*_Nonnull) center
        willPresentNotification:(UNNotification*_Nonnull) notification
          withCompletionHandler:(void (^_Nullable)(UNNotificationPresentationOptions)) completionHandler  API_AVAILABLE(ios(10.0));

@end
