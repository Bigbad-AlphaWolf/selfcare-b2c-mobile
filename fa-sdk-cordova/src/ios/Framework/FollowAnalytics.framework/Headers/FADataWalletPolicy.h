//
//  FADataWalletPolicy.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 23/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FADataWalletPolicyTranslation;
@protocol FADataWalletPolicy <NSObject>

/**
 The policy version such as "1.2" represented as a NSString
 */
@property(nonatomic, readonly, strong, nonnull) NSString* version;

/**
 Contains policy traslations organized by language
 */
@property(nonatomic, readonly, strong, nonnull)
  NSDictionary<NSString*, id<FADataWalletPolicyTranslation>>* translations;

/**
 Complete list of policy translations sorted by technical name
 */
@property(nonatomic, readonly, strong, nonnull)
  NSArray<id<FADataWalletPolicyTranslation>>* translationsArray;
@end
