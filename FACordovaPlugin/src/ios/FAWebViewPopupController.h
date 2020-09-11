//
//  FAWebViewPopupController.h
//
//  Created by Jose Carlos Joaquim on 02/02/2017.
//  Copyright © 2017 FollowAnalytics. All rights reserved.
//

/**
 *  UIViewController implementation to handle FollowAnalytics logs
 *  This View Controller includes a webview that will implement all
 *  the needed javascript methods in order to perform logs
 *
 *  Methods currently available:
 *  - logEvent(name, details)
 *  - logError(name, details)
 *  - setUserId(userId)
 *  - unsetUserId()
 *
 *  Please refer to the documentation to learn how to implement logging on any web page
 *  being displayed from inside your application
 */
@interface FAWebViewPopupController : UIViewController <UIWebViewDelegate>
@property (nonatomic, strong) UIWebView *_webview;
@property (nonatomic, assign) id cordovaWebView;
@end
