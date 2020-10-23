import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ModalController } from '@ionic/angular';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { map, catchError } from 'rxjs/operators';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { OPERATION_RAPIDO } from 'src/app/utils/operations.constants';
import { FavoriteRapidoComponent } from '../favorite-rapido/favorite-rapido.component';
import { FeesService } from 'src/app/services/fees/fees.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { FavoriteType } from 'src/app/models/enums/om-favori-type.enum';
import { FavorisOem } from 'src/app/models/favoris-oem.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { STATUS_ERROR_CODE_OM_CARD_RAPIDO_NOT_FOUND } from 'src/app/utils/errors.utils';
import { getPageHeader } from 'src/app/utils/title.util';
import { RapidoCounter } from 'src/app/models/rapido.model';

@Component({
  selector: 'app-rapido-selection',
  templateUrl: './rapido-selection.component.html',
  styleUrls: ['./rapido-selection.component.scss'],
})
export class RapidoSelectionComponent implements OnInit {
  @Input() operation: string = OPERATION_RAPIDO;
  isProcessing: boolean = false;
  inputRapidoNumber: string = '';
  // rapidos$: Observable<RapidoOem[]> = of([
  //   { name: 'Maison Nord-foire', rapidoNumber: '14256266199' },
  //   { name: 'Audi Q5', rapidoNumber: '14256266199' },
  // ]);
  rapidos$: Observable<any[]>;
  rapidosFavorites$: Observable<any[]>;
  isFavoriteCarteRapido: boolean;
  currentUserNumber = this.dashbServ.getCurrentPhoneNumber();
  errorMsg = null;
  constructor(
    private feesService: FeesService,
    private bsService: BottomSheetService,
    private omService: OrangeMoneyService,
    private recentService: RecentsService,
    private modalCtrl: ModalController,
    private favoriService: FavorisService,
    private dashbServ: DashboardService
  ) {}

  ngOnInit() {
    this.checkOmAccountSession();
  }

  getPageTitle(operationType: string) {
    return getPageHeader(operationType).title;
  }

  getFavoritesRapido() {
    this.rapidosFavorites$ = this.favoriService
      .favoritesByService(FavoriteType.RAPIDO)
      .pipe(
        map((favoris: FavorisOem[]) => {
          let results = [];
          favoris = favoris.slice(0, 5);
          favoris.forEach((el) => {
            results.push({ name: el.ref_label, counterNumber: el.ref_num });
          });
          return results;
        })
      );
  }

  async isFavoriteRapido(carteRapido: any) {
    this.isProcessing = true;
    return await this.rapidosFavorites$
      .pipe(
        map((res: { name: string; counterNumber: string }[]) => {
          this.isProcessing = false;
          const carte = res.find(
            (c: { name: string; counterNumber: string }) => {
              return c.counterNumber === carteRapido;
            }
          );
          return !!carte;
        }),
        catchError((err: any) => {
          this.isProcessing = false;
          return err;
        })
      )
      .toPromise();
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

  onRecentRapidoSlected(rapido: RapidoCounter) {
    this.onContinue(rapido);
  }

  async onContinue(rapido?: RapidoCounter) {
    this.errorMsg = null;
    let counterRapido = rapido ? rapido.counterNumber : this.inputRapidoNumber;

    if (!this.rapidoNumberIsValid && !rapido) return;
    let isFavoriteRapido = await this.isFavoriteRapido(counterRapido);
    if (!isFavoriteRapido) {
      const data = {
        msisdn: this.currentUserNumber,
        card_num: counterRapido,
        card_label: '',
      };
      this.saveCardRapidoFavorite(data).subscribe(() => {
        this.isProcessing = false;
        this.modalCtrl.dismiss({
          TYPE_BS: 'INPUT',
          ACTION: 'FORWARD',
          counter: { name: 'Autre', counterNumber: counterRapido },
          operation: this.operation,
        });
      });
    } else {
      this.modalCtrl.dismiss({
        TYPE_BS: 'INPUT',
        ACTION: 'FORWARD',
        counter: { name: 'Autre', counterNumber: counterRapido },
        operation: this.operation,
      });
    }
  }

  saveCardRapidoFavorite(data: {
    msisdn: string;
    card_num: string;
    card_label: string;
  }) {
    this.isProcessing = true;
    return this.favoriService.saveRapidoFavorite(data).pipe(
      catchError((err: any) => {
        this.isProcessing = false;
        if (
          err &&
          err.error &&
          err.error.errorCode === STATUS_ERROR_CODE_OM_CARD_RAPIDO_NOT_FOUND
        ) {
          this.errorMsg = err.error.message;
        } else {
          this.errorMsg = 'Une erreur est survenue';
        }
        return throwError(err);
      })
    );
  }

  onMyFavorites() {
    this.modalCtrl.dismiss();
    this.bsService.openModal(FavoriteRapidoComponent, {
      rapidosFavorites$: this.rapidosFavorites$,
      operation: this.operation,
    });
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

  checkOmAccountSession() {
    this.isProcessing = true;
    this.omService.omAccountSession().subscribe(
      (omSession: any) => {
        this.isProcessing = false;
        if (
          omSession.msisdn === 'error' ||
          !omSession.hasApiKey ||
          omSession.loginExpired
        ) {
          this.modalCtrl.dismiss();
          this.openPinpad();
        }
        if (omSession.msisdn !== 'error') {
          this.initRecents();
          this.bsService.opXtras.senderMsisdn = omSession.msisdn;
          this.feesService.initFees(omSession.msisdn);
          this.getFavoritesRapido();
        }
      },
      (err) => {
        this.isProcessing = false;
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
