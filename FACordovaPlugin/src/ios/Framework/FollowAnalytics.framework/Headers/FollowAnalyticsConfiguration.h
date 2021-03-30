//
//  FollowAnalyticsConfiguration.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 04/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <FollowAnalytics/FollowAnalyticsImmutableConfiguration.h>

@interface FollowAnalyticsConfiguration : FollowAnalyticsImmutableConfiguration
/**
 Please use [FollowAnalyticsImmutableConfiguration configurationWith:configurationBlock] that properly honors
 runtime overides.
 */
- (nonnull instancetype)init NS_UNAVAILABLE;
/**
 Please use [FollowAnalyticsImmutableConfiguration configurationWith:configurationBlock] that properly honors
 runtime overides.
 */
+ (nonnull instancetype)new NS_UNAVAILABLE;

@property(nonatomic, readwrite, copy, nullable) NSString* dataWalletDefaultPolicyPath;
@property(nonatomic, readwrite, assign) BOOL optInAnalyticsDefault;
@property(nonatomic, readwrite, assign) BOOL optInNotificationsDefault;
@property(nonatomic, readwrite, copy, nonnull) NSString* apiKey;
@property(nonatomic, readwrite, copy, nullable) NSString* appGroup;
@property(nonatomic, readwrite, copy, nullable) NSString* keychainGroupName;
@property(nonatomic, readwrite, assign) BOOL isVerbose;
@property(nonatomic, readwrite, assign) BOOL crashReportingEnabled;
@property(nonatomic, readwrite, copy, nullable) NSString* environment;
@property(nonatomic, readwrite, copy, nullable) NSString* environmentProtocol;
@property(nonatomic, readwrite, copy, nullable) NSString* environmentDomain;
@property(nonatomic, readwrite, assign) BOOL hasEnvironementSubdomain;
@property(nonatomic, readwrite, assign) FollowAnalyticsAPIMode apiMode;
@property(nonatomic, readwrite, assign) BOOL swizzlingEnabled;
@property(nonatomic, readwrite, assign) BOOL archivePushMessages;
@property(nonatomic, readwrite, assign) BOOL archiveInAppMessages;
@property(nonnull, nonatomic, readwrite, copy) FollowAnalyticsNotificationTappedHandlerBlock
  onNotificationTapped;
@property(nonatomic, readwrite, assign) NSTimeInterval maxBackgroundTimeWithinSession;
@property(nullable, nonatomic, readwrite, copy) FollowAnalyticsOnConsoleLog
onConsoleLog;
@property(nullable, nonatomic, readwrite, copy) FollowAnalyticsNotificationReceivedHandlerBlock
onNotificationReceived;
@property(nullable, nonatomic, readwrite, copy) FollowAnalyticsNativeInAppButtonTappedHandlerBlock
onNativeInAppButtonTapped;
@property(nullable, nonatomic, readwrite, copy) FollowAnalyticsShouldOpenURLHandlerBlock shouldOpenURL;
@property(nonatomic, readwrite, assign) BOOL lastKnownLocationEnabled;

#pragma mark-- deprecated

@property(nonatomic, readwrite, assign) BOOL isDataWalletEnabled __deprecated_msg("DataWallet feature is disabled");
@property(nonatomic, readwrite, copy, nullable) void (^onDataWalletPolicyChange)(void) __deprecated_msg("DataWallet feature is disabled");

@end
