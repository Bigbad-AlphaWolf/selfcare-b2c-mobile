//
//  FollowAnalyticsCordovaPlugin.m
//
//  Created by Jose Carlos Joaquim on 02/02/2017.
//  Copyright © 2017 FollowAnalytics. All rights reserved.
//

#import <Cordova/CDV.h>
#import <objc/runtime.h>
#import "AppDelegate.h"
#import <FollowAnalytics/FollowAnalytics.h>
#import <FollowAnalytics/FollowAnalyticsInApp.h>
#import "FAWebViewPopupController.h"

@interface FollowAnalyticsCordovaPlugin : CDVPlugin
- (void)initialize:(CDVInvokedUrlCommand *)command;
@property (nonatomic) BOOL configured;
@end

@implementation FollowAnalyticsCordovaPlugin

- (void)pluginInitialize {
}

- (void)initialize:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    if (!self.configured) {
        NSString *FAID = [command.arguments objectAtIndex:0];
        if (FAID == nil) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please provide an API Key to initialize the FollowAnalytics SDK"];
        } else {
            BOOL debugState;
            if (command.arguments.count < 2) {
                debugState = NO;
            }
            else {
                debugState = ([[command.arguments objectAtIndex:1] isKindOfClass:[NSNull class]]) ? NO : [[command.arguments objectAtIndex:1] boolValue];
            }
            id launchOptions = [[NSUserDefaults standardUserDefaults] valueForKey:@"launchOptions"];
            dispatch_async(dispatch_get_main_queue(), ^{
                FollowAnalyticsConfiguration* configuration = [FollowAnalyticsConfiguration
                                                               configurationWith:^(FollowAnalyticsMutableConfiguration* _Nonnull c) {
                                                                   c.apiKey = FAID;
                                                                   c.debug = debugState;
//                                                                   need to change the public interface to add this one
//                                                                   c.maxBackgroundTimeWithinSession =
                                                               }];
                [FollowAnalytics startWithConfiguration:configuration startupOptions:launchOptions];
            });
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            self.configured = YES;
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

- (void)getDeviceId:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult = nil;
        NSString *deviceId = [[FollowAnalytics getDeviceId] UUIDString];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:deviceId];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getUserId:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult = nil;
        NSString *userId = [FollowAnalytics getUserId];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:userId];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

//- (void)setMaximumBackgroundTimeWithinSession:(CDVInvokedUrlCommand *)command
//{
//    [self.commandDelegate runInBackground:^{
//        CDVPluginResult *pluginResult = nil;
//
//        if (![[command.arguments objectAtIndex:0] isKindOfClass:[NSNull class]])
//        {
//            NSTimeInterval backgroundTime = [[command.arguments objectAtIndex:0] integerValue];
//            [FAFollowApps setMaxBackgroundTimeWithinSession:backgroundTime];
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
//        }
//        else
//        {
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Incorrect value passed to setMaximumBackgroundTimeWithinSession"];
//        }
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    }];
//
//}

