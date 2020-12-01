//
//  FollowAnalyticsInApp.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 09/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#ifndef FollowAnalyticsInApp_h
#define FollowAnalyticsInApp_h

#import <Foundation/Foundation.h>

@class FAMessage;

@protocol FollowAnalyticsInApp
@required
/**
 Pauses inapp campaigns display
 */
- (void)pauseCampaignDisplay;

/**
 Resumes previously paused inapp campaigns
 */
- (void)resumeCampaignDisplay;

/**
 Get All schedule campaign inApp as FAMessage.
 */
- (nonnull NSArray<FAMessage*>*)getAll;

/**
 Get the specific inApp as FAMessage.
 @param identifier The unique identifier.
 */
- (nullable FAMessage*)get:(nonnull NSString*)identifier;

/**
 Mark specific inApps messages as read.
 @param identifiers An array of identifier.
 */
- (void)markAsRead:(nonnull NSArray<NSString*>*)identifiers;

/**
 Mark specific inApps messages as unread.
 @param identifiers An array of identifier.
 */
- (void)markAsUnread:(nonnull NSArray<NSString*>*)identifiers;

/**
 Delete specific inApps messages.
 @param identifiers An array of identifier.
 */
- (void)deleteIdentifiers:(nonnull NSArray<NSString*>*)identifiers;
@end

#endif /* FollowAnalyticsInApp_h */
