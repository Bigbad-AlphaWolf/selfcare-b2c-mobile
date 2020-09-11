//
//  FollowAnalyticsTypes.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 06/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#ifndef FollowAnalyticsTypes_h
#define FollowAnalyticsTypes_h

#import <Foundation/Foundation.h>
#import <UIKit/UIApplication.h>

/**
 Difrent public types defined across the SDK agregated together agregated together.

 All public types are defined here in order to:

 - make it easyer for the end user to find relevant definitions
 - do not include FollowAnalytics.h in the private implementation files that require such types.
 */

/**
 All API calls are made in one of the two modes:

 - FollowAnalyticsAPIModeProd: the server stores the logs and agregates them in the reports
 - FolloAnalyticsAPIModeDev: the server responds to calls in a relevant way, without storing call
 data. Used during development in order to not poluate production app data with development
 statistics.
 */
typedef NS_ENUM(NSUInteger, FollowAnalyticsAPIMode) {
  FollowAnalyticsAPIModeProd = 0,
  FollowAnalyticsAPIModeDev = 1,
};

/**
 Returns a string representation of FollowAnalyticsAPIMode
 */
NSString* _Nonnull NSStringFromFollowAnalyticsAPIMode(FollowAnalyticsAPIMode c);

/**
 Gender representation used across sdk. It replaces obsolete `FAGender`.

 - FollowAnalyticsGenderUndefined: undefined / unknown gender
 - FollowAnalyticsGenderMale: male
 - FollowAnalyticsGenderFemale: female
 - FollowAnalyticsGenderOther: other
 */

typedef NS_ENUM(NSInteger, FollowAnalyticsGender) {
  FollowAnalyticsGenderUndefined = 0,
  FollowAnalyticsGenderMale = 1,
  FollowAnalyticsGenderFemale = 2,
  FollowAnalyticsGenderOther = 3
};

typedef NS_OPTIONS(NSUInteger, FollowAnalyticsSeverity) {
  FollowAnalyticsSeverityDebug =  1 << 0,
  FollowAnalyticsSeverityInfo = 1 << 1,
  FollowAnalyticsSeverityWarning = 1 << 2,
  FollowAnalyticsSeverityError = 1 << 3,
  FollowAnalyticsSeverityBug = 1 << 4,
};

@class FollowAnalyticsConfiguration;

typedef void (^FollowAnalyticsConfigurationBlock)(
                                                  FollowAnalyticsConfiguration* _Nonnull configuration);

typedef void (^FollowAnalyticsOnConsoleLog)(NSString *__nullable message,
                                            FollowAnalyticsSeverity severity, NSArray<NSString *> *__nullable tags);

@class FAMessage;
@class FACustomButtonInfo;
@class FANotificationInfo;

typedef void (^FollowAnalyticsNotificationTappedHandlerBlock)(FANotificationInfo* __nonnull notificationInfo,
                                                              NSString* __nonnull actionIdentifier);

typedef UIBackgroundFetchResult (^FollowAnalyticsNotificationReceivedHandlerBlock)(FANotificationInfo* __nonnull notificationInfo);

typedef void (^FollowAnalyticsNativeInAppButtonTappedHandlerBlock)(FACustomButtonInfo* __nonnull buttonInfo);

typedef BOOL (^FollowAnalyticsShouldOpenURLHandlerBlock)(NSURL* __nonnull url);

UIKIT_EXTERN NSString* _Nonnull const FANotificationDefaultActionIdentifier;
UIKIT_EXTERN NSString* _Nonnull const FANotificationDismissActionIdentifier;


#endif /* FollowAnalyticsTypes_h */
