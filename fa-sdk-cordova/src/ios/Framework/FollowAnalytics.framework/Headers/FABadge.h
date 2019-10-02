//
//  FABadge.h
//  FollowApps
//
//  Created by Raphaël El Beze on 05/05/2017.
//  Copyright © 2017 Followanalytics. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface FABadge : NSObject

/*!
     Enable the badge managment, you need an appGroup between your app and your service extension.
*/
+ (BOOL)enable;

/*!
     Get the value of the icon badge number.
*/
+ (NSInteger)badge;

/*!
     Set the value of the icon badge number.

     @param badgeNumber An NSInteger to set the value.
*/
+ (void)setBadge:(NSInteger)badgeNumber;

/*!
     Update the value of the icon badge number by the number given.
     @param badgeDelta An NSInteger to update the value.
*/

+ (void)updateBadgeBy:(NSInteger)badgeDelta;

/*!
 Call this method after the FollowAnalytics initialisation only if you don't want to clear the
 notification center when you set the badge to 0. Here you can read the documentation about this
 behaviour. https://developer.apple.com/ios/human-interface-guidelines/features/notifications/ The
 only solution to bypass this scenario is to send a local silent notification just after going to
 the background.

 */

+ (void)doNotClearNotificationCenter:(BOOL)notClear;

@end
