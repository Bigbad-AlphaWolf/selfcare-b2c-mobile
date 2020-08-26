//
//  FAInApp.h
//  FollowApps
//
//  Created by Raphaël El Beze on 15/02/2017.
//  Copyright © 2017 Followanalytics. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FAMessage.h"

@interface FAInApp : NSObject

/*!
 Get All schedule campaign inApp as message.
 */
+ (NSArray <FAMessage *> *)all;

/*!
 Get the specific inApp as message.
 @param identifier The unique identifier.
 */
+ (FAMessage *)identifier:(NSString *)identifier;

/*!
 Mark specific inApps messages as read.
 @param identifiers An array of identifier.
 */
+ (BOOL)markAsRead:(NSArray <NSString *> *)identifiers;

/*!
 Mark specific inApps messages as unread.
 @param identifiers An array of identifier.
 */
+ (BOOL)markAsUnread:(NSArray <NSString *> *)identifiers;

/*!
 Delete specific inApps messages.
 @param identifiers An array of identifier.
 */
+ (BOOL)deleteIdentifiers:(NSArray <NSString *> *)identifiers;

@end
