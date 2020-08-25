//
//  FADataWalletCategory.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 24/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FADataWalletCategory <NSObject>

@property(nonatomic, readonly, copy, nullable) NSString* title;
@property(nonatomic, readonly, copy, nullable) NSString* categoryDescription;
@property(nonatomic, readonly, copy, nullable) NSString* technicalName;

@end
