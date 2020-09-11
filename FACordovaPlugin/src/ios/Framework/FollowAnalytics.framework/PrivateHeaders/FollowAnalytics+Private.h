//
//  FollowAnalytics+Private.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 01/08/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <FollowAnalytics/FollowAnalytics.h>

@interface FollowAnalytics (Private)
+ (nullable NSURL*)APIURL;
/**
 Returns the db path.
 */
+ (nonnull NSString*)applicationDBPath;

/**
 Method to check if the SDK was initialized.
 */
+ (BOOL) isInitialized;

/**
 Displays a notification as an Alert view.
 userInfo : Notification payload
 */
- (void)displayAlertFromNotificationDictionary:(nonnull NSDictionary*)userInfo;

/**
 Returns FollowAnalytics unique instance.
 */
+ (nonnull instancetype)shared;

@end
