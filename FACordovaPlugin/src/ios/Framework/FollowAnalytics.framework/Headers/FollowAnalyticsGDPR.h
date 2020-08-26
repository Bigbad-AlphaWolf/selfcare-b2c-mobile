//
//  FollowAnalyticsGDPR.h
//  FollowAnalytics
//
//  Created by Adrian Tofan on 22/05/2018.
//  Copyright © 2018 FOLLOW APPS. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FollowAnalyticsGDPR
@required
/**
  Thid method records a demand to access a user's data. If the user identifier is set the call to
  the web service is made as soon the conditions allow that. Otherwise the sdk will log an warning.
  Subsequent calls while the api call was not made have no effect. Once the api call is made, each
  new request will triger an new api call.
 */
- (void)requestToAccessMyData;

/**
  Thid method records a demand to delete a user's data. If the user identifier is set the call to
  the web service is made as soon the conditions allow that. Otherwise the sdk will log an warning.
  Subsequent calls while the api call was not made have no effect. Once the api call is made, each
  new request will triger an new api call.

 */
- (void)requestToDeleteMyData;
@end
