import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
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
  @Input() action: {
    act: string;
    description: string;
    image: string;
  };
  constructor(
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private inAppBrowser: InAppBrowser,
    private modalController: ModalController,
    private dashbServ: DashboardService
  ) {}

  ngOnInit() {}

  doAction() {
    switch (this.action.act) {
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
      default:
        break;
    }
  }

  goFiberEligibility() {
    this.inAppBrowser.create(CHECK_ELIGIBILITY_EXTERNAL_URL, '_self');
  }

  goPuk() {
    this.router.navigate(['/control-center/puk']);
    this.followAnalyticsService.registerEventFollow(
      'Find_PUK',
      'event',
      'clicked'
    );
  }

  goChangeSeddo() {
    this.router.navigate(['/control-center/change-seddo-code']);
    this.followAnalyticsService.registerEventFollow(
      'Seddo_PIN',
      'event',
      'clicked'
    );
  }

  goInternet() {
    this.router.navigate(['/control-center/internet-mobile']);
    this.followAnalyticsService.registerEventFollow(
      'Parametrage_Internet_Mobile',
      'event',
      'clicked'
    );
  }
  goCreateOMAccount() {
    this.router.navigate(['/control-center/operation-om/creation-compte']);
    this.followAnalyticsService.registerEventFollow(
      'Creation_Compte_OM',
      'event',
      'clicked'
    );
  }

  goDeplafonnement() {
    this.router.navigate(['/control-center/operation-om/deplafonnement']);
    this.followAnalyticsService.registerEventFollow(
      'Deplafonnement_OM',
      'event',
      'clicked'
    );
  }

  goReclamation() {
    this.router.navigate(['/control-center/operation-om/reclamation']);
    this.followAnalyticsService.registerEventFollow(
      'Reclamation_OM',
      'event',
      'clicked'
    );
  }

  onFollowUpRequests() {
    this.router.navigate(['follow-up-requests']);
    this.followAnalyticsService.registerEventFollow(
      'suivi_demande-fixe',
      'event',
      'clicked'
    );
  }

  goFindToAgenceWebSite() {
    this.inAppBrowser.create(FIND_AGENCE_EXTERNAL_URL, '_self');
    this.followAnalyticsService.registerEventFollow(
      'Trouver_agence_orange',
      'event',
      'clicked'
    );
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        'operationType' : OPERATION_INIT_CHANGE_PIN_OM
      }
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {

        const omUserInfos = resp.data.omUserInfos;
        console.log('omUser', omUserInfos);
        this.getBirhDate().pipe(tap((birthDate: string) => {
          
          if(birthDate){
            const year = birthDate.split('-')[0];
            this.router.navigate(['/change-orange-money-pin'], { state: { omUserInfos, birthYear: year } });
          }
        }), catchError((err: any) => {
          this.router.navigate(['/change-orange-money-pin'], { state: { omUserInfos } });
          return of(err)
        })).subscribe();
      }
    });
    return await modal.present();
  }
  getBirhDate() {
    return this.dashbServ.getUserBirthDate();
   }
}
