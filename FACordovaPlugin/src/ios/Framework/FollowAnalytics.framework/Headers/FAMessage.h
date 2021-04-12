//
//  FAMessage.h
//  FollowApps
//
//  Created by Raphaël El Beze on 04/01/2017.
//  Copyright © 2017 Followanalytics. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UserNotifications/UserNotifications.h>

@interface FAMessage : NSObject

@property(nonatomic, assign, readonly) BOOL isRead;
@property(nonatomic, assign, readonly) BOOL isPush;
@property(nonatomic, assign, readonly) BOOL isSilent;
@property(nonatomic, assign, readonly) BOOL isInApp;

@property(nonatomic, retain, readonly) NSString* identifier;
@property(nonatomic, retain, readonly) NSDate* dateReceived;

@property(nonatomic, retain, readonly) NSString* campaignId __deprecated_msg("Use FAMessage.identifier instead");

@property(nonatomic, retain, readonly, nullable) NSString* notificationId;
@property(nonatomic, retain, readonly) NSString* messageType;
@property(nonatomic, retain, readonly, nullable) NSString* title;
@property(nonatomic, retain, readonly, nullable) NSString* body;
@property(nonatomic, retain, readonly, nullable) NSString* subtitle;
@property(nonatomic, retain, readonly, nullable) NSString* url;
@property(nonatomic, retain, readonly) NSString* layout;
@property(nonatomic, retain, readonly, nullable) NSString* deepLinkUrl;
@property(nonatomic, retain, readonly, nullable) NSDictionary* params;

@property(nonatomic, retain, readonly) NSDictionary* rawData;

@end
