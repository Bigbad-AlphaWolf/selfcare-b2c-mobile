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
    NSString* secret = @"bb1e6f640bebc7e05863ff1117d44bc0def05726c9d6a3d503dddfcd50cf16d1";
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