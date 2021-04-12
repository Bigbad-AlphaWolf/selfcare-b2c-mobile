//
//  FANotificationInfo.h
//  FollowAnalytics
//
//  Created by Claude Joseph-Angélique on 14/08/2019.
//  Copyright © 2019 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface FANotificationInfo : NSObject

@property(nonatomic, readonly, nonnull) NSString *messageId;
@property(nonatomic, readonly) BOOL isSilent;
@property(nonatomic, readonly, nullable) NSURL *url;
@property(nonatomic, readonly, nullable) NSDictionary *parameters;

@property(nonatomic, readonly, nonnull) NSString *campaignId __deprecated_msg("Use FANotificationInfo.messageId instead");

- (instancetype)init NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
