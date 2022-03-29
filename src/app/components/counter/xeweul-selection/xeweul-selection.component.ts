import {Component, OnInit, Input} from '@angular/core';
import {Observable, throwError} from 'rxjs';

import {NewPinpadModalPage} from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';
import {ModalController} from '@ionic/angular';
import {RecentsService} from 'src/app/services/recents-service/recents.service';
import {map, catchError} from 'rxjs/operators';
import {RecentsOem} from 'src/app/models/recents-oem.model';
import {BottomSheetService} from 'src/app/services/bottom-sheet/bottom-sheet.service';
import {OPERATION_XEWEUL} from 'src/app/utils/operations.constants';
import {FavoriteXeweulComponent} from '../favorite-xeweul/favorite-xeweul.component';
import {FavorisService} from 'src/app/services/favoris/favoris.service';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {STATUS_ERROR_CODE_OM_CARD_RAPIDO_NOT_FOUND} from 'src/app/utils/errors.utils';
import {getPageHeader} from 'src/app/utils/title.util';
import {XeweulCounter} from 'src/app/models/xeweul/xeweul.model';
import {CardXeweulNameModalComponent} from '../../card-xeweul-name-modal/card-xeweul-name-modal.component';
import {XeweulService} from '../../../services/xeweul/xeweul.service';
import {IXeweulCard, XeweulCard} from '../../../models/xeweul/card.model';

@Component({
  selector: 'app-xeweul-selection',
  templateUrl: './xeweul-selection.component.html',
  styleUrls: ['./xeweul-selection.component.scss']
})
export class XeweulSelectionComponent implements OnInit {
  @Input() operation: string = OPERATION_XEWEUL;
  isProcessing = false;
  inputXeweulNumber = '';
  xeweuls$: Observable<any[]>;
  xeweulsFavorites$: Observable<IXeweulCard[]>;
  isFavoriteCarteXeweul: boolean;
  currentUserNumber = this.dashbServ.getCurrentPhoneNumber();
  errorMsg = null;
  xeweulCards?: Observable<IXeweulCard[]>;

  constructor(
    private bsService: BottomSheetService,
    private omService: OrangeMoneyService,
    private recentService: RecentsService,
    private modalCtrl: ModalController,
    private favoriService: FavorisService,
    private xeweulService: XeweulService,
    private dashbServ: DashboardService
  ) {}

  ngOnInit() {
    this.checkOmAccountSession();
  }

  getPageTitle(operationType: string) {
    return getPageHeader(operationType).title;
  }

  getXeweulCards() {
    this.xeweulsFavorites$ = this.xeweulService.favoritesByService();
  }

  async isFavoriteXeweul(carteXeweul: any) {
    this.isProcessing = true;
    return await this.xeweulsFavorites$
      .pipe(
        map((res: XeweulCard[]) => {
          return res.map((item: XeweulCard) => {
            return {
              counterNumber: item.id,
              name: item.label
            };
          });
        }),
        map((res: {name: string; counterNumber: string}[]) => {
          this.isProcessing = false;
          const carte = res.find((c: {name: string; counterNumber: string}) => {
            return c.counterNumber === carteXeweul;
          });
          return carte;
        }),
        catchError((err: any) => {
          this.isProcessing = false;
          return err;
        })
      )
      .toPromise();
  }

  initRecents() {
    this.xeweuls$ = this.recentService.fetchRecents(OPERATION_XEWEUL, 3).pipe(
      map((recents: RecentsOem[]) => {
        let results = [];
        recents.forEach(el => {
          results.push({
            name: el.titre,
            counterNumber: JSON.parse(el.payload).numero_carte
          });
        });
        return results;
      })
    );
  }

  async onContinue() {
    this.errorMsg = null;
    let counterXeweul = this.inputXeweulNumber.padStart(16, '0');
    if (!this.xeweulNumberIsValid) {
      return;
    }
    const favoriteXeweul: XeweulCounter = await this.isFavoriteXeweul(counterXeweul);
    if (!favoriteXeweul) {
      this.openCardXeweulNameModal(counterXeweul);
    } else {
      this.modalCtrl.dismiss({
        TYPE_BS: 'INPUT',
        ACTION: 'FORWARD',
        counter: {name: favoriteXeweul.name, counterNumber: counterXeweul},
        operation: this.operation
      });
    }
  }

  async openCardXeweulNameModal(counter: string) {
    const modal = await this.modalCtrl.create({
      component: CardXeweulNameModalComponent,
      componentProps: {
        counter
      },
      cssClass: 'select-recipient-modal'
    });
    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res?.label_carte) {
        const data = {
          msisdn: this.currentUserNumber,
          card_num: counter,
          card_label: res.label_carte
        };
        this.saveCardXeweulFavorite(data).subscribe(() => {
          this.isProcessing = false;
          this.modalCtrl.dismiss({
            TYPE_BS: 'INPUT',
            ACTION: 'FORWARD',
            counter: {name: data.card_label, counterNumber: counter},
            operation: this.operation
          });
        });
      }
    });

    return await modal.present();
  }

  saveCardXeweulFavorite(data: {msisdn: string; card_num: string; card_label: string}) {
    this.isProcessing = true;
    return this.favoriService.saveXeweulFavorite(data).pipe(
      catchError((err: any) => {
        this.isProcessing = false;
        console.log(err);
        if (err && err.error && err.error.errorCode === STATUS_ERROR_CODE_OM_CARD_RAPIDO_NOT_FOUND) {
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
    this.bsService.openModal(FavoriteXeweulComponent, {
      xeweulsFavorites$: this.xeweulsFavorites$,
      operation: this.operation
    });
  }

  onInputChange(xeweulNumber) {
    this.inputXeweulNumber = xeweulNumber;
  }

  get xeweulNumberIsValid() {
    return this.inputXeweulNumber && this.inputXeweulNumber.length >= 2 && /^\d+$/.test(this.inputXeweulNumber);
  }

  checkOmAccountSession() {
    this.isProcessing = true;
    this.omService.omAccountSession().subscribe(
      (omSession: any) => {
        this.isProcessing = false;
        if (omSession.msisdn === 'error' || !omSession.hasApiKey || omSession.loginExpired) {
          this.openPinpad();
        }
        if (omSession.msisdn !== 'error') {
          //this.initRecents();
          this.bsService.opXtras.senderMsisdn = omSession.msisdn;
          //this.getFavoritesXeweul();
          this.getXeweulCards();
        }
      },
      () => {
        this.isProcessing = false;
      }
    );
  }

  async openPinpad() {
    const modal = await this.modalCtrl.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null
      }
    });
    modal.onDidDismiss().then(response => {
      if (response.data && response.data.success) {
        this.bsService.opXtras.omSession.loginExpired = false;
      } else {
        this.modalCtrl.dismiss({});
      }
    });
    return await modal.present();
  }
}
