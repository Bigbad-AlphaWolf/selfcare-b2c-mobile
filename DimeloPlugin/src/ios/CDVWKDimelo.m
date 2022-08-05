#import "CDVWKDimelo.h"
#import <Cordova/CDVPlugin.h>
#import "Dimelo/Dimelo.h"

@implementation CDVWKDimelo

Dimelo* dimelo;

- (void)pluginInitialize {
    NSLog(@"Hello, plugin initialized!");
    dimelo = [Dimelo sharedInstance];
    dimelo.delegate = self;
    //Authentify using build-in authentification
    NSString* secret = @"65537b4ddf7eea735bad06e7d4a7e4dffa4935ce97736cdf40cb1e8318b68987";
    [dimelo initWithApiSecret:secret domainName:@"sonatel" delegate:self];
}

- (void)openChat:(CDVInvokedUrlCommand*)command
{
    NSString *username = [command.arguments objectAtIndex:0];
    NSString *customerId = [command.arguments objectAtIndex:1];
    NSDictionary *authInfo = @{ @"CustomerId" : customerId};
    NSLog(@"Hello, plugin initialized!");
    dimelo.authenticationInfo = authInfo;
    dimelo.userName = username;
    dimelo.userIdentifier = customerId;
    dimelo.developmentAPNS = NO;
    [dimelo displayChatView];
}

@end