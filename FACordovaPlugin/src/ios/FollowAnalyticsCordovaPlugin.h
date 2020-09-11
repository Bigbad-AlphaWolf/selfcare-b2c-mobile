//
//  FollowAnalyticsCordovaPlugin.m
//  HelloCordova
//
//  Created by André Nunes on 17/04/2020.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <objc/runtime.h>
#import "AppDelegate.h"
#import <FollowAnalytics/FollowAnalytics.h>
#import <FollowAnalytics/FollowAnalyticsInApp.h>
#import "FAWebViewPopupController.h"

@interface FollowAnalyticsCordovaPlugin : CDVPlugin

+ (void)initialize;

@end
