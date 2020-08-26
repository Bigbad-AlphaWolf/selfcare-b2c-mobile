//
//  FAWebViewPopupController.m
//
//  Created by Jose Carlos Joaquim on 02/02/2017.
//  Copyright © 2017 FollowAnalytics. All rights reserved.
//

#import "FAWebViewPopupController.h"

@implementation FAWebViewPopupController
@synthesize _webview;
- (void)webViewDidFinishLoad:(UIWebView *)webView {
    // Javascript to inject in loaded page
    NSString *injectable = @" \
    var links = document.getElementsByTagName('a'); \
    var nil = ''; \
    var scheme = 'FollowAnalyticsWebView'; \
    window.finalURL; \
    var items = document.getElementsByTagName('*'); \
    for (var i = 0; i < items.length; i++) { \
    if (items[i].getAttribute('onclick')) { \
    if(items[i].getAttribute('onclick').startsWith('FAFollowApps')) { \
    var _onclick = items[i].onclick; \
    window.finalURL = items[i].href; \
    } \
    } \
    } \
    FAFollowApps = { \
    logEvent: function(name, details) { \
    var url = scheme + '://FAFollowApps.logEvent(\"' + name.toString() + '\",\"' + details +'\")###FA###' + window.finalURL; \
    window.location = url; \
    return false; \
    }, \
    logError: function(name, details) { \
    var url = scheme + '://FAFollowApps.logError(\"' + name.toString() + '\",\"' + details +'\")###FA###' + window.finalURL; \
    window.location = url; \
    return false; \
    }, \
    setUserId: function(userId) { \
    var url = scheme + '://FAFollowApps.setUserId(\"' + userId.toString() + '\")###FA###' + window.finalURL; \
    window.location = url; \
    return false; \
    }, \
    unsetUserId: function() { \
    var url = scheme + '://FAFollowApps.unsetUserId()###FA###' + window.finalURL; \
    window.location = url; \
    return false; \
    } \
    };";
    [self._webview stringByEvaluatingJavaScriptFromString:injectable];
}

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSString *scheme = @"FollowAnalyticsWebView";
    NSString *requestString = [[[request URL] relativeString] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    requestString = [requestString stringByReplacingOccurrencesOfString:[NSString stringWithFormat:@"%@://", scheme]
                                                             withString:@""];
    NSArray *requestArray = [requestString componentsSeparatedByString:@"###FA###"];

    // catch event calls
    if ([request.URL.scheme isEqualToString:scheme]) {
        if (requestArray.firstObject) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.cordovaWebView stringByEvaluatingJavaScriptFromString:requestArray.firstObject];
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                    if (requestArray.lastObject != requestArray.firstObject) {
                        NSString *jsWindowLocation = [NSString stringWithFormat:@"window.location='%@'", requestArray.lastObject];
                        [self._webview stringByEvaluatingJavaScriptFromString:jsWindowLocation];
                    }
                });
            });
        }
        return YES;
    }
    return YES;
}
@end

