import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CounterOem } from 'src/app/models/counter-oem.model';
import { Observable, of } from 'rxjs';
import { CounterService } from 'src/app/services/counter/counter.service';
import { FavoriteCountersComponent } from '../favorite-counters/favorite-counters.component';

import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ModalController } from '@ionic/angular';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { map } from 'rxjs/operators';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { OPERATION_WOYOFAL } from 'src/app/utils/operations.util';

@Component({
  selector: 'app-counter-selection',
  templateUrl: './counter-selection.component.html',
  styleUrls: ['./counter-selection.component.scss'],
})
export class CounterSelectionComponent implements OnInit {
  isProcessing: boolean = false;
  inputCounterNumber: string = '';
  // counters$: Observable<CounterOem[]> = of([
  //   { name: 'Maison Nord-foire', counterNumber: '14256266199' },
  //   { name: 'Audi Q5', counterNumber: '14256266199' },
  // ]);
  counters$: Observable<CounterOem[]>;
  constructor(
    private counterService: CounterService,
    private bsService: BottomSheetService,
    private omService: OrangeMoneyService,
    private changeDetectorRef: ChangeDetectorRef,
    private recentService: RecentsService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.checkOmAccount();
  }

  initRecents() {
    this.counters$ = this.recentService.fetchRecents(OPERATION_WOYOFAL, 3).pipe(
      map((recents: RecentsOem[]) => {
        let results = [];
        recents.forEach((el) => {
          results.push({
            name: el.titre,
            counterNumber: JSON.parse(el.payload).numero_compteur,
          });
        });
        return results;
      })
    );
  }

  onRecentCounterSlected(counter: CounterOem) {
    this.modalCtrl.dismiss({
      TYPE_BS: 'RECENTS',
      ACTION: 'FORWARD',
      counter: counter,
    });
  }

  onContinue() {
    if (!this.counterNumberIsValid) return;

    this.modalCtrl.dismiss({
      TYPE_BS: 'INPUT',
      ACTION: 'FORWARD',
      counter: { name: 'Autre', counterNumber: this.inputCounterNumber },
    });
  }

  onMyFavorites() {
    this.modalCtrl.dismiss();
    this.bsService.openModal(FavoriteCountersComponent);
  }

  onInputChange(counterNumber) {
    this.inputCounterNumber = counterNumber;
  }

  get counterNumberIsValid() {
    return (
      this.inputCounterNumber &&
      this.inputCounterNumber.length === 11 &&
      /^\d+$/.test(this.inputCounterNumber)
    );
  }

  checkOmAccount() {
    this.isProcessing = true;
    this.omService.getOmMsisdn().subscribe(
      (msisdn: any) => {
        this.isProcessing = false;
        this.changeDetectorRef.detectChanges();

        if (msisdn === 'error') {
          this.modalCtrl.dismiss();
          this.openPinpad();
        }

        if (msisdn !== 'error') {
          this.initRecents();
          this.bsService.opXtras.senderMsisdn = msisdn;
          this.counterService.initFees(msisdn);
        }
      },
      () => {
        this.modalCtrl.dismiss();
      }
    );
  }

  async openPinpad() {
    const modal = await this.modalCtrl.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.bsService.opXtras.omSession.loginExpired = false;
      }
    });
    return await modal.present();
  }
}
