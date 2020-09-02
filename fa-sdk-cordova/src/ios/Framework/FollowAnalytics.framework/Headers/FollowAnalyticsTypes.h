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
NSString* NSStringFromFollowAnalyticsAPIMode(FollowAnalyticsAPIMode c);

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

#endif /* FollowAnalyticsTypes_h */
