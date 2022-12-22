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
import { MatDialogModule } from '@angular/material/dialog';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { AuthInterceptorService } from './services/auth-interceptor-service/auth-interceptor.service';
import { SharedModule } from 'src/shared/shared.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SetPaymentChannelModalPageModule } from './set-payment-channel-modal/set-payment-channel-modal.module';
import { NewPinpadModalPageModule } from './new-pinpad-modal/new-pinpad-modal.module';
import { OperationSuccessFailModalPageModule } from './operation-success-fail-modal/operation-success-fail-modal.module';
import { RegistrationSuccessModalPageModule } from './registration-success-modal/registration-success-modal.module';
import { IonicImageLoader } from 'ionic-image-loader';
import { Uid } from '@ionic-native/uid/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { PipesModule } from './pipes/pipes.module';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { FaceIdAlertPopupComponent } from './sidemenu/face-id-alert-popup/face-id-alert-popup.component';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { FirebaseDynamicLinks } from '@awesome-cordova-plugins/firebase-dynamic-links/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { DimeloCordovaPlugin } from 'DimeloPlugin/ngx';
//import { EyesOn } from 'cordova-plugin-eyeson/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';

registerLocaleData(localeFr);
@NgModule({
  declarations: [AppComponent, SidemenuComponent, FaceIdAlertPopupComponent],
  imports: [
    HttpClientModule,
    MatDialogModule,
    BrowserModule,
    IonicModule.forRoot(),
    IonicImageLoader.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    SetPaymentChannelModalPageModule,
    NewPinpadModalPageModule,
    OperationSuccessFailModalPageModule,
    RegistrationSuccessModalPageModule,
    PipesModule,
  ],
  providers: [
    AppVersion,
    StatusBar,
    SplashScreen,
    FingerprintAIO,
    WebView,
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
    FirebaseDynamicLinks,
    InAppBrowser,
    Market,
    Device,
    Uid,
    AndroidPermissions,
    Network,
    Diagnostic,
    BarcodeScanner,
    FirebaseAnalytics,
    DimeloCordovaPlugin,
    Deeplinks,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
