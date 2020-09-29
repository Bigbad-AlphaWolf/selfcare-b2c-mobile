import { HTTP } from '@ionic-native/http/ngx';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { AuthInterceptorService } from './services/auth-interceptor-service/auth-interceptor.service';
import { ChangeAvatarPopupComponent } from './my-account/change-avatar-popup/change-avatar-popup.component';
import { InProgressPopupComponent } from 'src/shared/in-progress-popup/in-progress-popup.component';
import { SharedModule } from 'src/shared/shared.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SetPaymentChannelModalPageModule } from './set-payment-channel-modal/set-payment-channel-modal.module';
import { NewPinpadModalPageModule } from './new-pinpad-modal/new-pinpad-modal.module';
import { OperationSuccessFailModalPageModule } from './operation-success-fail-modal/operation-success-fail-modal.module';
import { RegistrationSuccessModalPageModule } from './registration-success-modal/registration-success-modal.module';

registerLocaleData(localeFr);
@NgModule({
  declarations: [
    AppComponent,
    SidemenuComponent,
    ChangeAvatarPopupComponent,
    InProgressPopupComponent,
  ],
  entryComponents: [ChangeAvatarPopupComponent, InProgressPopupComponent],
  imports: [
    HttpClientModule,
    MatDialogModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    SetPaymentChannelModalPageModule,
    NewPinpadModalPageModule,
    OperationSuccessFailModalPageModule,
    RegistrationSuccessModalPageModule,
  ],
  providers: [
    Contacts,
    AppVersion,
    WebView,
    OpenNativeSettings,
    SocialSharing,
    Facebook,
    StatusBar,
    SplashScreen,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    HTTP,
    File,
    FileOpener,
    AppMinimize,
    InAppBrowser,
    Deeplinks,
    Market,
    Device,
    AndroidPermissions,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
