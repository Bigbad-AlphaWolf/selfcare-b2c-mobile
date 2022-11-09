import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { take } from 'rxjs/operators';
import { REGEX_NUMBER } from 'src/shared';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

@Component({
  selector: 'app-rattach-number-by-client-code',
  templateUrl: './rattach-number-by-client-code.component.html',
  styleUrls: ['./rattach-number-by-client-code.component.scss'],
})
export class RattachNumberByClientCodeComponent implements OnInit {
  @Input() number: string;
  clientCode: string;
  isLoading: boolean;
  hasError: boolean;
  mainUser = this.dashbServ.getMainPhoneNumber();
  errorMsg: string;

  constructor(private modContr: ModalController, private dashbServ: DashboardService, private oemLoggingService: OemLoggingService) {}

  ngOnInit() {}

  isValidMobileNumber(): boolean {
    return REGEX_NUMBER.test(this.number);
  }
  processRattachment() {
    this.isLoading = true;
    const typeNumero = this.isValidMobileNumber() ? 'MOBILE' : 'FIXE';
    const payload: { numero: string; idClient: string; typeNumero: 'FIXE' | 'MOBILE' } = { idClient: this.clientCode, numero: this.number, typeNumero: typeNumero };
    this.dashbServ
      .registerNumberByIdClient(payload)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.hasError = false;
          this.followAttachmentIssues({ numero: this.number, clientCode: payload.idClient, typeNumero: typeNumero }, 'event');
          this.dismissModal({ success: true, typeRattachment: typeNumero, numero: this.number });
        },
        (err: any) => {
          this.isLoading = false;
          this.hasError = true;
          this.followAttachmentIssues({ numero: this.number, clientCode: payload.idClient, typeNumero: typeNumero }, 'error');
          this.dismissModal({ success: false, typeRattachment: typeNumero, numero: this.number, errorMsg: err.error.title, errorStatus: err.error.status });
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
    });
  }

  followAttachmentIssues(payload: { numero: string; clientCode: string; typeNumero: 'FIXE' | 'MOBILE' }, eventType: 'error' | 'event') {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        login: this.mainUser,
        codeClient: payload.clientCode,
      };
      const eventName = `rattachment_${payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'}_success`;
      this.oemLoggingService.registerEvent(eventName, convertObjectToLoggingPayload(infosFollow));
    } else {
      const infosFollow = {
        number_to_attach: payload.numero,
        login: this.mainUser,
        codeClient: payload.clientCode,
      };
      const errorName = `rattachment_${payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'}_failed`;
      this.oemLoggingService.registerEvent(errorName, convertObjectToLoggingPayload(infosFollow));
    }
  }
}
