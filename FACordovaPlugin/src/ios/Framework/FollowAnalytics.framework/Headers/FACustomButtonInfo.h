//
//  FACustomButton.h
//  FollowAnalytics
//
//  Created by Claude Joseph-Angélique on 10/08/2019.
//  Copyright © 2019 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, FACustomButtonIdentifier) {
  FACustomButtonIdentifierUndefined = 0,
  FACustomButtonIdentifierNativeAlert1 = 1,
  FACustomButtonIdentifierNativeAlert2 = 2
};

NS_ASSUME_NONNULL_BEGIN

@interface FACustomButtonInfo : NSObject

@property(nonatomic, readonly) FACustomButtonIdentifier identifier;
@property(nonatomic, readonly, nullable) NSURL *url;
@property(nonatomic, readonly, nullable) NSDictionary *parameters;

- (instancetype)init NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
