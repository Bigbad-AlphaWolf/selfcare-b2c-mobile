import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FormuleService } from 'src/app/services/formule-service/formule.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
import { CancelOperationPopupComponent } from 'src/shared/cancel-operation-popup/cancel-operation-popup.component';

@Component({
  selector: 'app-change-offer-popup',
  templateUrl: './change-offer-popup.component.html',
  styleUrls: ['./change-offer-popup.component.scss'],
})
export class ChangeOfferPopupComponent implements OnInit {
  @Input() formule;
  @Input() banner;
  cancelDialog: MatDialogRef<CancelOperationPopupComponent>;
  hasError: boolean;
  changeFormuleProcessing: boolean;
  userSubscription: any;
  msisdn = this.dashboardService.getCurrentPhoneNumber();
  constructor(
    private matDialog: MatDialog,
    private formuleServ: FormuleService,
    private authService: AuthenticationService,
    private oemLoggingService: OemLoggingService,
    private dashboardService: DashboardService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.authService.getSubscription(this.msisdn).subscribe((subscription: any) => {
      this.userSubscription = subscription;
    });
  }

  confirmChangeFormule() {
    this.hasError = false;
    if (!this.changeFormuleProcessing) {
      console.log('clik');

      this.cancelDialog = this.matDialog.open(CancelOperationPopupComponent, {
        data: { canceldialogPageFormule: this.formule.nomFormule },
      });
      this.cancelDialog.afterClosed().subscribe((yesChoice: boolean) => {
        if (yesChoice) {
          this.hasError = false;
          this.changeFormuleProcessing = true;
          this.formuleServ.changerFormuleJamono(this.msisdn, this.formule).subscribe(
            () => {
              this.oemLoggingService.registerEvent(
                'change_formule_success',
                convertObjectToLoggingPayload({
                  msisdn: this.msisdn,
                  previous_code_formule: this.userSubscription.code,
                  next_code_formule: this.formule.code,
                })
              );
              this.authService.deleteSubFromStorage(this.msisdn);
              this.changeFormuleProcessing = false;
              // this.authService.UpdateNotificationInfo();
              this.modalController.dismiss('changed');
            },
            (error: any) => {
              this.changeFormuleProcessing = false;
              this.hasError = true;
              this.oemLoggingService.registerEvent(
                'change_formule_error',
                convertObjectToLoggingPayload({
                  msisdn: this.msisdn,
                  current_code_formule: this.userSubscription.code,
                  next_code_formule: this.formule.code,
                  error_status: error.status,
                })
              );
            }
          );
        }
      });
    }
  }
}
