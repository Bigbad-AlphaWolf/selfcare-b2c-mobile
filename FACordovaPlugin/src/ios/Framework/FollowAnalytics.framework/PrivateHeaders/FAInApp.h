//
//  FAInApp.h
//  FollowApps
//
//  Created by Raphaël El Beze on 15/02/2017.
//  Copyright © 2017 Followanalytics. All rights reserved.
//

#import <FollowAnalytics/FollowAnalyticsInApp.h>
#import <Foundation/Foundation.h>

@class FAMessage;

@interface FAInApp : NSObject <FollowAnalyticsInApp>

/*!
 Get All schedule campaign inApp as message.
 */
+ (nonnull NSArray<FAMessage*>*)all __deprecated;

/*!
 Get the specific inApp as message.
 @param identifier The unique identifier.
 */
+ (nullable FAMessage*)identifier:(nonnull NSString*)identifier __deprecated;

/*!
 Mark specific inApps messages as read.
 @param identifiers An array of identifier.
 */
+ (BOOL)markAsRead:(nonnull NSArray<NSString*>*)identifiers __deprecated;

/*!
 Mark specific inApps messages as unread.
 @param identifiers An array of identifier.
 */
+ (BOOL)markAsUnread:(nonnull NSArray<NSString*>*)identifiers __deprecated;

/*!
 Delete specific inApps messages.
 @param identifiers An array of identifier.
 */
+ (BOOL)deleteIdentifiers:(nonnull NSArray<NSString*>*)identifiers __deprecated;

@end
