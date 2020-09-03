//
//  FADataWalletPolicyTranslation.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 23/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FADataWalletLegalText;
@protocol FADataWalletCategory;
@protocol FADataWalletRecipient;
@protocol FADataWalletPurpose;
@protocol FADataWalletDataElement;
@protocol FADataWalletDataCategory;

@protocol FADataWalletPolicyTranslation <NSObject>

/**
 The language used for this translation. Such as @"en".
 */
@property(nonatomic, readonly, copy, nonnull) NSString* languageCode;

/**
 The policy's title.
 */
@property(nonatomic, readonly, copy, nullable) NSString* title;

/**
 All the legal texts, organised by technical name.
 */
@property(nonatomic, readonly, copy, nonnull)
  NSDictionary<NSString*, id<FADataWalletLegalText>>* legalTexts;

/**
  All the legal texts as an array, sorted by technical name.
 */
@property(nonatomic, readonly, copy, nonnull) NSArray<id<FADataWalletLegalText>>* legalTextsArray;

/**
 All data categories defined in this translation organized by technical name
 */
@property(nonatomic, readonly, copy, nonnull)
  NSDictionary<NSString*, id<FADataWalletCategory>>* categories;
/**
 All data categories defined in this translation sorted by technical name
 */
@property(nonatomic, readonly, copy, nonnull) NSArray<id<FADataWalletCategory>>* categoriesArray;

/**
 All data recipients defined in this translation organized by technical name
 */
@property(nonatomic, readonly, copy, nonnull)
  NSDictionary<NSString*, id<FADataWalletRecipient>>* recipients;

/**
 All data recipients defined in this translation sorted by technical name
 */
@property(nonatomic, readonly, copy, nonnull) NSArray<id<FADataWalletRecipient>>* recipientsArray;

/**
 All data purposes defined in this translation organized by technical name
 */
@property(nonatomic, readonly, copy, nonnull)
  NSDictionary<NSString*, id<FADataWalletPurpose>>* purposes;

/**
 All data purposes defined in this translation sorted by technical name
 */
@property(nonatomic, readonly, copy, nonnull) NSArray<id<FADataWalletPurpose>>* purposesArray;

/**
 Given one of its own pourposes, it will return all the data elements that corespond to a recipient

 @param purpose a pourpose which is part of this policy translation
 @param recipientTechnicalName a data wallet recipient technical name
 @return an array of FADataWalletDataElement
 */
- (nonnull NSArray<id<FADataWalletDataElement>>*)
  getPurposeDataElements:(nonnull id<FADataWalletPurpose>)purpose
  recipientTechnicalName:(nonnull NSString*)recipientTechnicalName;

/**
 Given one of its own recipients, it will return all the data categoryes that the recipient referes
 to.

 @param recipient a recipient which is part of this policy translation
 @return an array of FADataWalletDataCategory
 */
- (nonnull NSArray<id<FADataWalletDataCategory>>*)getCategoriesForRecipient:
  (nonnull id<FADataWalletRecipient>)recipient;

@end
