//
//  FADataWalletLegalText.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 24/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FADataWalletLegalText <NSObject>

@property(nonatomic, readonly, strong, nullable) NSString* title;
@property(nonatomic, readonly, strong, nullable) NSString* text;
@property(nonatomic, readonly, strong, nullable) NSString* technicalName;

@end
