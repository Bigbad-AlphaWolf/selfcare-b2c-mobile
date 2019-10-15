import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SoSModel } from 'src/app/services/sos-service';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_SOS,
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_PASS,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_TRANSFER_OM,
  OPERATION_TYPE_SOS_PASS,
  OPERATION_TYPE_SOS_CREDIT,
  OPERATION_TRANSFER_OM_WITH_CODE,
  OPERATION_TRANSFER_OM,
  GiftSargalItem
} from '..';
import {
  OPERATION_TYPE_SARGAL_CONVERSION,
  SargalSubscriptionModel
} from 'src/app/dashboard';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';

@Component({
  selector: 'app-operation-success-or-fail',
  templateUrl: './operation-success-or-fail.component.html',
  styleUrls: ['./operation-success-or-fail.component.scss']
})
export class OperationSuccessOrFailComponent implements OnInit {
  @Input() failed: boolean;
  @Input() operationType;
  @Input() buyForMe;
  @Input() recipient;
  @Input() amountRecharged;
  @Input() amountTransfered;
  @Input() paymentMod: string;
  @Input() sosChosen: SoSModel;
  @Input() passIntChosen: any; // PassInfoModel | PromoPassModel;
  @Input() passIllChosen: any; // PassIllimModel | PromoPassIllimModel;
  @Input() recipientFirstName: string;
  @Input() recipientLastName: string;
  @Input() errorMessage: string;
  @Input() giftSargal: GiftSargalItem;

  @Output() newOperation = new EventEmitter();
  OPERATION_TYPE_PASS_INTERNET = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_TYPE_PASS_ILLIMIX = OPERATION_TYPE_PASS_ILLIMIX;
  OPERATION_TYPE_RECHARGE_CREDIT = OPERATION_TYPE_RECHARGE_CREDIT;
  OPERATION_TYPE_SOS = OPERATION_TYPE_SOS;
  OPERATION_TYPE_SEDDO_CREDIT = OPERATION_TYPE_SEDDO_CREDIT;
  OPERATION_TYPE_SEDDO_PASS = OPERATION_TYPE_SEDDO_PASS;
  OPERATION_TYPE_SEDDO_BONUS = OPERATION_TYPE_SEDDO_BONUS;
  // OPERATION_TRANSFER_OM = OPERATION_TYPE_TRANSFER_OM;
  OPERATION_TYPE_SOS_PASS = OPERATION_TYPE_SOS_PASS;
  OPERATION_TYPE_SOS_CREDIT = OPERATION_TYPE_SOS_CREDIT;
  OPERATION_TRANSFER_OM_WITH_CODE = OPERATION_TRANSFER_OM_WITH_CODE;
  OPERATION_TRANSFER_OM = OPERATION_TRANSFER_OM;
  OPERATION_TYPE_SARGAL_CONVERSION = OPERATION_TYPE_SARGAL_CONVERSION;
  hasSargal: boolean;
  sargalPoints: number;

  constructor(
    private router: Router,
    private dashbordServ: DashboardService,
    private sargalServ: SargalService
  ) {}

  ngOnInit() {
    if (this.amountRecharged) {
      this.sargalPoints = Math.round(this.amountRecharged / 100);
      const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
      this.sargalServ.getSargalBalance(currentNumber).subscribe(
        (res: SargalSubscriptionModel) => {
          if (
            res.status === 'NOT_SUBSCRIBED' ||
            res.status === 'UNSUBSCRIPTION_ONGOING'
          ) {
            this.hasSargal = false;
          } else {
            this.hasSargal = true;
          }
        },
        (err: any) => {
          this.hasSargal = false;
        }
      );
    }
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goNewOperation() {
    this.newOperation.emit();
  }
}