- (void)logEvent:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([command.arguments count] >= 2)
         {
             NSString *eventName = [command.arguments objectAtIndex:0];
             NSString *eventDetails = [command.arguments objectAtIndex:1];

             if (eventName != nil && [eventName length] > 0)
             {
                 if([eventDetails isKindOfClass:[NSNull class]])
                 {
                     eventDetails = nil;
                 }
                 [FollowAnalytics logEvent:eventName details:eventDetails];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No event name specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)logError:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([command.arguments count] >= 2)
         {
             NSString *errorName = [command.arguments objectAtIndex:0];
             NSString *errorDetails = [command.arguments objectAtIndex:1];
             if ([errorDetails isKindOfClass:[NSNull class]]) { errorDetails = @""; }

             if (errorName != nil && [errorName length] > 0)
             {
                 [FollowAnalytics logError:errorName details:errorDetails];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No error name specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)registerForPush:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         [FollowAnalytics requestNotificationCenterDefaultAuthorisation];
         pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)lastPushCampaignParams:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
    {
        CDVPluginResult* pluginResult = nil;
        [[NSUserDefaults standardUserDefaults] synchronize];
        NSDictionary *dict = [[NSUserDefaults standardUserDefaults] objectForKey:@"launchOptions"];
        NSData *data = nil;
        if (dict) {
            NSDictionary *customParams = [[[dict valueForKey:UIApplicationLaunchOptionsRemoteNotificationKey] valueForKey:@"FA"] valueForKey:@"c"];
            if (customParams) {
                NSError *error = nil;
                data = [NSJSONSerialization dataWithJSONObject:customParams
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:&error];
            }
        }

        if (!data) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"ERROR: Could not fetch last Push Message Contents"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
        else {
            NSString *string = [[NSString alloc] initWithData:data
                                                    encoding:NSUTF8StringEncoding];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:string];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

            // Calling this method will clean up the value for the latest custom params received
            // This ensures that you only get them once
            // If you need to keep them around just comment out the next line
            [self cleanUpCustomParams];
        }
    }];
}

- (void)cleanUpCustomParams
{
    [[NSUserDefaults standardUserDefaults] setValue:nil
                                             forKey:@"FACampaignParamsContentKey"];
    [[NSUserDefaults standardUserDefaults] setValue:nil
                                             forKey:@"launchOptions"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

- (void)pauseCampaignDisplay:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         [FollowAnalytics.inApp pauseCampaignDisplay];
         pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];

}

