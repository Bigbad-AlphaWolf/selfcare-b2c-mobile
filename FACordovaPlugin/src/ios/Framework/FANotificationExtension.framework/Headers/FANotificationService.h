//
//  FANotificationService.h
//  FANotificationExtension
//
//  Created by Raphaël El Beze on 04/05/2017.
//  Copyright © 2017 FollowAnalytics. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UserNotifications/UserNotifications.h>

@interface FANotificationService : NSObject

+ (void)getFAContentIfNeededWithRequest:(UNNotificationRequest *_Nonnull)request bestContent:(UNMutableNotificationContent *_Nonnull)bestContent appGroup:(NSString *_Nullable)appGroup completion:(void (^_Nonnull)(UNMutableNotificationContent * _Nullable))completion;

@end
