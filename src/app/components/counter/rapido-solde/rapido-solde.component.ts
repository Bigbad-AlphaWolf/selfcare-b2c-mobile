import { Component, OnInit, Input } from '@angular/core';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { RapidoService } from 'src/app/services/rapido/rapido.service';
import { tap, catchError } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { BillAmountPage } from 'src/app/pages/bill-amount/bill-amount.page';
import { OPERATION_RAPIDO } from 'src/app/utils/operations.constants';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

@Component({
  selector: 'app-rapido-solde',
  templateUrl: './rapido-solde.component.html',
  styleUrls: ['./rapido-solde.component.scss'],
})
export class RapidoSoldeComponent implements OnInit {
  @Input() counter: { name: string; counterNumber: string };
  @Input() opXtras: OperationExtras;
  infoSolde: string;
  lastSoldeUpdate: string;
  isLoading: boolean;
  constructor(
    private rapidServ: RapidoService,
    private navCtl: NavController,
    private modal: ModalController,
    private oemLoggingService: OemLoggingService,
    private omService: OrangeMoneyService
  ) {}

  ngOnInit() {
    if (this.counter) this.getSolde(this.counter.counterNumber);
  }

  async getSolde(counter: string) {
    this.isLoading = true;
    const omMsisdn = await this.omService.getOmMsisdn().toPromise();
    this.rapidServ
      .getSolde(counter)
      .pipe(
        tap((res: any) => {
          this.isLoading = false;
          const data = res.content.data;
          if (data) {
            this.infoSolde = data.solde;
            this.lastSoldeUpdate = data.date_solde;
          }

          this.oemLoggingService.registerEvent(
            'operation_rapido_get_solde_success',
            convertObjectToLoggingPayload({
              msisdn: omMsisdn,
              counter,
            })
          );
        }),
        catchError((err: any) => {
          this.isLoading = false;
          this.oemLoggingService.registerEvent(
            'operation_rapido_get_solde_failed',
            convertObjectToLoggingPayload({
              msisdn: omMsisdn,
              counter,
            })
          );
          return err;
        })
      )
      .subscribe();
  }

  onRecharge() {
    const routePath = BillAmountPage.ROUTE_PATH;
    this.opXtras.purchaseType = OPERATION_RAPIDO;
    this.opXtras.billData ? (this.opXtras.billData.counter = this.counter) : '';
    this.modal.dismiss();
    this.navCtl.navigateForward([routePath], {
      state: this.opXtras,
    });
  }
}
