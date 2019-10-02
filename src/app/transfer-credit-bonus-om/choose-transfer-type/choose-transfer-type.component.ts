import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_PASS,
  OPERATION_TYPE_SEDDO_BONUS
} from 'src/shared';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { getConsoByCategory, USER_CONS_CATEGORY_CALL } from 'src/app/dashboard';
@Component({
  selector: 'app-choose-transfer-type',
  templateUrl: './choose-transfer-type.component.html',
  styleUrls: ['./choose-transfer-type.component.scss']
})
export class ChooseTransferTypeComponent implements OnInit {
  OPERATION_TYPE_SEDDO_CREDIT = OPERATION_TYPE_SEDDO_CREDIT;
  OPERATION_TYPE_SEDDO_PASS = OPERATION_TYPE_SEDDO_PASS;
  OPERATION_TYPE_SEDDO_BONUS = OPERATION_TYPE_SEDDO_BONUS;
  @Output() TransferTypeEmitter = new EventEmitter();

  soldebonus = 0;
  canTransferBonus: boolean;
  creditRechargement = 0;
  canDoSOS: boolean;
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.getSoldeRechargementAndBonus();
  }

  goNextStep(choice: string) {
    if (
      (choice === OPERATION_TYPE_SEDDO_CREDIT && !this.canDoSOS) ||
      (choice === OPERATION_TYPE_SEDDO_BONUS && this.canTransferBonus)
    ) {
      this.TransferTypeEmitter.emit(choice);
    }
  }
  getSoldeRechargementAndBonus() {
    this.soldebonus = 0;
    this.creditRechargement = 0;
    this.dashboardService
      .getUserConsoInfosByCode([1, 2, 6])
      .subscribe((res: any) => {
        const myconso = getConsoByCategory(res)[USER_CONS_CATEGORY_CALL];
        if (myconso) {
          myconso.forEach(x => {
            if (x.code === 1) {
              this.creditRechargement += Number(x.montant);
            } else if (x.code === 2 || x.code === 6) {
              this.soldebonus += Number(x.montant);
            }
          });
          // Check if eligible for SOS
          this.canDoSOS = +this.creditRechargement < 489;
          // Check if eligible for bonus transfer
          this.canTransferBonus =
            this.creditRechargement > 20 && this.soldebonus > 1;
        }
      });
  }
}
