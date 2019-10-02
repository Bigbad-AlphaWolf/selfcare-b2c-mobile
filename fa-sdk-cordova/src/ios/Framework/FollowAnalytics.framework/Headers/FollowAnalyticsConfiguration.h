//
//  FAConfiguration.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 04/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <FollowAnalytics/FollowAnalyticsTypes.h>
#import <Foundation/Foundation.h>

@class FollowAnalyticsMutableConfiguration;

typedef void (^FollowAnalyticsConfigurationBlock)(
  FollowAnalyticsMutableConfiguration* _Nonnull configuration);

/**
 Callback for Deep-link paramerters
 */
typedef void (^FollowAnalyticsDeepLinkHandlerBlock)(NSDictionary *_Nullable parameters,
  NSString *__nullable actionIdentifier, NSString *__nullable actionTitle,
  void (^ _Nullable completionHandler)(void));

typedef void (^FollowAnalyticsCustomCamapignHandlerBlock)(NSURL *_Nullable url,
  NSString *__nullable urlTitle, NSDictionary *__nullable params);


/**
 The `openURLBlock` must be called in order to trigger the app link.
 */
typedef void (^FollowAnalyticsDelayedOpenURLHandlerBlock)(void (^__nonnull openURLBlock)(void));

/**
 Development time defaults used by FollowAnalytics.
 */
@interface FollowAnalyticsConfiguration : NSObject <NSCopying, NSMutableCopying>

/**
 Used at first startup to decide if the SDK should send analytics. By default set to TRUE.
 */
@property(nonatomic, readonly, assign) BOOL optInAnalyticsDefault;

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
 Set to true during development in order to have more verbose log output and on screen diagnostic
 display. Default false.

 Can also be overriden at runtime by setting FOLLOW_ANALYTICS_DEBUG_MODE environment variable to
 true or false.
 */
@property(nonatomic, readonly, assign) BOOL debug;

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
 Creates and returns a instance modified inside of the configurationBlock. It builds a mutable
 instance, passes that instance to the configuration block which can modify it as it needs.
 Finnaly returns a nonmutable copy of the mutable instance.

 @warning: runtime variable overrides are still honored.

 @code
  FollowAnalyticsConfiguration *c = [FollowAnalyticsConfiguration
 configurationWith:^(FollowAnalyticsMutableConfiguration * _Nonnull c) { c.optInAnalyticsDefault =
 false;
  }];
 @endcode

 @param configurationBlock convenience configuration block called with a
 FollowAnalyticsMutableConfiguration
 @return a (imutable) instance of FollowAnalyticsConfiguration
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
 Archive all incoming push messages. They are latter avialable with FollowAnalytics.push
 Defaults to FALSE
 */
@property(nonatomic, readonly, assign) BOOL archivePushMessages;

/**
 Archive all incoming inApp messages. They are latter avialable with FollowAnalytics.inApp
 Defaults to FALSE
 */
@property(nonatomic, readonly, assign) BOOL archiveInAppMessages;



/**
 The SDK call this handler when a deep-linking parameters are recieved via push
  messages or in-app button actions.
 */
@property(nullable, nonatomic, readonly, copy) FollowAnalyticsDeepLinkHandlerBlock
  onIncomingDeepLink;

/**
  When a URL is recieved from a notification the SDK uses the UIApplication facillities to open
  the URL as it seems fit. Eiether because the user taped the button triggering the open or because
  the notification just triggers the open.
  If the user implements onOpenURL, it gets a callback that he needs to call in order to trigger
  the actual opening.
  This feature was found usefull when the URLs where deep links towards the same app. If the app
  is not completly loaded at the time of the reception of the notification, the user can chose
  to implement this callback in order to delay the opening.
*/
@property(nullable, nonatomic, readonly, copy) FollowAnalyticsDelayedOpenURLHandlerBlock
  onOpenURL;

/**
  For campaigns, that are not displayed by the SDK, it calls this handler to
  pass the campaign informations. If using, the user must implement it and
  display the campaign by it's own means.
*/
@property(nullable, nonatomic, readonly, copy) FollowAnalyticsCustomCamapignHandlerBlock
  onIncomingCustomCampaign;


@end
