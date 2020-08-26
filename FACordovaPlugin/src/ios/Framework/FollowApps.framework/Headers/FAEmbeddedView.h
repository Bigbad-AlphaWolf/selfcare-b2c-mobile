//
//  FAEmbeddedView.h
//  FollowApps
//
//  Created by Raphaël El Beze on 02/08/2016.
//  Copyright © 2016 Followanalytics. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol FAEmbeddedViewDelegate;

@interface FAEmbeddedView : UIWebView

- (instancetype)init;
- (instancetype)initWithCategory:(NSString *)category;
- (instancetype)initWithMaxHeight:(NSInteger)maxHeight;
- (instancetype)initWithCategory:(NSString *)category maxHeight:(NSInteger)maxHeight;

+ (FAEmbeddedView *)displayBigForDebuggingWithMaxheight:(NSInteger)maxHeight;
+ (FAEmbeddedView *)displayRegularFordebuggingWithMaxheight:(NSInteger)maxHeight;
+ (FAEmbeddedView *)displaySmallFordebuggingWithMaxheight:(NSInteger)maxHeight;

@property(nonatomic, weak) id<FAEmbeddedViewDelegate> embeddedDelegate;

@end

@protocol FAEmbeddedViewDelegate <NSObject>

@optional

- (BOOL)embeddedViewWillBeDisplayed:(FAEmbeddedView *)embeddedView;
- (NSInteger)embeddedView:(FAEmbeddedView *)embeddedView didFinishLoadWithpreferedHeight:(NSInteger)preferedHeight;
- (void)embeddedView:(FAEmbeddedView *)embeddedView didPushElement:(id)hash;

@end
