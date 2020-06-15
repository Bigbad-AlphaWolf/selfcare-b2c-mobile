import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { CounterOem } from "src/app/models/counter-oem.model";
import { Observable, of } from "rxjs";
import { CounterService } from "src/app/services/counter/counter.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material";
import { BsBillsHubService } from "src/app/services/bottom-sheet/bs-bills-hub.service";
import { FavoriteCountersComponent } from "../favorite-counters/favorite-counters.component";

import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: "app-counter-selection",
  templateUrl: "./counter-selection.component.html",
  styleUrls: ["./counter-selection.component.scss"],
})
export class CounterSelectionComponent implements OnInit {
  isProcessing: boolean = false;
  inputCounterNumber: string = "";
  counters$: Observable<CounterOem[]> = of([
    { name: "Maison Nord-foire", counterNumber: "14256266199" },
    { name: "Audi Q5", counterNumber: "14256266199" },
  ]);
  constructor(
    private counterService: CounterService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bsBillsHubService: BsBillsHubService,
    private bsRef: MatBottomSheetRef,
    private modalController: ModalController,
    private omService: OrangeMoneyService,
    private changeDetectorRef: ChangeDetectorRef

  ) {
  }

  ngOnInit() {
    // this.counters$ = this.woyofal.fetchRecentsCounters();
    this.checkOmAccountSession();
  }

  onRecentCounterSlected(counter: CounterOem) {
    this.bsRef.dismiss({
      TYPE_BS: "RECENTS",
      ACTION: "FORWARD",
      counter: counter,
    });
  }

  onContinue() {
    if (!this.counterNumberIsValid) return;

    this.bsRef.dismiss({
      TYPE_BS: "INPUT",
      ACTION: "FORWARD",
      counter: { name: "Autre", counterNumber: this.inputCounterNumber },
    });
  }

  onMyFavorites() {
    this.bsBillsHubService.openBSFavoriteCounters(FavoriteCountersComponent);
  }

  onInputChange(counterNumber) {
    this.inputCounterNumber = counterNumber;
  }

  get counterNumberIsValid() {
    return this.inputCounterNumber && (this.inputCounterNumber.length === 11) && (/^\d+$/.test(this.inputCounterNumber));
  }

  checkOmAccountSession() {
    this.isProcessing = true;
    this.omService.omAccountSession().subscribe(
      (omSession: any) => {
        this.bsBillsHubService.opXtras.omSession = omSession;
        this.isProcessing = false;
        this.changeDetectorRef.detectChanges();

        if (
          omSession.msisdn === "error" ||
          !omSession.hasApiKey ||
          !omSession.accessToken ||
          omSession.loginExpired
        ) {
          this.bsRef.dismiss();
          this.openPinpad();
        }

        if (omSession.msisdn !== "error"){
          this.bsBillsHubService.opXtras.senderMsisdn = omSession.msisdn;
          this.counterService.initFees(omSession.msisdn);

        }
      },
      (error) => {
        this.bsRef.dismiss();

      }
    );
  }



  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: "pin-pad-modal",
      componentProps: {
        operationType: null,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.bsBillsHubService.opXtras.omSession.loginExpired = false;
      }
    });
    return await modal.present();
  }
}
