//
//  FollowAnalyticsMutableConfiguration.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 04/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import "FollowAnalyticsConfiguration.h"

@interface FollowAnalyticsMutableConfiguration : FollowAnalyticsConfiguration
/**
 Please use [FollowAnalyticsConfiguration configurationWith:configurationBlock] that properly honors
 runtime overides.
 */
- (nonnull instancetype)init NS_UNAVAILABLE;
/**
 Please use [FollowAnalyticsConfiguration configurationWith:configurationBlock] that properly honors
 runtime overides.
 */
+ (nonnull instancetype)new NS_UNAVAILABLE;

@property(nonatomic, readwrite, assign) BOOL isDataWalletEnabled;
@property(nonatomic, readwrite, copy, nullable) void (^onDataWalletPolicyChange)(void);
@property(nonatomic, readwrite, copy, nullable) NSString* dataWalletDefaultPolicyPath;
@property(nonatomic, readwrite, assign) BOOL optInAnalyticsDefault;
@property(nonatomic, readwrite, copy, nonnull) NSString* apiKey;
@property(nonatomic, readwrite, copy, nullable) NSString* appGroup;
@property(nonatomic, readwrite, assign) BOOL debug;
@property(nonatomic, readwrite, assign) BOOL crashReportingEnabled;
@property(nonatomic, readwrite, copy, nullable) NSString* environment;
@property(nonatomic, readwrite, assign) FollowAnalyticsAPIMode apiMode;
@property(nonatomic, readwrite, assign) BOOL appDelegateSwizzle;
@property(nonatomic, readwrite, assign) BOOL archivePushMessages;
@property(nonatomic, readwrite, assign) BOOL archiveInAppMessages;
@property(nonnull, nonatomic, readwrite, copy) FollowAnalyticsDeepLinkHandlerBlock
  onIncomingDeepLink;
@property(nonnull, nonatomic, readwrite, copy) FollowAnalyticsDelayedOpenURLHandlerBlock
  onOpenURL;
@property(nullable, nonatomic, readwrite, copy) FollowAnalyticsCustomCamapignHandlerBlock
  onIncomingCustomCampaign;
@end
