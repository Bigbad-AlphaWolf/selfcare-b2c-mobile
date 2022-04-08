import {Component, OnInit, Input} from '@angular/core';
import {OperationExtras} from 'src/app/models/operation-extras.model';
import {XeweulService} from 'src/app/services/xeweul/xeweul.service';
import {NavController, ModalController} from '@ionic/angular';
import {BillAmountPage} from 'src/app/pages/bill-amount/bill-amount.page';
import {OPERATION_XEWEUL} from 'src/app/utils/operations.constants';
import {HttpResponse} from '@angular/common/http';
import {IXeweulBalance} from '../../../models/xeweul/xeweul-balance.model';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-xeweul-solde',
  templateUrl: './xeweul-solde.component.html',
  styleUrls: ['./xeweul-solde.component.scss']
})
export class XeweulSoldeComponent implements OnInit {
  @Input() counter: {name: string; counterNumber: string};
  @Input() opXtras: OperationExtras;
  infoSolde: string;
  lastSoldeUpdate: string;
  isLoading: boolean;

  constructor(
    private xeweulService: XeweulService,
    private navCtl: NavController,
    private modal: ModalController,
    private omService: OrangeMoneyService,
    private followServ: FollowAnalyticsService
  ) {}

  ngOnInit() {
    if (this.counter) {
      this.getSolde(this.counter.counterNumber);
    }
  }

  async getSolde(counter: string) {
    this.isLoading = true;
    const omMsisdn = await this.omService.getOmMsisdn().toPromise();
    this.xeweulService.getSolde(counter).subscribe({
      error: () => {
        this.isLoading = false;
        this.followServ.registerEventFollow('operation_xeweul_get_solde_failed', 'event', {
          msisdn: omMsisdn,
          counter
        });
      },

      next: (res: HttpResponse<IXeweulBalance>) => {
        this.isLoading = false;

        this.infoSolde = res.body.amount;
        this.lastSoldeUpdate = res.body.lastUpdatedAt;

        this.followServ.registerEventFollow('operation_xeweul_get_solde_success', 'event', {
          msisdn: omMsisdn,
          counter
        });
      }
    });
  }

  onRecharge() {
    const routePath = BillAmountPage.ROUTE_PATH;
    this.opXtras.purchaseType = OPERATION_XEWEUL;
    this.opXtras.billData ? (this.opXtras.billData.counter = this.counter) : '';
    this.modal.dismiss();
    this.navCtl.navigateForward([routePath], {
      state: this.opXtras
    });
  }
}
