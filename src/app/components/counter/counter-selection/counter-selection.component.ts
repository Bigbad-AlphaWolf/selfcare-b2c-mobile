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
  counters$: Observable<CounterOem[]> ;
  constructor(
    private counterService: CounterService,
    private bsService: BottomSheetService,
    private modalController: ModalController,
    private omService: OrangeMoneyService,
    private changeDetectorRef: ChangeDetectorRef,
    private recentService: RecentsService,
    private modalCtrl : ModalController
  ) {}

  ngOnInit() {
    this.counters$ = this.recentService.fetchRecents(OPERATION_WOYOFAL).pipe(
      map((recents: RecentsOem[]) => {
        let results = [];
        recents = recents.slice(0, 3);
        recents.forEach((el) => {
          results.push({
            name: el.titre,
            counterNumber: JSON.parse(el.payload).numero_compteur,
          });
        });
        return results;
      })
    );
    this.checkOmAccountSession();
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
    this.modalController.dismiss();
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

  checkOmAccountSession() {
    this.isProcessing = true;
    this.omService.omAccountSession().subscribe(
      (omSession: any) => {
        this.bsService.opXtras.omSession = omSession;
        this.isProcessing = false;
        this.changeDetectorRef.detectChanges();

        if (
          omSession.msisdn === 'error' ||
          !omSession.hasApiKey ||
          !omSession.accessToken ||
          omSession.loginExpired
        ) {
          this.modalCtrl.dismiss();
          this.openPinpad();
        }

        if (omSession.msisdn !== 'error') {
          this.bsService.opXtras.senderMsisdn = omSession.msisdn;
          this.counterService.initFees(omSession.msisdn);
        }
      },
      (error) => {
        this.modalCtrl.dismiss();
      }
    );
  }

  async openPinpad() {
    const modal = await this.modalController.create({
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
