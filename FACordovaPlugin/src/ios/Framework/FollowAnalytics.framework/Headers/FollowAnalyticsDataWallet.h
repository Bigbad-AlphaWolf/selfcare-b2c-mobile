//
//  FollowAnalyticsDataWallet.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 23/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FADataWalletPolicy;

@protocol FollowAnalyticsDataWallet
@required

/**
 Returns the latest policy it has. If a policy is not (yet) avialable it will return the default one
 having version "0.0"

 @return a valid FADataWalletPolicy.
 */
- (nonnull id<FADataWalletPolicy>)getPolicy;

/**
 Checks if the current policy version major version differs from the version that the user has
 previously accepted.

 @return Returns true if the major version is the same with the previously read one or if the
 current policy has major version 0. Returns false otherwise.
 */
- (BOOL)isRead;

/**
 The sdk keeps track of the latest read policy version. When calling this method with TRUE it will
 set the last read policy version to current policy version. Calling it with FALSE clears the last
 read policy version.

 @param isRead true to mark it as read, false to clear it.
 */
- (void)setIsRead:(BOOL)isRead;

/**
  true if enabled at startup, false otherwise
*/
@property(nonatomic, readonly, assign) BOOL isEnabled;

@end
