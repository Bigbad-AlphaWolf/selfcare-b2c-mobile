import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';


import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ModalController } from '@ionic/angular';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { map } from 'rxjs/operators';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { OPERATION_RAPIDO } from 'src/app/utils/operations.constants';
import { FavoriteRapidoComponent } from '../favorite-rapido/favorite-rapido.component';
import { FeesService } from 'src/app/services/fees/fees.service';

@Component({
  selector: 'app-rapido-selection',
  templateUrl: './rapido-selection.component.html',
  styleUrls: ['./rapido-selection.component.scss'],
})
export class RapidoSelectionComponent implements OnInit {
  isProcessing: boolean = false;
  inputRapidoNumber: string = '';
  // rapidos$: Observable<RapidoOem[]> = of([
  //   { name: 'Maison Nord-foire', rapidoNumber: '14256266199' },
  //   { name: 'Audi Q5', rapidoNumber: '14256266199' },
  // ]);
  rapidos$: Observable<any[]>;
  constructor(
    private feesService: FeesService,
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
    this.rapidos$ = this.recentService.fetchRecents(OPERATION_RAPIDO, 3).pipe(
      map((recents: RecentsOem[]) => {
        let results = [];
        recents.forEach((el) => {
          results.push({
            name: el.titre,
            counterNumber: JSON.parse(el.payload).numero_carte,
          });
        });
        return results;
      })
    );
  }

  onRecentRapidoSlected(rapido: any) {
    this.modalCtrl.dismiss({
      TYPE_BS: 'RECENTS',
      ACTION: 'FORWARD',
      counter: rapido,
    });
  }

  onContinue() {
    if (!this.rapidoNumberIsValid) return;

    this.modalCtrl.dismiss({
      TYPE_BS: 'INPUT',
      ACTION: 'FORWARD',
      counter: { name: 'Autre', counterNumber: this.inputRapidoNumber },
    });
  }

  onMyFavorites() {
    this.modalCtrl.dismiss();
    this.bsService.openModal(FavoriteRapidoComponent);
  }

  onInputChange(rapidoNumber) {
    this.inputRapidoNumber = rapidoNumber;
  }

  get rapidoNumberIsValid() {
    return (
      this.inputRapidoNumber &&
      this.inputRapidoNumber.length >= 9 &&
      /^\d+$/.test(this.inputRapidoNumber)
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
          this.feesService.initFees(msisdn);
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
