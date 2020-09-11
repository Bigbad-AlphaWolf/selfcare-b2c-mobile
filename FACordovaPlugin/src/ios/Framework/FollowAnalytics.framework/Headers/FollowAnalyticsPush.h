//
//  FollowAnalyticsPush.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 09/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#ifndef FollowAnalyticsPush_h
#define FollowAnalyticsPush_h

#import <Foundation/Foundation.h>

@class FAMessage;

@protocol FollowAnalyticsPush
@required
/**
 Gets All schedule campaign push as message.
 */
- (nonnull NSArray<FAMessage*>*)getAll;

/*!
 Get the specific push as message if found.
 @param identifier The unique identifier of the message.
 */
- (nullable FAMessage*)get:(nonnull NSString*)identifier;

/**
 Mark specific pushes messages as read.
 @param identifiers An array of identifier.
 */
- (void)markAsRead:(nonnull NSArray<NSString*>*)identifiers;

/*!
 Mark specific pushes messages as unread.
 @param identifiers An array of identifier.
 */
- (void)markAsUnread:(nonnull NSArray<NSString*>*)identifiers;

/**
 Delete specific pushes messages.
 @param identifiers An array of identifier.
 */
- (void)deleteIdentifiers:(nonnull NSArray<NSString*>*)identifiers;
@end

#endif /* FollowAnalyticsPush_h */
