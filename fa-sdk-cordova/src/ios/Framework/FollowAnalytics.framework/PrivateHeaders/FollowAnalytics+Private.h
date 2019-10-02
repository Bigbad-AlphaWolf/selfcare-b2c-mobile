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
@end
