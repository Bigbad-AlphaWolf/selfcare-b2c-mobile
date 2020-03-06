import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormuleMobileModel,
  JAMONO_MAX_CODE_FORMULE,
  JAMONO_NEW_SCOOL_CODE_FORMULE,
  JAMONO_ALLO_CODE_FORMULE
} from 'src/shared';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormuleService } from 'src/app/services/formule-service/formule.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { CancelOperationPopupComponent } from 'src/shared/cancel-operation-popup/cancel-operation-popup.component';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-see-details-formule',
  templateUrl: './see-details-formule.component.html',
  styleUrls: ['./see-details-formule.component.scss']
})
export class SeeDetailsFormuleComponent implements OnInit {
  @Input() formule: FormuleMobileModel;
  @Input() msisdn: string;
  @Output() goBackToListFormules = new EventEmitter();
  cancelDialog: MatDialogRef<CancelOperationPopupComponent>;
  error = 'Une erreur est survenue durant l\'opération';
  hasError: boolean;
  changeFormuleProcessing: boolean;
  images = [
    {
      codeFormule: JAMONO_MAX_CODE_FORMULE,
      icon: '/assets/images/background-header-jamono-max.jpg'
    },
    {
      codeFormule: JAMONO_NEW_SCOOL_CODE_FORMULE,
      icon: '/assets/images/background-header-jamono-new-scool.jpg'
    },
    {
      codeFormule: JAMONO_ALLO_CODE_FORMULE,
      icon: '/assets/images/background-header-jamono-allo.jpg'
    }
  ];
  userSubscription: any;
  constructor(
    private matDialog: MatDialog,
    private formuleServ: FormuleService,
    private authService: AuthenticationService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.authService.getSubscription(this.msisdn).subscribe((subscription: any) => {
      this.userSubscription = subscription;
    });
  }

  getImgByFormule(formule: FormuleMobileModel) {
    let img;
    if (formule && formule.code) {
      img = this.images.find(image => {
        return image.codeFormule === formule.code;
      });
    }
    return img && img.icon
      ? img.icon
      : '/assets/images/background-header-jamono-allo.jpg';
  }

  confirmChangeFormule() {
    this.hasError = false;
    if (!this.changeFormuleProcessing) {
      this.cancelDialog = this.matDialog.open(CancelOperationPopupComponent, {
        data: { canceldialogPageFormule: this.formule.nomFormule }
      });

      this.cancelDialog.afterClosed().subscribe((yesChoice: boolean) => {
        if (yesChoice) {
          this.hasError = false;
          this.changeFormuleProcessing = true;
          this.formuleServ
            .changerFormuleJamono(this.msisdn, this.formule)
            .subscribe(
              () => {
                this.followAnalyticsService.registerEventFollow(
                  'change_formule_success',
                  'event',
                  { msisdn: this.msisdn, previous_code_formule: this.userSubscription.code , next_code_formule: this.formule.code }
                );
                this.authService.deleteSubFromStorage(this.msisdn);
                this.changeFormuleProcessing = false;
                this.authService.UpdateNotificationInfo();
                this.goBackToListFormules.emit();
              },
              (error: any) => {
                this.changeFormuleProcessing = false;
                this.hasError = true;
                this.followAnalyticsService.registerEventFollow(
                  'change_formule_error',
                  'error',
                  { msisdn: this.msisdn, current_code_formule: this.userSubscription.code , next_code_formule: this.formule.code, error_status: error.status }
                );
              }
            );
        }
      });
    }
  }
}
