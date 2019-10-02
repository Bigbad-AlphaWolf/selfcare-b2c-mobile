//
//  FAGeneralManager.h
//  FollowApps
//
//  Created by Antony Gardez on 17/05/12.
//  Copyright (c) 2012 FollowApps. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "FAConstants.h"

@interface FAGeneralManager : NSObject <CLLocationManagerDelegate> {
  UIBackgroundTaskIdentifier bgTask;
}

// InBox configuration
@property(nonatomic, assign) BOOL isPushInboxAvailable;
@property(nonatomic, assign) BOOL isInAppInboxAvailable;
@property(nonatomic, assign) BOOL isBadgeConfigured;
@property(nonatomic, assign) BOOL geoffencingActive;

// general tools and values
@property(nullable, nonatomic, strong) NSString* FAId;
@property(nullable, nonatomic, strong) NSString* appGroup;

/// Used to form API endpoints for ALL network reauests
@property(nullable, nonatomic, strong) NSString* subdomain;
@property(nullable, nonatomic, strong) NSString* currentUserId;

@property(nonatomic, assign) BOOL isInBackground;
@property(nonatomic, assign) CGSize srceenSize;

- (void)unsetCurrentUserId;

- (BOOL)APIKeySeemsWrong;
- (void)setAPIKeySeemsWrong;

@property(nullable, nonatomic, strong) NSDate* sessionStartTime;
@property(nullable) dispatch_semaphore_t validatorApiKeySemaphore;
@property(nullable) dispatch_semaphore_t contextualBackgroundCampaignSemaphore;

@property(nullable, nonatomic, strong) id _Nullable (^JSONSerializingHelperBlock)(id _Nullable);

// -- helpers
// time allowed in background before considering the current logging session over and starting a new
// one. Default: 60.
@property(nonatomic) NSTimeInterval maxBackgroundTimeWithinSession;
@property(nonatomic) NSTimeInterval minimumRemainingBackgroundActivity;
@property(nonatomic, readonly) NSUInteger numberOfLaunchesBeforeEvaluationPrompt;
@property(nonatomic) NSTimeInterval backgroundTimeRemaining;

- (nullable NSString*)serializationFileName;
+ (void)openUrl:(nullable NSURL*)url;
/********************************************************************************/
#pragma mark - Birth & Death

+ (FAGeneralManager* _Nonnull)sharedGeneralManager;

/********************************************************************************/
#pragma mark - Session Management
- (void)closeSessionIfNeeded;
- (void)startNewSession;
- (void)endSession;
- (NSDictionary* _Nonnull)sessionInfo;
- (void)checkOptOut DEPRECATED_MSG_ATTRIBUTE("Use FAFollowApps.optOutAnalytics");
- (NSDictionary* _Nonnull)sessionInfoForContext:(FASessionContext)sessionContext;

/********************************************************************************/
#pragma mark - Application Lifecycle management

- (void)didEnterBackground;
- (void)willEnterForeground;
- (void)isReallyEnterForeground;

/********************************************************************************/
#pragma mark - Context methods

//- (BOOL)isDebug;
//- (void)setIsDebug:(BOOL)isDebug;
- (NSString* _Nonnull)deviceId;
- (NSString* _Nonnull)APIContext;

@end