- (void)resumeCampaignDisplay:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         [FollowAnalytics.inApp resumeCampaignDisplay];
         pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setUserId:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult = nil;
        NSString *userId = [command.arguments objectAtIndex:0];
        if ([userId isEqual:[NSNull null]]) {
            [FollowAnalytics setUserId:nil];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        }
        else {
            if (userId != nil && userId.length > 0)
            {
                [FollowAnalytics setUserId:userId];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
            else
            {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No UserId specified"];
            }
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)unsetUserId:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         [FollowAnalytics setUserId:nil];
         pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setLastName:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *userLastName = [command.arguments objectAtIndex:0];

             if (userLastName != nil && userLastName.length > 0)
             {
                 [FollowAnalytics.userAttributes setLastName:userLastName];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No Last Name specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setFirstName:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *userFirstName = [command.arguments objectAtIndex:0];

             if (userFirstName != nil && userFirstName.length > 0)
             {
                 [FollowAnalytics.userAttributes setFirstName:userFirstName];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No First Name specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setEmail:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *userEmail = [command.arguments objectAtIndex:0];

             if (userEmail != nil && userEmail.length > 0)
             {
                 [FollowAnalytics.userAttributes setEmail:userEmail];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No Email specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setCity:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *userCity = [command.arguments objectAtIndex:0];

             if (userCity != nil && userCity.length > 0)
             {
                 [FollowAnalytics.userAttributes setCity:userCity];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No City specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setDateOfBirth:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSDateFormatter *df = [[NSDateFormatter alloc] init];
             [df setDateFormat:@"yyyy-MM-dd"];
             NSString *userBirthDate = [command.arguments objectAtIndex:0];
             NSDate *birthDate = [df dateFromString: userBirthDate];

             if (birthDate != nil)
             {
                 [FollowAnalytics.userAttributes setDateOfBirth:birthDate];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No Birth Date specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setProfilePictureUrl:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *userProfilePictureUrl = [command.arguments objectAtIndex:0];

             if (userProfilePictureUrl != nil && userProfilePictureUrl.length > 0)
             {
                 [FollowAnalytics.userAttributes setProfilePictureUrl:userProfilePictureUrl];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No Profile Picture specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setGender:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         if ([command.arguments count] == 1)
         {
             FollowAnalyticsGender gender = (FollowAnalyticsGender)[command.arguments objectAtIndex:0];
             if (gender < 0 || gender > 3)
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No Gender specified"];

             }
             else
             {
                 [FollowAnalytics.userAttributes setGender:gender];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

     }];
}

- (void)setCountry:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *userCountry = [command.arguments objectAtIndex:0];

             if (userCountry != nil && userCountry.length > 0)
             {
                 [FollowAnalytics.userAttributes setCountry:userCountry];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No Country specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setRegion:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *userRegion = [command.arguments objectAtIndex:0];

             if (userRegion != nil && userRegion.length > 0)
             {
                 [FollowAnalytics.userAttributes setRegion:userRegion];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No Region specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setDate:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *givenDate = [command.arguments objectAtIndex:1];
             if ([givenDate isKindOfClass:[NSNull class]]) {
                 return;
             }

             NSDateFormatter *df = [[NSDateFormatter alloc] init];
             [df setDateFormat:@"yyyy-MM-dd"];
             NSDate *attrDate = [df dateFromString:givenDate];

             NSString *attributeKey = [command.arguments objectAtIndex:0];


             if (attrDate != nil && attributeKey!= nil && attributeKey.length > 0)
             {
                 [FollowAnalytics.userAttributes setDate:attrDate forKey:attributeKey];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No Date specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setDateTime:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSDateFormatter *df = [[NSDateFormatter alloc] init];
             [df setDateFormat:@"yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'SSS'Z'"];
             NSString *givenDate = [command.arguments objectAtIndex:1];
             NSDate *attrDate = [df dateFromString: givenDate];
             NSString *attributeKey = [command.arguments objectAtIndex:0];

             if (attrDate != nil && attributeKey!= nil && attributeKey.length > 0)
             {
                 [FollowAnalytics.userAttributes setDateTime:attrDate forKey:attributeKey];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No DateTime specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}
- (void)removeUserAttributeSet:(CDVInvokedUrlCommand*)command

{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *attributeKey = [command.arguments objectAtIndex:0];
             NSString *attributeValue = [command.arguments objectAtIndex:1];

             if (attributeKey != nil && attributeKey.length > 0 && attributeValue != nil && attributeValue.length > 0)
             {
                 [FollowAnalytics.userAttributes remove:[NSSet setWithObject:attributeValue] toSet:attributeKey];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while removing User Attribute specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

// removed?
//- (void)setUserAttribute:(CDVInvokedUrlCommand*)command
//{
//    [self.commandDelegate runInBackground:^(void)
//     {
//         CDVPluginResult *pluginResult = nil;
//
//         if ([self validCommandArguments:command])
//         {
//             NSString *attributeKey = [command.arguments objectAtIndex:0];
//             NSString *attributeValue = [command.arguments objectAtIndex:1];
//
//             if (attributeValue != nil && attributeValue.length > 0 && attributeKey != nil && attributeKey.length > 0)
//             {
//                 [FollowAnalytics.userAttributes add:attributeValue forKey:attributeKey];
//                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
//             }
//             else
//             {
//                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while Set User Attribute specified"];
//             }
//         }
//         else
//         {
//             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
//         }
//         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//     }];
//}

- (void)setNumber:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *attributeKey = [NSString stringWithFormat:@"%@", [command.arguments objectAtIndex:0]];
             NSString *attributeValue = [NSString stringWithFormat:@"%@", [command.arguments objectAtIndex:1]];

             if (attributeValue != nil && attributeValue.length > 0 && attributeKey != nil && attributeKey.length > 0)
             {
                 // check if it's an integer or a double
                 NSScanner *scanner = [NSScanner scannerWithString:attributeValue];
                 int integer_value;
                 if ([scanner scanInt:&integer_value] && [scanner isAtEnd])
                 {
                     // it's an integer
                     [FollowAnalytics.userAttributes setInteger:[attributeValue intValue] forKey:attributeKey];
                 }
                 else
                 {
                     // assuming that the value is not empty and it's not an integer, hence a float or a double
                     [FollowAnalytics.userAttributes setDouble:[attributeValue doubleValue] forKey:attributeKey];
                 }
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while setting Number User Attribute specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)setString:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *attributeKey = [command.arguments objectAtIndex:0];
             NSString *attributeValue = [NSString stringWithFormat:@"%@", [command.arguments objectAtIndex:1]];

             if (attributeValue != nil && attributeValue.length > 0 && attributeKey != nil && attributeKey.length > 0)
             {
                 [FollowAnalytics.userAttributes setString:attributeValue forKey:attributeKey];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while setting String Attribute"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}
- (void)setBoolean:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         NSLog(@"%@", command.arguments);
         if ([self validCommandArguments:command])
         {
             NSString *attributeKey = [command.arguments objectAtIndex:0];
             NSString *attributeValue = [NSString stringWithFormat:@"%@", [command.arguments objectAtIndex:1]];

             if (attributeValue != nil && attributeValue.length > 0 && attributeKey != nil && attributeKey.length > 0)
             {
                 [FollowAnalytics.userAttributes setBoolean:[attributeValue boolValue] forKey:attributeKey];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while setting Boolean Attribute specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];

}


- (void)addUserAttributeSet:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *attributeKey = [command.arguments objectAtIndex:0];
             id attributeValue = [command.arguments objectAtIndex:1];

             if (attributeKey != nil && attributeKey.length > 0 && attributeValue != nil)
             {
                 if ([attributeValue isKindOfClass:[NSSet class]])
                 {
                     [FollowAnalytics.userAttributes add:attributeValue toSet:attributeKey];
                     pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                 }
                 else if([attributeValue isKindOfClass:[NSString class]])
                 {
                     NSSet *set = [NSSet setWithObject:attributeValue];
                     [FollowAnalytics.userAttributes add:set toSet:attributeKey];
                     pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                 }
                 else
                 {
                     pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while adding User Attribute specified, the value should be a set of string or a string"];
                 }
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while adding User Attribute specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)deleteUserAttribute:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *attributeKey = [command.arguments objectAtIndex:0];

             if (attributeKey != nil && attributeKey.length > 0 )
             {
                 [FollowAnalytics.userAttributes clear:attributeKey];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while deleting User Attribute specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)emptyUserAttributeSet:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *attributeKey = [command.arguments objectAtIndex:0];

             if (attributeKey != nil && attributeKey.length > 0 )
             {
                 [FollowAnalytics.userAttributes clear:attributeKey];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while try to empty a set of Attribute specified"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)clear:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *attributeKey = [command.arguments objectAtIndex:0];

             if (attributeKey != nil && attributeKey.length > 0 )
             {
                 [FollowAnalytics.userAttributes clear:attributeKey];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error while try to delete value for attribute"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)clearSet:(CDVInvokedUrlCommand*)command {
    [self emptyUserAttributeSet:command];
}

- (void)addToSet:(CDVInvokedUrlCommand*)command{
    [self addUserAttributeSet:command];
}

- (void)removeFromSet:(CDVInvokedUrlCommand*)command {
    [self removeUserAttributeSet:command];
}


//- (void)handleDeeplink:(CDVInvokedUrlCommand*)command
//{
//    [self.commandDelegate runInBackground:^(void){
//        NSDictionary *params = [FollowAnalytics lastPushCampaignParams];
//        CDVPluginResult *pluginResult = nil;
//        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:params];
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    }];
//}

- (void)InAppgetAll:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         NSArray *allInApp = [FollowAnalytics.inApp getAll];
         pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:allInApp];
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)InAppget:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;

         if ([self validCommandArguments:command])
         {
             NSString *campaignId = [command.arguments objectAtIndex:0];
             if (campaignId != nil && campaignId.length > 0 )
             {
                 FAMessage *campaign = [FollowAnalytics.inApp get:campaignId];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:campaign.rawData];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please specify a campaignIdentifier"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)InAppmarkAsRead:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         if ([self validCommandArguments:command])
         {
             NSArray *campaignIdentifiers = [command.arguments objectAtIndex:0];
             if (campaignIdentifiers != nil && campaignIdentifiers.count > 0 )
             {
                 [FollowAnalytics.inApp markAsRead:campaignIdentifiers];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:true];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please specify an array of campaignIdentifiers"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)InAppmarkAsUnread:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         if ([self validCommandArguments:command])
         {
             NSArray *campaignIdentifiers = [command.arguments objectAtIndex:0];
             if (campaignIdentifiers != nil && campaignIdentifiers.count > 0 )
             {
                 [FollowAnalytics.inApp markAsUnread:campaignIdentifiers];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:true];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please specify an array of campaignIdentifiers"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)InAppdelete:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         if ([self validCommandArguments:command])
         {
             NSArray *campaignIdentifiers = [command.arguments objectAtIndex:0];
             if (campaignIdentifiers != nil && campaignIdentifiers.count > 0 )
             {
                 [FollowAnalytics.inApp deleteIdentifiers:campaignIdentifiers];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:true];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please specify an array of campaignIdentifiers"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}


- (void)PushgetAll:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         NSArray *allPushes = [FollowAnalytics.push getAll];
         pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:allPushes];
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)Pushget:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         if ([self validCommandArguments:command])
         {
             NSString *campaignIdentifier = [command.arguments objectAtIndex:0];
             if (campaignIdentifier != nil && campaignIdentifier.length > 0 )
             {
                 FAMessage *pushMessage = [FollowAnalytics.push get:campaignIdentifier];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:pushMessage.rawData];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please specify Push Message Identifier"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)PushmarkAsRead:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         if ([self validCommandArguments:command])
         {
             NSArray *campaignIdentifiers = [command.arguments objectAtIndex:0];
             if (campaignIdentifiers != nil && campaignIdentifiers.count > 0 )
             {
                 [FollowAnalytics.push markAsRead:campaignIdentifiers];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:true];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please specify an array of campaignIdentifiers"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)PushmarkAsUnread:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         if ([self validCommandArguments:command])
         {
             NSArray *campaignIdentifiers = [command.arguments objectAtIndex:0];
             if (campaignIdentifiers != nil && campaignIdentifiers.count > 0 )
             {
                 [FollowAnalytics.push markAsUnread:campaignIdentifiers];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:true];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please specify an array of campaignIdentifiers"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)Pushdelete:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
         if ([self validCommandArguments:command])
         {
             NSArray *campaignIdentifiers = [command.arguments objectAtIndex:0];
             if (campaignIdentifiers != nil && campaignIdentifiers.count > 0 )
             {
                 [FollowAnalytics.push deleteIdentifiers:campaignIdentifiers];
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:true];
             }
             else
             {
                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Please specify an array of campaignIdentifiers"];
             }
         }
         else
         {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not enough arguments"];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}


/**
 *  Displays an overlay containing a UIWebView with an external URL loaded
 *  It uses FAWebViewPopupController subclass in order to be able to catch FollowAnalytics
 *  specific events
 */
- (void)openWebView:(CDVInvokedUrlCommand*)command
{
    if ([command.arguments count] == 3 && command.arguments.firstObject != nil) {
        NSString *urlString = command.arguments.firstObject;
        NSString *title = nil;
        NSString *closeButtonTitle = nil;
        if (![[command.arguments objectAtIndex:1] isKindOfClass:[NSNull class]]) {
            if (![urlString isEqualToString:[command.arguments objectAtIndex:1]]) {
                title = [command.arguments objectAtIndex:1];
            }
        }
        if (![command.arguments.lastObject isKindOfClass:[NSNull class]]) {
            if (![urlString isEqualToString:command.arguments.lastObject]) {
                closeButtonTitle = command.arguments.lastObject;
            }
        }
        [self presentWebViewWithStringURL:urlString
                                withTitle:title
                      andCloseButtonTitle:closeButtonTitle];
    }
}

/**
 *  Displays the external URL as a Modal to the current application status
 *  @param urlString        String for the external URL to load. Required
 *  @param title            Title to be displayed in the UINavigationBar navigationItem text
 *  @param closeButtonTitle Close button text.
 */
- (void)presentWebViewWithStringURL:(NSString *)urlString
                          withTitle:(NSString *)title
                andCloseButtonTitle:(NSString *)closeButtonTitle {
    if (!urlString || [[urlString stringByReplacingOccurrencesOfString:@" " withString:@""] length] == 0) { return; }
    FAWebViewPopupController *faWVController = [self containerForWebViewController];

    [self setupWebViewContainer:faWVController
                  withURLString:urlString];

    UINavigationController* navContainer = [[UINavigationController alloc] initWithRootViewController:faWVController];

    [self setupWebViewContainerUI:faWVController
                        withTitle:title
               andCloseButtonText:closeButtonTitle];
    [navContainer setModalPresentationStyle:UIModalPresentationFullScreen];
    [self.viewController presentViewController:navContainer
                                      animated:YES
                                    completion:nil];
}

/**
 *  Container for the UIWebView that will load the external URL
 *  Must use FAWebViewPopupController in order to be able to perform Logs using the
 *  current context for the application
 *  @return FAWebViewPopupController
 */
- (FAWebViewPopupController *)containerForWebViewController
{
    FAWebViewPopupController *faWVController = [[FAWebViewPopupController alloc] init];
    faWVController._webview = [[UIWebView alloc] initWithFrame:self.viewController.view.frame];
    faWVController._webview.delegate = faWVController;
    faWVController.cordovaWebView = [[[super self] webViewEngine] engineWebView];
    return faWVController;
}

/**
 *  Initial setup for the UIWebView contained within FAWebViewPopupController
 *
 *  @param faWVController FAWebViewPopupController containing the UIWebView for the external URL
 *  @param urlString      URL for the external page to load
 */
- (void)setupWebViewContainer:(FAWebViewPopupController *)faWVController
                withURLString:(NSString *)urlString
{
    NSURL *url = [NSURL URLWithString:urlString];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [faWVController._webview loadRequest:request];
    faWVController.view = faWVController._webview;
}

/**
 *  Sets up the UI for the View Controller that will contain the UIWebView
 *  for the external URL
 *
 *  @param faWebViewContainerController FollowAnalytics View Controller class
 *  @param title                        Title to be displayed in the Navigation Bar. NSString or nil
 *  @param closeButtonTitle             Text for the Close button. Defaults to "Close"
 */
- (void)setupWebViewContainerUI:(FAWebViewPopupController *)faWebViewContainerController
                      withTitle:(NSString *)title
             andCloseButtonText:(NSString *)closeButtonTitle
{
    NSString *closeButtonText = @"Close";
    // Check for NSNull was made in the caller method. Check for empty strings
    if (closeButtonTitle) {
        NSString *trimmed = [closeButtonTitle stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
        if ([trimmed length] > 0) { closeButtonText = trimmed; }
    }

    UIBarButtonItem *btnCancel = [[UIBarButtonItem alloc] initWithTitle:closeButtonText
                                                                  style:UIBarButtonItemStylePlain
                                                                 target:self action:@selector(closeFAWebView:)];
    faWebViewContainerController.navigationItem.rightBarButtonItem = btnCancel;

    if (title) { [faWebViewContainerController.navigationItem setTitle:title]; }
}

/**
 *  Dimisses the modal controller containing the external webview
 *
 *  @param sender caller object
 */
- (void)closeFAWebView:(id)sender
{
    [self.viewController dismissViewControllerAnimated:YES completion:nil];
}

- (BOOL)validCommandArguments:(CDVInvokedUrlCommand *)command
{
    BOOL result = NO;
    NSInteger indexToCheck = command.arguments.count - 1;
    if ([command.arguments[indexToCheck] isEqual:[NSNull null]]) {
        result = NO;
    }
    else {
        result = YES;
    }
    return result;
}

- (void)setOptInAnalytics:(CDVInvokedUrlCommand *)command {
    if (!command.arguments || [command.arguments count] < 1) { return; }
    [self.commandDelegate runInBackground:^(void) {
        [FollowAnalytics setOptInAnalytics:[[command.arguments objectAtIndex:0] boolValue]];
     }];
}

- (void)getOptInAnalytics:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^(void)
     {
        CDVPluginResult *pluginResult = nil;
        BOOL optIn = [FollowAnalytics getOptInAnalytics];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:optIn];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)requestToAccessMyData:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^(void)
     {
        [FollowAnalytics.GDPR requestToAccessMyData];
     }];
}

- (void)requestToDeleteMyData:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^(void)
     {
        [FollowAnalytics.GDPR requestToDeleteMyData];
     }];
}

- (void)DataWalletIsRead:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^(void)
     {
        CDVPluginResult *pluginResult = nil;
        BOOL isRead = [FollowAnalytics.dataWallet isRead];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:isRead];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

- (void)DataWalletSetIsRead:(CDVInvokedUrlCommand *)command {
    if (!command.arguments || [command.arguments count] < 1) { return; }
    [self.commandDelegate runInBackground:^(void) {
        [FollowAnalytics.dataWallet setIsRead:[[command.arguments objectAtIndex:0] boolValue]];
     }];
}

- (void)DataWalletGetPolicy:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^(void)
     {
         CDVPluginResult *pluginResult = nil;
        NSString *policy = @"Currently not available. Expected for version 7.0";
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:policy];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     }];
}

@end


@interface AppDelegate (FollowAnalyticsPlugin)
@end

@implementation AppDelegate (FollowAnalyticsPlugin)

void swizzleMethod(Class c, SEL originalSelector)
{
    NSString *original = NSStringFromSelector(originalSelector);

    SEL swizzledSelector = NSSelectorFromString([@"swizzled_" stringByAppendingString:original]);
    SEL noopSelector = NSSelectorFromString([@"noop_" stringByAppendingString:original]);

    Method originalMethod, swizzledMethod, noop;
    originalMethod = class_getInstanceMethod(c, originalSelector);
    swizzledMethod = class_getInstanceMethod(c, swizzledSelector);
    noop = class_getInstanceMethod(c, noopSelector);

    BOOL didAddMethod = class_addMethod(c,
                                        originalSelector,
                                        method_getImplementation(swizzledMethod),
                                        method_getTypeEncoding(swizzledMethod));

    if (didAddMethod)
    {
        class_replaceMethod(c,
                            swizzledSelector,
                            method_getImplementation(noop),
                            method_getTypeEncoding(originalMethod));
    }
    else
    {
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class cls = [self class];
        swizzleMethod(cls, @selector(application:didFinishLaunchingWithOptions:));
    });
}

- (BOOL)swizzled_application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    BOOL ret = [self swizzled_application:application didFinishLaunchingWithOptions:launchOptions];
    [[NSUserDefaults standardUserDefaults] setObject:launchOptions forKey:@"launchOptions"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    if (ret) {  if (application.applicationState != UIApplicationStateBackground) { } }
        return ret;
}

- (BOOL)noop_application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    return YES;
}

- (void)followAppsShouldHandleParameters:(NSDictionary *)customParameters
                        actionIdentifier:(NSString *)actionIdentifier
                             actionTitle:(NSString *)actionTitle
                       completionHandler:(void (^)())completionHandler

{
    NSData *data = [NSJSONSerialization dataWithJSONObject:customParameters
                                                   options:NSJSONWritingPrettyPrinted
                                                     error:nil];
    NSString *jsonString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    NSString *functionCall = [NSString stringWithFormat:@"setTimeout(function(){ FollowAnalytics.emit('onPushMessageClicked', %@) }, 1000);", jsonString];
    [(UIWebView *)[[[super viewController] webViewEngine] engineWebView] stringByEvaluatingJavaScriptFromString:functionCall];
}

@end
