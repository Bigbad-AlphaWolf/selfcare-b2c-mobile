//
//  FAUserAttributes.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 04/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <FollowAnalytics/FollowAnalyticsTypes.h>
#import <Foundation/Foundation.h>

@protocol FollowAnalyticsUserAttributes <NSObject>

@required
/**
 Sets the user first name. If called multiple times, the previous value will be overriden.
 If you want to remove the user first name, pass nil in parameter.

 @param firstName String for the first name of the user.
 */
- (void)setFirstName:(nullable NSString*)firstName;

/**
 Sets the user last name. If called multiple times, the previous value will be overriden.
 If you want to remove the user last name, pass nil in parameter.

 @param lastName String for the last name of the user.
 */
- (void)setLastName:(nullable NSString*)lastName;

/**
 Sets the user email. If called multiple times, the previous value will be overriden.
 If you want to remove the user email, pass nil in parameter.

 @param email String for the email of the user.
 */
- (void)setEmail:(nullable NSString*)email;

/**
 Sets the user date of birth. If called multiple times, the previous value will be overriden.
 If you want to remove the user date of birth, pass nil in parameter.

 @param dateOfBirth Date for the date of birth of the user.
 */
- (void)setDateOfBirth:(nullable NSDate*)dateOfBirth;

/**
 Sets the user gender. If called multiple times, the previous value will be overriden.
 If you want to remove the user gender, pass FollowAnalyticsGenderUndefined in parameter.

 @param gender FollowAnalyticsGender for the gender of the user.
 */
- (void)setGender:(FollowAnalyticsGender)gender;

/**
 Sets the user country. If called multiple times, the previous value will be overriden.
 If you want to remove the user country, pass nil in parameter.

 @param country String for the country of the user.
 */
- (void)setCountry:(nullable NSString*)country;

/**
 Sets the user city. If called multiple times, the previous value will be overriden.
 If you want to remove the user city, pass nil in parameter.

 @param city String for the city of the user.
 */
- (void)setCity:(nullable NSString*)city;

/**
 Sets the user region. If called multiple times, the previous value will be overriden.
 If you want to remove the user region, pass nil in parameter.

 @param region String for the region of the user.
 */
- (void)setRegion:(nullable NSString*)region;

/**
 Sets the user profile picture url. If called multiple times, the previous value will be overriden.
 If you want to remove the user profile picture, pass nil in parameter.

 @param profilePictureUrl String for the profile picture url of the user.
 */
- (void)setProfilePictureUrl:(nullable NSString*)profilePictureUrl;

/**
 *  Set a value of type NSInteger for a custom User Attribute
 *
 *  @param integerValue NSInteger value
 *  @param key    Custom attribute key
 */
- (void)setInteger:(NSInteger)integerValue forKey:(nonnull NSString*)key;

/**
 *  Set a value of type double for a custom User Attribute
 *
 *  @param doubleValue double value
 *  @param key    Custom attribute key
 */
- (void)setDouble:(double)doubleValue forKey:(nonnull NSString*)key;

/**
 *  Set a value of type NSString for a custom User Attribute
 *
 *  @param string NSString value
 *  @param key    Custom attribute key
 */

- (void)setString:(nonnull NSString*)string forKey:(nonnull NSString*)key;
/**
 *  Set a value of type bool for a custom User Attribute
 *
 *  @param boolean bool value
 *  @param key    Custom attribute key
 */
- (void)setBoolean:(bool)boolean forKey:(nonnull NSString*)key;

/**
 *  Set a date value, having format: 'YYYY-MM-DD', for a custom User Attribute
 *
 *  @param date NSDate
 *  @param key  Custom attribute key
 */
- (void)setDate:(nonnull NSDate*)date forKey:(nonnull NSString*)key;

/**
 *  Set a date with timee value ', for a custom User Attribute
 *
 *  @param dateTime NSDate
 *  @param key Custom attribute key
 */
- (void)setDateTime:(nonnull NSDate*)dateTime forKey:(nonnull NSString*)key;

/**
 Clears the atribute specified in key.

 @param key the key to remove
 */
- (void)clear:(nonnull NSString*)key;

/**
 Adds a nsset of values in a set stored at key.

 @param values NSSet<NSString *>
 @param key key Custom attribute key
 */
- (void)add:(nonnull NSSet<NSString*>*)values toSet:(nonnull NSString*)key;

/**
 Removes a nsset of values in a set stored at key.

 @param values NSSet<NSString *>
 @param key key Custom attribute key
 */
- (void)remove:(nonnull NSSet<NSString*>*)values toSet:(nonnull NSString*)key;

/**
 Clears the set of atributes specified in key.

 @param key the key to remove
 */
- (void)clearSet:(nonnull NSString*)key;

@end
