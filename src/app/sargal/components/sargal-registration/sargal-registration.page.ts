import { Component, OnInit } from '@angular/core';
import { CancelOperationPopupComponent } from 'src/shared/cancel-operation-popup/cancel-operation-popup.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-sargal-registration',
  templateUrl: './sargal-registration.page.html',
  styleUrls: ['./sargal-registration.page.scss']
})
export class SargalRegistrationPage implements OnInit {
  confirmDialog: MatDialogRef<CancelOperationPopupComponent>;
  currentPhoneNumber: string;
  isProcessing: boolean;
  hasError: boolean;
  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private sargalServ: SargalService,
    private dashbServ: DashboardService,
    private followService: FollowAnalyticsService
  ) {}
  ngOnInit() {
    this.currentPhoneNumber = this.dashbServ.getCurrentPhoneNumber();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToRegisterSargal() {
    this.confirmDialog = this.matDialog.open(CancelOperationPopupComponent, {
      data: { cancelDialogRegister: true },
      maxWidth: '92%'
    });
    this.confirmDialog.afterClosed().subscribe((status: any) => {
      if (status) {
        this.isProcessing = true;
        this.hasError = false;
        this.sargalServ.registerToSargal(this.currentPhoneNumber).subscribe(
          (res: any) => {
            this.isProcessing = false;
            this.followService.registerEventFollow(
              'Registration_Sargal_Success',
              'event',
              {
                msisdn: this.currentPhoneNumber
              }
            );
            this.goBack();
          },
          (err: any) => {
            this.followService.registerEventFollow(
              'Registration_Sargal_Error',
              'error',
              {
                msisdn: this.currentPhoneNumber,
                error:
                  err && err.status
                    ? err.status
                    : 'Une erreur est survenue durant le traitement de la requête'
              }
            );
            this.isProcessing = false;
            this.hasError = true;
          }
        );
      }
    });
  }
}
