//
//  FAConfiguration.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 04/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <FollowAnalytics/FollowAnalyticsTypes.h>
#import <Foundation/Foundation.h>

@interface FollowAnalyticsImmutableConfiguration : NSObject <NSCopying, NSMutableCopying>

/**
 Used at first startup to decide if the SDK should send analytics. By default set to TRUE.
 */
@property(nonatomic, readonly, assign) BOOL optInAnalyticsDefault;

/**
 Used at first startup to decide if the SDK should receive notifications. By default set to TRUE.
 */
@property(nonatomic, readonly, assign) BOOL optInNotificationsDefault;

/**
 Set to true if using DataWallet. By default set to FALSE.
 */
@property(nonatomic, readonly, assign) BOOL isDataWalletEnabled;

/**
 Called automaticaly(on the main thread) when there is a major DataWallet policy update.
 */
@property(nonatomic, readonly, copy, nullable) void (^onDataWalletPolicyChange)(void);

/**
  If a default policy needs to be embeded in the app, points to the path where the policy can
  be found. It is presented as the default policy instead of the default empty one. By default is
  NULL;
*/
@property(nonatomic, readonly, copy, nullable) NSString* dataWalletDefaultPolicyPath;

/**
 The API key coresponding to this apps bundle identifier as defined on the FollowAnlaytics.com
 backoffice. Default NULL, must be set before use.
 */
@property(nonatomic, readonly, copy, nonnull) NSString* apiKey;

/**
 The app group shared with the notification extension if any (needed for the badge management).
 Default NULL.
 */
@property(nonatomic, readonly, copy, nullable) NSString* appGroup;

/**
The team access group shared across applications of the same team id.
Default NULL.
*/
@property(nonatomic, readonly, copy, nullable) NSString* keychainGroupName;

/**
 Set to true during development in order to have more verbose log output and on screen diagnostic
 display. Default false.

 Can also be overriden at runtime by setting FOLLOW_ANALYTICS_DEBUG_MODE environment variable to
 true or false.
 */
@property(nonatomic, readonly, assign) BOOL isVerbose;

/**
 All API calls are made in one of the two modes:

 - FollowAnalyticsAPIModeProd: the server stores the logs and agregates them in the reports

 - FollowAnalyticsAPIModeDev: the server responds to calls in a relevant way, without storing call
 data. Used during development in order to not poluate production app data with development
 statistics.

 It defaults to:

 - on the simulator is FollowAnalyticsAPIModeDev

 - when debug is on : FollowAnalyticsAPIModeDev

 - otherwise FollowAnalyticsAPIModeProd

 Can also be overriden at runtime by setting FOLLOW_ANALYTICS_API_MODE environment variable to the
 value of on of FollowAnalyticsAPIModeProd or FollowAnalyticsAPIModeDev.
 */
@property(nonatomic, readonly, assign) FollowAnalyticsAPIMode apiMode;

/**
 Enable and disable crash reporting. Default true.
 */
@property(nonatomic, readonly, assign) BOOL crashReportingEnabled;

/**
 Current api environment "" = prod. For the time being, the obsolete (since version 5.4)
 [FAFollowApps setEnvironment:], if used, takes precedence over FolloAnalyticsConfiguration
 */
@property(nullable, nonatomic, readonly, copy) NSString* environment;

/**
 Current api environmentProtocol = https.
 */
@property(nullable, nonatomic, readonly, copy) NSString* environmentProtocol;

/**
 Current api environmentDomain = follow-apps.com. 
 */
@property(nullable, nonatomic, readonly, copy) NSString* environmentDomain;

/**
 Current api environmentDomain = follow-apps.com.
 */
@property(nonatomic, readonly, assign) NSTimeInterval maxBackgroundTimeWithinSession;


/**
 Creates and returns a instance modified inside of the configurationBlock. It builds a mutable
 instance, passes that instance to the configuration block which can modify it as it needs.
 Finnaly returns a nonmutable copy of the mutable instance.

 @warning: runtime variable overrides are still honored.

 @code
  FollowAnalyticsImmutableConfiguration *c = [FollowAnalyticsImmutableConfiguration
 configurationWith:^(FollowAnalyticsConfiguration * _Nonnull c) { c.optInAnalyticsDefault =
 false;
  }];
 @endcode

 @param configurationBlock convenience configuration block called with a
 FollowAnalyticsConfiguration
 @return a (imutable) instance of FollowAnalyticsImmutableConfiguration
 */
+ (nonnull instancetype)configurationWith:
  (nonnull FollowAnalyticsConfigurationBlock)configurationBlock;

/**
 replacement for
 - (void)followAppsShouldHandleParameters:(NSDictionary* _Nullable)customParameters
                        actionIdentifier:(NSString* _Nullable)actionIdentifier
                             actionTitle:(NSString* _Nullable)actionTitle
                       completionHandler:(void (^_Nullable)(void))completionHandler;
 */

/**
 FollowAnalytics would normaly need to act as UIAppDelegate in order to function. In order to avoid
 that, it will replace a set of the methods of the [[UIApplication sharedApplication] delegate] with
 its implementations. These implementations are calling the original ones as needed.
 This will default to true. If this is not the desired behavior, change it to false.
 When set to false, you'll need to call FollowAnalytics implementation of the UIAppDelegate methods
 when they are called by the system framework.
 */
@property(nonatomic, readonly, assign) BOOL swizzlingEnabled;

/**
 Archive all incoming push messages. They are latter avialable with FollowAnalytics.push
 Defaults to FALSE
 */
@property(nonatomic, readonly, assign) BOOL archivePushMessages;

/**
 Archive all incoming inApp messages. They are latter avialable with FollowAnalytics.inApp
 Defaults to FALSE
 */
@property(nonatomic, readonly, assign) BOOL archiveInAppMessages;


@property(nonnull, nonatomic, readonly, copy) FollowAnalyticsNotificationTappedHandlerBlock
onNotificationTapped;

/**
 For campaigns, that are not displayed by the SDK, it calls this handler to
 pass the campaign informations. If using, the user must implement it and
 display the campaign by it's own means.
 */
@property(nullable, nonatomic, readonly, copy) FollowAnalyticsOnConsoleLog
onConsoleLog;


@property(nullable, nonatomic, readonly, copy) FollowAnalyticsNotificationReceivedHandlerBlock
onNotificationReceived;


/**
 For native pop up, that are not displayed by the SDK, it calls this handler when
 user tap in a button different from dismiss
 */
@property(nullable, nonatomic, readonly, copy) FollowAnalyticsNativeInAppButtonTappedHandlerBlock
onNativeInAppButtonTapped;


/**
  When user tap into a link, the SDK calls this handler when is about to open the URL.
 */
@property(nullable, nonatomic, readonly, copy) FollowAnalyticsShouldOpenURLHandlerBlock
shouldOpenURL;

/**
 The logging of the last known location when the session start is an explicit option and only logs it if the developer has set this option to true.
 Defaults to FALSE
 */
@property(nonatomic, readonly, assign) BOOL lastKnownLocationEnabled;

@end
