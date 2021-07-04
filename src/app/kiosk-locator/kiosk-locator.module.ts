import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { Geolocation } from "@ionic-native/geolocation/ngx";

import { IonicModule } from "@ionic/angular";

import { KioskLocatorPage } from "./kiosk-locator.page";

const routes: Routes = [
  {
    path: "",
    component: KioskLocatorPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [KioskLocatorPage],
  providers: [Geolocation],
})
export class KioskLocatorPageModule {}
