//
//  FAWKWebViewJSBridge.h
//  FollowApps
//
//  Created by Jose Carlos Joaquim on 18/10/2016.
//  Copyright © 2016 Followanalytics. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>

/**
 Bridges FollowAnalytics iOS SDK inside WKWebView , effectively enabling access to
 the following  JavaScript methods :

 @code
  FollowAnalytics.requestNotificationCenterDefaultAuthorisation()
  FollowAnalytics.getDeviceId()
  FollowAnalytics.getUserId()
  FollowAnalytics.setUserId('id1')
  FollowAnalytics.isRegisteredForPushNotifications()
  FollowAnalytics.logError('err1',{'key1':'value1'})
  FollowAnalytics.logError('err1','str value')
  FollowAnalytics.logError('err1',11)
  FollowAnalytics.logEvent('event1',{'key1':'value1'})
  FollowAnalytics.logEvent('event1','str value')
  FollowAnalytics.logEvent('event1',11)
  FollowAnalytics.Push.getAll()
  FollowAnalytics.Push.get('id2')
  FollowAnalytics.Push.delete(['id1'])
  FollowAnalytics.Push.markAsUnread(['id1'])
  FollowAnalytics.Push.markAsRead(['id1'])
  FollowAnalytics.InApp.delete(['id1'])
  FollowAnalytics.InApp.markAsUnread(['id1'])
  FollowAnalytics.InApp.getAll()
  FollowAnalytics.InApp.get('id')
  FollowAnalytics.InApp.markAsRead(['id1'])
  FollowAnalytics.Badge.updateBy(1)
  FollowAnalytics.Badge.set(1)
  FollowAnalytics.UserAttributes.clearSet('key')
  FollowAnalytics.UserAttributes.removeFromSet('key', ['1'])
  FollowAnalytics.UserAttributes.addToSet('key', ['1'])
  FollowAnalytics.UserAttributes.clear('key')
  FollowAnalytics.UserAttributes.setBoolean('key', true)
  FollowAnalytics.UserAttributes.setNumber('key', 1)
  FollowAnalytics.UserAttributes.setProfilePictureUrl('url')
  FollowAnalytics.UserAttributes.setRegion('region')
  FollowAnalytics.UserAttributes.setCity('city')
  FollowAnalytics.UserAttributes.setCountry('country')
  FollowAnalytics.UserAttributes.setGender(FollowAnalytics.Gender.FEMALE)
  // other values for gender FollowAnalytics.Gender.MALE, FollowAnalytics.Gender.REMOVE,
FollowAnalytics.Gender.OTHER FollowAnalytics.UserAttributes.setEmail('email')
  FollowAnalytics.UserAttributes.setLastName('last name')
  FollowAnalytics.UserAttributes.setFirstName('first name')
  FollowAnalytics.UserAttributes.setDateOfBirth(new Date(Date.UTC(2012,10,11)))
  FollowAnalytics.UserAttributes.setDate('key1', new Date(Date.UTC(2012,10,11)));
  FollowAnalytics.UserAttributes.setDateTime('key1', new Date());
@endcode

 The final interface is much similar to the one from FollowAnalytics JavaScript SDK.

 In order to use it, you need set the UIDelegate on your WKWebView and implement one of the methods
as follows:

 @code
   // At the initialization of the hosting view controller:

   self.webViewJSBridge = [[FAWKWebViewJSBridge alloc] init];
   // ...
   // Set up configuration as needed.
   // ...
   [self.webViewJSBridge addToConfiguration:configuration];
   WKWebView* webView = [[WKWebView alloc] initWithFrame:frame configuration:configuration];
   webView.UIDelegate = self;


 // Implement the delegate method
 - (void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt
defaultText:(nullable NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(NSString * _Nullable result))completionHandler{ if([prompt
hasPrefix:@"FollowAnalytics"]){ [self.webViewJSBridge webView:webView
runJavaScriptTextInputPanelWithPrompt:prompt defaultText:defaultText initiatedByFrame:frame
completionHandler:completionHandler]; return;
  }
  // implement as needed when the prompt doesen't come from FollowAnalyics.
}
@endcode

 */
@interface FAWKWebViewJSBridge : NSObject <WKUIDelegate, WKScriptMessageHandler>

/**
 Adds self to the configuration as a script message handler and injects a java script bridge script
 at load time.
 Don't forget to retain FAWKWebViewJSBridge object.

 @param configuration A WKWebViewConfiguration* object
 */
- (void)addToConfiguration:(WKWebViewConfiguration*)configuration;

@end
