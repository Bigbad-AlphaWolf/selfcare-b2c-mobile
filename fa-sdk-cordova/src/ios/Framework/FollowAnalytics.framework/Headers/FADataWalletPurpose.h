//
//  FADataWalletPurpose.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 24/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FADataWalletDataElement;
@protocol FADataWalletPurpose <NSObject>

@property(nonatomic, readonly, copy, nullable) NSString* title;
@property(nonatomic, readonly, copy, nullable) NSString* purposeDescription;
@property(nonatomic, readonly, copy, nullable) NSString* technicalName;

/**
 The technical names of the recipients that this policy refers to.
 */
@property(nonatomic, readonly, nonnull) NSArray<NSString*>* recipientTechnicalNames;
@end
