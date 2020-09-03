//
//  FADataWalletDataElement.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 25/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FADataWalletCategory;
@protocol FADataWalletDataElement <NSObject>

@property(nonatomic, readonly, copy, nonnull) NSString* technicalName;
@property(nonatomic, readonly, copy, nullable) NSString* title;
/**
 the technical name of the category where this recipient is part of
 */
@property(nonatomic, readonly, copy, nullable) NSString* categoryTechnicalName;

@end
