import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteWoyofalComponent } from '../favorite-woyofal/favorite-woyofal.component';

import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ModalController } from '@ionic/angular';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { map } from 'rxjs/operators';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { OPERATION_WOYOFAL } from 'src/app/utils/operations.constants';

@Component({
  selector: 'app-woyofal-selection',
  templateUrl: './woyofal-selection.component.html',
  styleUrls: ['./woyofal-selection.component.scss'],
})
export class WoyofalSelectionComponent implements OnInit {
  isProcessing: boolean = false;
  inputWoyofalNumber: string = '';
  woyofals$: Observable<any[]>;
  constructor(
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
    this.woyofals$ = this.recentService.fetchRecents(OPERATION_WOYOFAL, 3).pipe(
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

  onRecentWoyofalSelected(woyofal: any) {
    this.modalCtrl.dismiss({
      TYPE_BS: 'RECENTS',
      ACTION: 'FORWARD',
      counter: woyofal,
    });
  }

  onContinue() {
    if (!this.woyofalNumberIsValid) return;

    this.modalCtrl.dismiss({
      TYPE_BS: 'INPUT',
      ACTION: 'FORWARD',
      counter: { name: 'Autre', counterNumber: this.inputWoyofalNumber },
    });
  }

  onMyFavorites() {
    this.modalCtrl.dismiss();
    this.bsService.openModal(FavoriteWoyofalComponent);
  }

  onInputChange(woyofalNumber) {
    this.inputWoyofalNumber = woyofalNumber;
  }

  get woyofalNumberIsValid() {
    return (
      this.inputWoyofalNumber &&
      this.inputWoyofalNumber.length >= 11 &&
      /^\d+$/.test(this.inputWoyofalNumber)
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
