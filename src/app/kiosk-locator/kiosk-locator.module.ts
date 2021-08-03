import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { Geolocation } from "@ionic-native/geolocation/ngx";

import { IonicModule } from "@ionic/angular";

import { KioskLocatorPage } from "./kiosk-locator.page";
import { KioskListModalComponent } from "./components/kiosk-list-modal/kiosk-list-modal.component";
import { KioskCardComponent } from "./components/kiosk-card/kiosk-card.component";
import { KioskSearchComponent } from "./components/kiosk-search/kiosk-search.component";
import { KioskWayInfosComponent } from "./components/kiosk-way-infos/kiosk-way-infos.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { PipesModule } from "../pipes/pipes.module";

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
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    KioskLocatorPage,
    KioskListModalComponent,
    KioskCardComponent,
    KioskSearchComponent,
    KioskWayInfosComponent,
  ],
  entryComponents: [KioskListModalComponent],
  providers: [Geolocation],
})
export class KioskLocatorPageModule {}
