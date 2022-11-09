import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AccountService } from 'src/app/services/account-service/account.service';
import { take } from 'rxjs/operators';
import { REGEX_NUMBER } from 'src/shared';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

@Component({
  selector: 'app-rattach-number-by-id-card',
  templateUrl: './rattach-number-by-id-card.component.html',
  styleUrls: ['./rattach-number-by-id-card.component.scss'],
})
export class RattachNumberByIdCardComponent implements OnInit {
  @Input() number: string;
  idCard: string;
  isLoading: boolean;
  hasError: boolean;
  mainUser = this.dashbServ.getMainPhoneNumber();
  errorMsg: string;
  typeNumero: 'MOBILE' | 'FIXE';

  constructor(private modContr: ModalController, private dashbServ: DashboardService, private accountServ: AccountService, private oemLoggingService: OemLoggingService) {}

  ngOnInit() {
    this.typeNumero = this.isValidMobileNumber() ? 'MOBILE' : 'FIXE';
  }

  isValidMobileNumber(): boolean {
    return REGEX_NUMBER.test(this.number);
  }

  processRattachment() {
    this.isLoading = true;
    const payload = { identificationId: this.idCard, login: this.mainUser, numero: this.number };

    this.accountServ
      .attachNumberByIdCard(payload)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.hasError = false;
          this.followAttachmentIssues({ numero: payload.numero, idCard: payload.identificationId, typeNumero: this.typeNumero }, 'event');
          this.dismissModal({ success: true, typeRattachment: this.typeNumero, numero: this.number });
        },
        (err: any) => {
          this.isLoading = false;
          this.hasError = true;
          this.followAttachmentIssues({ numero: payload.numero, idCard: payload.identificationId, typeNumero: 'MOBILE' }, 'error');
          this.dismissModal({ success: false, typeRattachment: this.typeNumero, numero: this.number, errorMsg: err.error.title, errorStatus: err.error.status });
        }
      );
  }

  dismissModal(data: { success: boolean; typeRattachment: string; numero: string; errorMsg?: string; errorStatus?: any }) {
    this.modContr.dismiss({
      rattached: data.success,
      typeRattachment: data.typeRattachment,
      numeroToRattach: data.numero,
      errorMsg: data.errorMsg,
      errorStatus: data.errorStatus,
    });
  }

  goBack() {
    this.modContr.dismiss({
      direction: 'BACK',
      typeRattachment: this.typeNumero,
    });
  }

  followAttachmentIssues(payload: { numero: string; idCard: string; typeNumero: 'MOBILE' | 'FIXE' }, eventType: 'error' | 'event') {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        idCard: payload.idCard,
        login: this.mainUser,
      };
      const eventName = `rattachment_${payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'}_success`;
      this.oemLoggingService.registerEvent(eventName, convertObjectToLoggingPayload(infosFollow));
    } else {
      const infosFollow = {
        number_to_attach: payload.numero,
        idCard: payload.idCard,
        login: this.mainUser,
      };
      const errorName = `rattachment_${payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'}_failed`;
      this.oemLoggingService.registerEvent(errorName, convertObjectToLoggingPayload(infosFollow));
    }
  }
}
