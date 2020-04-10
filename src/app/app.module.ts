import { HTTP } from '@ionic-native/http/ngx';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
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
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

registerLocaleData(localeFr);
@NgModule({
  declarations: [
    AppComponent,
    SidemenuComponent,
    ChangeAvatarPopupComponent,
    InProgressPopupComponent
  ],
  entryComponents: [ChangeAvatarPopupComponent, InProgressPopupComponent],
  imports: [
    HttpClientModule,
    MatDialogModule,
    BrowserModule,
    IonicModule.forRoot({ animated: false }),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    AppVersion,
    StatusBar,
    SplashScreen,
    NativePageTransitions,
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    HTTP,
    FileTransfer,
    FileTransferObject,
    File,
    FileOpener,
    AppMinimize,
    InAppBrowser,
    Deeplinks,
    Market,
    Device,
    Uid,
    AndroidPermissions,
    UniqueDeviceID
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
