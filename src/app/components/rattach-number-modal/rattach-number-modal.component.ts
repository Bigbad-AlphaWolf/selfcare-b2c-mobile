import { Component, OnInit } from '@angular/core';
import { REGEX_FIX_NUMBER, REGEX_NUMBER } from 'src/shared';
import { MatDialog } from '@angular/material';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { ModalController } from '@ionic/angular';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-rattach-number-modal',
  templateUrl: './rattach-number-modal.component.html',
  styleUrls: ['./rattach-number-modal.component.scss'],
})
export class RattachNumberModalComponent implements OnInit {
  isLoading: boolean;
  phoneNumber: string;
  hasError: boolean;
  isInputValid: boolean;
  msgError: string;
  mainNumber = this.dashbServ.getMainPhoneNumber();
  constructor(private dialog: MatDialog, private modalCon: ModalController, private dashbServ: DashboardService, private followAnalyticsService: FollowAnalyticsService) { }

  ngOnInit() {}

  isValidMobileNumber(): boolean {
    return REGEX_NUMBER.test(this.phoneNumber);
  }
  
  isValidFixNumber(): boolean {
    return REGEX_FIX_NUMBER.test(this.phoneNumber);
  }

  isValid() {
    const isMobile =  this.isValidMobileNumber();
    const isFix =  this.isValidFixNumber();
   
    this.isInputValid = isMobile || isFix;
  }

  processRattachement() {
    this.isLoading = true;
    this.hasError = false;
    this.msgError = null;
    const payload : { numero: string, typeNumero: "MOBILE" | "FIXE" } = { numero: this.phoneNumber, typeNumero: this.isValidMobileNumber ? "MOBILE" : "FIXE" };
    this.dashbServ.registerNumberToAttach(payload).pipe((tap((res: any) => {
      this.openSuccessDialog(payload.numero);
    }))
    ).subscribe((res: any) => {
      this.isLoading = false;
      this.hasError = false;
      this.followAttachmentIssues(payload, 'event')

    }, (err: any) => {
      this.isLoading = false;
      this.hasError = true;
      this.followAttachmentIssues(payload, 'error');
      if(err && (err.error.errorKey === 'userRattached' || err.error.errorKey === 'userexists')) {
        this.msgError = err.error.title ? err.error.title : "Impossible d'effectuer le rattachement de la ligne " ;
      } else {
        if(this.isValidMobileNumber()){
          this.openRattachementNumberByIdCardModal(this.phoneNumber);
        } else {
          this.nextStepRattachement(false, this.phoneNumber, "FIXE")
        }
      }
    })
    
  }

  openSuccessDialog(phoneNumber?: string) {
    this.dialog.open(ModalSuccessComponent, {
      data: { type: 'rattachment-success', rattachedNumber: phoneNumber },
      width: '95%',
      maxWidth: '375px'
    });
  }

  nextStepRattachement(status: boolean, numeroToRattach: string, typeNumber: 'MOBILE' | 'FIXE') {
    this.modalCon.dismiss({
      'rattached': status,
      'numeroToRattach': numeroToRattach,
      'typeRattachment' : typeNumber
    })
  }
  openRattachementNumberByIdCardModal(numeroToRattach: string) {
    this.modalCon.dismiss({
      'rattached': false,
      'typeRattachment' : 'MOBILE',
      'numeroToRattach': numeroToRattach
    });
  }

  followAttachmentIssues(
    payload: { numero: string; typeNumero: string },
    eventType: 'error' | 'event'
  ) {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        login: this.mainNumber
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
        login: this.mainNumber
      };
      const errorName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_failed`;
      this.followAnalyticsService.registerEventFollow(
        errorName,
        eventType,
        infosFollow
      );
    }
  }
}
