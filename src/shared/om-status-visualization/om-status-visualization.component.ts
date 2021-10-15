import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CustomerOperationStatus } from 'src/app/models/enums/om-customer-status.enum';
import {
  OMCustomerStatusModel,
  OMStatusOperationEnum,
} from 'src/app/models/om-customer-status.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { OM_STATUS_TEXTS } from '..';

@Component({
  selector: 'app-om-status-visualization',
  templateUrl: './om-status-visualization.component.html',
  styleUrls: ['./om-status-visualization.component.scss'],
})
export class OmStatusVisualizationComponent implements OnInit {
  statusText: string;
  buttonText: string;
  status: OMCustomerStatusModel;
  checkingStatus: boolean;
  notRegisteredInOeM: boolean;
  hasError: boolean;
  OMStatusOperationEnum = OMStatusOperationEnum;
  constructor(
    private orangeMoneyService: OrangeMoneyService,
    private dashboardService: DashboardService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.checkStatus();
  }

  checkStatus() {
    this.checkingStatus = true;
    this.hasError = false;
    this.orangeMoneyService
      .getOmMsisdn()
      .pipe(
        switchMap((omMsisdn) => {
          if (!omMsisdn || omMsisdn === 'error') {
            omMsisdn = this.dashboardService.getCurrentPhoneNumber();
          }
          return this.orangeMoneyService.getUserStatus(omMsisdn).pipe(
            map((status: OMCustomerStatusModel) => {
              this.status = status;
              this.checkingStatus = false;
            }),
            catchError((err) => {
              this.checkingStatus = false;
              this.hasError = true;
              return throwError(err);
            })
          );
        }),
        catchError((err) => {
          this.checkingStatus = false;
          this.hasError = true;
          return throwError(err);
        })
      )
      .subscribe();
  }

  isButtonEnabled() {
    return (
      this.status &&
      (this.status?.operationStatus === CustomerOperationStatus.new ||
        this.status?.operationStatus ===
          CustomerOperationStatus.password_creation)
    );
  }

  isButtonShown() {
    return this.status && this.status?.operation !== OMStatusOperationEnum.FULL;
  }

  getStatusText() {
    switch (this.status?.operation) {
      case OMStatusOperationEnum.DEPLAFONNEMENT:
        switch (this.status?.operationStatus) {
          case CustomerOperationStatus.new:
            return OM_STATUS_TEXTS.CAPPED_ACCOUNT;
          case CustomerOperationStatus.ongoing:
            return OM_STATUS_TEXTS.DECAPPING_ACCOUNT;
          case CustomerOperationStatus.completed:
            return OM_STATUS_TEXTS.DECAPPED_ACCOUNT;
          case CustomerOperationStatus.error:
            return OM_STATUS_TEXTS.ERROR_DECAPPING_ACCOUNT;
        }
        break;
      case OMStatusOperationEnum.OUVERTURE_COMPTE:
        switch (this.status?.operationStatus) {
          case CustomerOperationStatus.new:
            return OM_STATUS_TEXTS.NO_ACCOUNT;
          case CustomerOperationStatus.ongoing:
            return OM_STATUS_TEXTS.OPENING_ACCOUNT;
          case CustomerOperationStatus.completed:
            return OM_STATUS_TEXTS.OPENED_ACCOUNT;
          case CustomerOperationStatus.error:
            return OM_STATUS_TEXTS.ERROR_OPENING_ACCOUNT;
        }
        break;
      case OMStatusOperationEnum.FULL:
        return OM_STATUS_TEXTS.DECAPPED_ACCOUNT;
    }
  }

  getButtonText() {
    switch (this.status?.operation) {
      case OMStatusOperationEnum.DEPLAFONNEMENT:
        switch (this.status?.operationStatus) {
          case CustomerOperationStatus.new:
          case CustomerOperationStatus.ongoing:
          case CustomerOperationStatus.completed:
          case CustomerOperationStatus.error:
            return OM_STATUS_TEXTS.DECAP_ACCOUNT;
        }
        break;
      case OMStatusOperationEnum.OUVERTURE_COMPTE:
        switch (this.status?.operationStatus) {
          case CustomerOperationStatus.new:
          case CustomerOperationStatus.ongoing:
          case CustomerOperationStatus.error:
            return OM_STATUS_TEXTS.OPEN_ACCOUNT;
          case CustomerOperationStatus.completed:
            return OM_STATUS_TEXTS.CREATE_PIN;
        }
        break;
    }
  }

  continue() {
    this.modalController.dismiss();
    switch (this.status?.operation) {
      case OMStatusOperationEnum.DEPLAFONNEMENT:
        this.router.navigate(['/om-self-operation/deplafonnement']);
        break;
      case OMStatusOperationEnum.OUVERTURE_COMPTE:
        this.router.navigate(['/om-self-operation/open-om-account']);
        break;
    }
  }
}
