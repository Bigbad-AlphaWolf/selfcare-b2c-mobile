//
//  FAPushBase.h
//  FollowApps
//
//  Created by Raphaël El Beze on 15/02/2017.
//  Copyright © 2017 Followanalytics. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FollowAnalyticsPush.h"

@class FAMessage;

/**
 It is the base class for interacting with push system. At the moment, the iOS sdk has two diffrent
  implementations one starting with iOS 10 and another one for iOS 9.
 */

@interface FAPushBase : NSObject <FollowAnalyticsPush>

/**
 Legacy usage only. It is not intednded to be used in new implementations.
 */
@property(nullable, class, nonatomic, readwrite, strong) FAPushBase* shared;

- (void)requestNotificationCenterDefaultAuthorisation;

/**
 Handles incomming deviceTokens after registration. It should use os specific functions to determine
 notification center settings than call
 `updateNotificationsDeviceToken:acceptBadge:acceptSound:acceptAlert`

 @param deviceToken NSData* a device token
 */
- (void)didRegisterForRemoteNotificationsWithDeviceToken:(nullable NSData*)deviceToken;

- (void)updateNotificationsDeviceToken:(nullable NSData*)deviceToken
                           acceptBadge:(BOOL)acceptBadge
                           acceptSound:(BOOL)acceptSound
                           acceptAlert:(BOOL)acceptAlert;

/**
 Handles push registration errors
 */
- (void)application:(nullable UIApplication*)application
  didFailToRegisterForRemoteNotificationsWithError:(nullable NSError*)error;

/**
 Makes an instance of one of the subclassess depending of os version.
 @return
 FAPushBase/Users/adriantofan/devel/fa-sdk-ios/FollowAnalytics/FollowAnalyticsTests/FAPushTests.m:11:9:
 In file included from
 /Users/adriantofan/devel/fa-sdk-ios/FollowAnalytics/FollowAnalyticsTests/FAPushTests.m:11:
 */
+ (nonnull instancetype)newInstance;

// FIXME: remove from 6.0
#pragma mark-- deprecated
+ (nonnull NSArray<FAMessage*>*)all __deprecated_msg("Please use FollowAnalytics.push");
+ (nullable FAMessage*)identifier:(nonnull NSString*)identifier
  __deprecated_msg("Please use FollowAnalytics.push");
+ (BOOL)markAsRead:(nonnull NSArray<NSString*>*)identifiers
  __deprecated_msg("Please use FollowAnalytics.push");
+ (BOOL)markAsUnread:(nonnull NSArray<NSString*>*)identifiers
  __deprecated_msg("Please use FollowAnalytics.push");
+ (BOOL)deleteIdentifiers:(nonnull NSArray<NSString*>*)identifiers
  __deprecated_msg("Please use FollowAnalytics.push");
@end
