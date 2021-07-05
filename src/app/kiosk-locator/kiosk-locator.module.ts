import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { Geolocation } from "@ionic-native/geolocation/ngx";

import { IonicModule } from "@ionic/angular";

import { KioskLocatorPage } from "./kiosk-locator.page";
import { KioskListModalComponent } from "./components/kiosk-list-modal/kiosk-list-modal.component";
import { KioskCardComponent } from "./components/kiosk-card/kiosk-card.component";

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
  declarations: [KioskLocatorPage, KioskListModalComponent, KioskCardComponent],
  entryComponents: [KioskListModalComponent],
  providers: [Geolocation],
})
export class KioskLocatorPageModule {}
