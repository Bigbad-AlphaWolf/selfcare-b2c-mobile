//
//  FAGeneralManager.h
//  FollowApps
//
//  Created by Antony Gardez on 17/05/12.
//  Copyright (c) 2012 FollowApps. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "FAConstants.h"

@interface FAGeneralManager : NSObject

// InBox configuration
@property(nonatomic, assign) BOOL isPushInboxAvailable;
@property(nonatomic, assign) BOOL isInAppInboxAvailable;
@property(nonatomic, assign) BOOL isBadgeConfigured;

// general tools and values
@property(nullable, nonatomic, strong) NSString* FAId;
@property(nullable, nonatomic, strong) NSString* appGroup;

/// Used to form API endpoints for ALL network reauests
@property(nullable, nonatomic, strong) NSString* subdomain;
@property(nullable, nonatomic, strong) NSString* currentUserId;

@property(assign) BOOL isInBackground;
@property(nonatomic, assign) CGSize srceenSize;

- (void)unsetCurrentUserId;

- (BOOL)APIKeySeemsWrong;
- (void)setAPIKeySeemsWrong;

@property(nonatomic) BOOL isNewSessionStarted;
@property(nullable) dispatch_semaphore_t validatorApiKeySemaphore;

// -- helpers
// time allowed in background before considering the current logging session over and starting a new
// one. Default: 60.
@property(nonatomic) NSTimeInterval maxBackgroundTimeWithinSession;
@property(nonatomic) NSTimeInterval minimumRemainingBackgroundActivity;
@property(nonatomic, readonly) NSUInteger numberOfLaunchesBeforeEvaluationPrompt;
@property(nonatomic) NSTimeInterval backgroundTimeRemaining;

- (nullable NSString*)serializationFileName;
+ (void)checkOpenUrl:( NSURL* _Nonnull) url;
+ (void)openUrl:(NSURL* _Nonnull) url;

/********************************************************************************/
#pragma mark - Session Management
- (void)closeSessionIfNeeded;
- (void)initializeSession;
- (void)endSession;
- (NSDictionary* _Nonnull)sessionInfo;
- (void)checkOptOut DEPRECATED_MSG_ATTRIBUTE("Use FAFollowApps.optOutAnalytics");
- (NSDictionary* _Nonnull)sessionInfoForContext:(FASessionContext)sessionContext;
- (void)cancelEndSessionTimer;
- (void)clearEndSessionTimer;

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
