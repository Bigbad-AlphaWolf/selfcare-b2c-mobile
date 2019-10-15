import { HTTP } from '@ionic-native/http/ngx';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { NgModule } from '@angular/core';
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
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
@NgModule({
  declarations: [AppComponent, SidemenuComponent, ChangeAvatarPopupComponent, InProgressPopupComponent],
  entryComponents: [ChangeAvatarPopupComponent, InProgressPopupComponent],
  imports: [
    HttpClientModule,
    MatDialogModule,
    BrowserModule,
    IonicModule.forRoot({animated: true}),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativePageTransitions,
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
    AppMinimize
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
