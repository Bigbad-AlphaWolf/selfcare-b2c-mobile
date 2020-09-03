//
//  FAPush.h
//  FollowApps
//
//  Created by Raphaël El Beze on 15/02/2017.
//  Copyright © 2017 Followanalytics. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FAMessage.h"

@interface FAPush : NSObject
/*!
 Get All schedule campaign push as message.
 */
+ (NSArray <FAMessage *> *)all;

/*!
 Get the specific push as message.
 @param identifier The unique identifier.
 */
+ (FAMessage *)identifier:(NSString *)identifier;

/*!
 Mark specific pushes messages as read.
 @param identifiers An array of identifier.
 */
+ (BOOL)markAsRead:(NSArray <NSString *> *)identifiers;

/*!
 Mark specific pushes messages as unread.
 @param identifiers An array of identifier.
 */
+ (BOOL)markAsUnread:(NSArray <NSString *> *)identifiers;

/*!
 Delete specific pushes messages.
 @param identifiers An array of identifier.
 */
+ (BOOL)deleteIdentifiers:(NSArray <NSString *> *)identifiers;

@end
