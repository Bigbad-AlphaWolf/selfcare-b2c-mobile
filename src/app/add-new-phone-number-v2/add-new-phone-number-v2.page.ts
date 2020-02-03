import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { REGEX_FIX_NUMBER, REGEX_NUMBER } from 'src/shared';

@Component({
  selector: 'app-add-new-phone-number-v2',
  templateUrl: './add-new-phone-number-v2.page.html',
  styleUrls: ['./add-new-phone-number-v2.page.scss']
})
export class AddNewPhoneNumberV2Page implements OnInit {
  isValidNumber: boolean;
  currentUserNumber: string;
  successDialog: MatDialogRef<ModalSuccessComponent>;
  hasError: boolean;
  errorMsg: string;
  isProcessing: boolean;
  constructor(
    private dashboardServ: DashboardService,
    private dialog: MatDialog,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.currentUserNumber = this.dashboardServ.getCurrentPhoneNumber();
  }
  validNumber(msisdn: string) {
    return REGEX_FIX_NUMBER.test(msisdn) || REGEX_NUMBER.test(msisdn);
  }

  getNumberType(msisdn: string) {
    let type: 'MOBILE' | 'FIXE' = 'MOBILE';
    if (REGEX_FIX_NUMBER.test(msisdn)) {
      type = 'FIXE';
    }
    return type;
  }
  enableNextBtn(msisdn: string) {
    this.isValidNumber = this.validNumber(msisdn);
  }
  saveRattachmentNumber(msisdn: string) {
    this.hasError = false;
    this.errorMsg = null;
    this.isProcessing = true;
    const payload = {
      login: this.currentUserNumber,
      numero: msisdn,
      typeNumero: this.getNumberType(msisdn)
    };
    this.dashboardServ.registerNumberToAttach(payload).subscribe(
      (res: any) => {
        this.isProcessing = false;
        this.followAttachmentIssues(payload, 'event');
        this.successDialog = this.dialog.open(ModalSuccessComponent, {
          data: { type: 'rattachment-success' },
          width: '95%',
          maxWidth: '375px'
        });
      },
      (err: any) => {
        this.isProcessing = false;
        this.hasError = true;
        this.successDialog = this.dialog.open(ModalSuccessComponent, {
          data: { type: 'rattachment-failed' },
          width: '95%',
          maxWidth: '375px'
        });
        this.errorMsg = err.error.title;
        this.followAttachmentIssues(payload, 'error');
      }
    );
  }

  followAttachmentIssues(
    payload: { login: string; numero: string; typeNumero: string },
    eventType: 'error' | 'event'
  ) {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        login: payload.login
      };
      const eventName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_success`;
      this.followAnalyticsService.registerEventFollow(
        eventName,
        eventType,
        infosFollow
      );
    } else {
      const infosFollow = {
        number_to_attach: payload.numero,
        login: payload.login
      };
      const errorName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_failed`;
      this.followAnalyticsService.registerEventFollow(
        errorName,
        eventType,
        infosFollow
      );
      console.log(errorName, infosFollow);
    }
  }
}
