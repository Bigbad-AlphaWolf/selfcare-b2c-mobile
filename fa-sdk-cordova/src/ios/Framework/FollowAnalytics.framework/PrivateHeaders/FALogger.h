//
//  FALogger.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 09/02/2018.
//  Copyright © 2018 Raphaël El Beze. All rights reserved.
//

#import <Foundation/Foundation.h>

// Legacy macros
// Development only logs targeting FADevLogContextDev channel
#define FACLogDev(s, ...) \
  [[FADevLogger shared] logDebugOnChannel:FADevLogContextDev format:s, ##__VA_ARGS__]
// End-user having debug enabled logs
#define FACLogDebug(s, ...) \
  [[FADevLogger shared] logDebugOnChannel:FADevLogContextPub format:s, ##__VA_ARGS__]
// End-user general logs
#define FACLog(s, ...) \
  [[FADevLogger shared] logInfoOnChannel:FADevLogContextPub format:s, ##__VA_ARGS__]

typedef NS_ENUM(NSUInteger, FADevLogContext) {
  /// all nosiy developpment logging
  FADevLogContextDev = 0,
  /// logs targeted to the enduser
  FADevLogContextPub = 1,
  /// sdk loged events
  FADevLogContextSDKActivity = 2,
  FADevLogContextGDPR = 3,
  FADevLogContextDataWalet = 4,
};

typedef NS_OPTIONS(NSUInteger, FADevLogFlag) {
  FADevLogLevelFault = 1 << 0,
  FADevLogLevelInfo = 1 << 1,
  FADevLogLevelError = 1 << 2,
  FADevLogLevelDebug = 1 << 3,
};

NSString* _Nonnull FADevLogFlagStringRepresentation(FADevLogFlag f);

/// @abstract It represents a concrete logging backend
@protocol FADevLogging
///@abstract Log a message for the log level at a given channel
- (void)logMessage:(NSString* _Nonnull)message
             level:(FADevLogFlag)level
           channel:(FADevLogContext)channel;
@end

@protocol FADevLog
- (void)logInfo:(NSString* _Nonnull)message channel:(FADevLogContext)channel;
- (void)logDebug:(NSString* _Nonnull)message channel:(FADevLogContext)channel;
- (void)logError:(NSString* _Nonnull)message channel:(FADevLogContext)channel;
- (void)logFault:(NSString* _Nonnull)message channel:(FADevLogContext)channel;

- (void)logInfoOnChannel:(FADevLogContext)channel format:(NSString* _Nonnull)format, ...;
- (void)logDebugOnChannel:(FADevLogContext)channel format:(NSString* _Nonnull)format, ...;
- (void)logErrorOnChannel:(FADevLogContext)channel format:(NSString* _Nonnull)format, ...;
- (void)logFaultOnChannel:(FADevLogContext)channel format:(NSString* _Nonnull)format, ...;

@end

/**
 By defaults starts unconfigured.
 */
@interface FADevLogger : NSObject <FADevLog>

/**
 Shared instance used for all operations
 */
@property(class, nonatomic, readwrite, strong) FADevLogger* _Nonnull shared;

/**
 Enable a logging backend.
 */
- (void)addLogging:(id<FADevLogging> _Nonnull)logging;

/**
 Enable all log levels up to level

 @param level the last log level that shall be displayed
 */
- (void)enableUpToLevel:(FADevLogFlag)level;

/**
 Enable a logging chanel. Used for granullar logging.

 @param channel FADevLogContext
 */
- (void)enableChannel:(FADevLogContext)channel;
/**
 Disable a logging channel

 @param channel FADevLogContext
 */
- (void)disableChannel:(FADevLogContext)channel;

/**
 Used to determine if a channel is enabled or not.

 @param channel FADevLogContext
 @return true if the channel is enabled
 */
- (BOOL)isChannelEnabled:(FADevLogContext)channel;
/**
  Reset all previous setup.
 */
- (void)reset;

/**
 Configures everything such that the following work as specified:

 - FACLogDev Development only logs targeting FADevLogContextDev channel

 - FACLogDebug End-user having debug enabled logs. FADevLogContextPub up to FADevLogLevelDebug

 - FACLog End-user general logs FADevLogContextPub up to FADevLogLevelInfo
 */
- (void)loadLegacyConfig:(BOOL)debugEnabled developmentEnabled:(BOOL)developmentEnabled;
@end

@interface FADevLoggingNSLog : NSObject <FADevLogging>
@end
