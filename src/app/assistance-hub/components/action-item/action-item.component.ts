import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OffreService } from 'src/app/models/offre-service.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';
import {
  FIND_AGENCE_EXTERNAL_URL,
  CHECK_ELIGIBILITY_EXTERNAL_URL,
  OPERATION_INIT_CHANGE_PIN_OM,
} from 'src/shared';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.scss'],
})
export class ActionItemComponent implements OnInit {
  @Input() action: OffreService;
  @Input() search: boolean = false;
  FILE_BASE_URL: string = FILE_DOWNLOAD_ENDPOINT;
  imageUrl: string;

  constructor(
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private inAppBrowser: InAppBrowser,
    private modalController: ModalController,
    private dashbServ: DashboardService
  ) {}

  ngOnInit() {
    this.imageUrl = this.action.icone
      ? this.FILE_BASE_URL + '/' + this.action.icone
      : null;
  }

  doAction() {
    switch (this.action.code) {
      case 'FIBRE_OPTIC':
        this.goFiberEligibility();
        break;
      case 'CODE_PUK':
        this.goPuk();
        break;
      case 'SET_INTERNET':
        this.goInternet();
        break;
      case 'SEDDO_CODE':
        this.goChangeSeddo();
        break;
      case 'SUIVI_DEMANDE':
        this.onFollowUpRequests();
        break;
      case 'DEPLAFONNEMENT':
        this.goDeplafonnement();
        break;
      case 'TRANSACTION_ERROR':
        this.goReclamation();
        break;
      case 'OUVERTURE_OM_ACCOUNT':
        this.goCreateOMAccount();
        break;
      case 'SEARCH_AGENCY':
        this.goFindToAgenceWebSite();
        break;
      case 'CHANGE_PIN_OM':
        this.openPinpad();
        break;
      case 'IBOU_CONTACT':
        this.goIbouPage();
        break;
      case 'CANCEL_TRANSACTION_OM':
        this.goToFormulaireCancelOMTransaction();
        break;
      default:
        break;
    }
  }

  goIbouPage() {
    this.router.navigate(['/contact-ibou-hub']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_Hub_Ibou_card_clic',
      'event',
      'clicked'
    );
  }

  goFiberEligibility() {
    this.inAppBrowser.create(CHECK_ELIGIBILITY_EXTERNAL_URL, '_self');
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_eligibilité_fibre_clic',
      'event',
      'clicked'
    );
  }

  goPuk() {
    this.router.navigate(['/control-center/puk']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Find_PUK_clic',
      'event',
      'clicked'
    );
  }

  goChangeSeddo() {
    this.router.navigate(['/control-center/change-seddo-code']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Change_Seddo_PIN_clic',
      'event',
      'clicked'
    );
  }

  goInternet() {
    this.router.navigate(['/control-center/internet-mobile']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Parametrage_Internet_Mobile_clic',
      'event',
      'clicked'
    );
  }
  goCreateOMAccount() {
    this.router.navigate(['/control-center/operation-om/creation-compte']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Creation_Compte_OM_clic',
      'event',
      'clicked'
    );
  }

  goDeplafonnement() {
    // this.router.navigate(['/control-center/operation-om/deplafonnement']);
    this.router.navigate(['/new-deplafonnement-om']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Deplafonnement_OM_clic',
      'event',
      'clicked'
    );
  }

  goReclamation() {
    this.router.navigate(['/reclamation-om-transaction']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Reclamation_OM_clic',
      'event',
      'clicked'
    );
  }

  onFollowUpRequests() {
    this.router.navigate(['follow-up-requests']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_suivi_demande-fixe_clic',
      'event',
      'clicked'
    );
  }

  goToFormulaireCancelOMTransaction() {
    this.router.navigate(['/cancel-transaction-om']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_formulaire_annuler_transaction_om_clic',
      'event',
      'clicked'
    );
  }

  goFindToAgenceWebSite() {
    this.inAppBrowser.create(FIND_AGENCE_EXTERNAL_URL, '_self');
    this.followAnalyticsService.registerEventFollow(
      'Assistance_hub_Trouver_agence_orange_clic',
      'event',
      'clicked'
    );
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: OPERATION_INIT_CHANGE_PIN_OM,
      },
    });
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_change_pin_OM_clic',
      'event',
      'clicked'
    );
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {
        const omUserInfos = resp.data.omUserInfos;
        this.dashbServ
          .getCustomerInformations()
          .pipe(
            tap((res: any) => {
              const birthDate = res.birthDate;
              if (birthDate) {
                const year = birthDate.split('-')[0];
                this.router.navigate(['/change-orange-money-pin'], {
                  state: { omUserInfos, birthYear: year },
                });
              }
            }),
            catchError((err: any) => {
              this.router.navigate(['/change-orange-money-pin'], {
                state: { omUserInfos },
              });
              return of(err);
            })
          )
          .subscribe();
      }
    });
    return await modal.present();
  }
}
