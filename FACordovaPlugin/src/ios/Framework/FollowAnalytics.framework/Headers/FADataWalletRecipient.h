//
//  FADataWalletRecipient.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 24/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FADataWalletDataElement
, FADataWalletDataCategory;

@protocol FADataWalletRecipient <NSObject>

@property(nonatomic, readonly, copy, nullable) NSString* title;
@property(nonatomic, readonly, copy, nullable) NSString* recipientDescription;
@property(nonatomic, readonly, copy, nonnull) NSString* technicalName;

/**
 All the data categories where this recipients referes to.
 */
@property(nonatomic, readonly, nonnull) NSArray<id<FADataWalletDataCategory>>* categories;

/**
 An array containing all the data elements isted in this recipient.
 */
@property(nonatomic, readonly, nonnull) NSArray<id<FADataWalletDataElement>>* dataElements;

/**
 A subset of data elements, filtered by category technical name

 @param technicalName the technical name of the data wallet category
 @return the filtered dataElements
 */
- (nonnull NSArray<id<FADataWalletDataElement>>*)getDataElementsByCategoryTechnicalName:
  (nonnull NSString*)technicalName;

@end
