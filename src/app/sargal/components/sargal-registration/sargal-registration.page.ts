import { Component, OnInit } from '@angular/core';
import { CancelOperationPopupComponent } from 'src/shared/cancel-operation-popup/cancel-operation-popup.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { NavController } from '@ionic/angular';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { OPERATION_TYPE_BONS_PLANS } from 'src/shared';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

@Component({
  selector: 'app-sargal-registration',
  templateUrl: './sargal-registration.page.html',
  styleUrls: ['./sargal-registration.page.scss'],
})
export class SargalRegistrationPage implements OnInit {
  public static readonly PATH: string = '/sargal-registration';

  confirmDialog: MatDialogRef<CancelOperationPopupComponent>;
  success: MatDialogRef<ModalSuccessComponent>;
  currentPhoneNumber: string;
  isProcessing: boolean;
  hasError: boolean;
  from: string;
  constructor(
    private navContr: NavController,
    private matDialog: MatDialog,
    private sargalServ: SargalService,
    private dashbServ: DashboardService,
    private oemLoggingService: OemLoggingService
  ) {}
  ngOnInit() {
    this.currentPhoneNumber = this.dashbServ.getCurrentPhoneNumber();
    if (history && history.state && history.state.previousPage) {
      this.from = history.state.previousPage;
    }
  }

  goBack() {
    this.navContr.pop();
  }

  goToRegisterSargal() {
    this.confirmDialog = this.matDialog.open(CancelOperationPopupComponent, {
      data: { cancelDialogRegister: true },
      maxWidth: '92%',
    });
    this.confirmDialog.afterClosed().subscribe((status: any) => {
      if (status) {
        this.isProcessing = true;
        this.hasError = false;
        this.sargalServ.registerToSargal(this.currentPhoneNumber).subscribe(
          () => {
            this.isProcessing = false;
            const eventName = `Registration_Sargal${this.from === OPERATION_TYPE_BONS_PLANS ? '_bons_plans' : ''}_Success`;
            this.oemLoggingService.registerEvent(
              eventName,
              convertObjectToLoggingPayload({
                msisdn: this.currentPhoneNumber,
              })
            );
            const type = 'sargal-success';
            this.openPopUpDialog(type);
            // this.goBack();
          },
          (err: any) => {
            const eventName = `Registration_Sargal${this.from === OPERATION_TYPE_BONS_PLANS ? '_bons_plans' : ''}_Error`;
            this.oemLoggingService.registerEvent(
              eventName,
              convertObjectToLoggingPayload({
                msisdn: this.currentPhoneNumber,
                error: err && err.status ? err.status : 'Une erreur est survenue durant le traitement de la requête',
              })
            );
            const type = 'sargal-failed';
            this.openPopUpDialog(type);
            this.isProcessing = false;
            this.hasError = true;
          }
        );
      }
    });
  }

  openPopUpDialog(type: string) {
    const dialogRef = this.matDialog.open(ModalSuccessComponent, {
      data: { type },
    });
  }
}
