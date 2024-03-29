import { Component, OnInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController, Platform } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FIND_AGENCE_EXTERNAL_URL, REGEX_FIX_NUMBER } from 'src/shared';
import { ScrollVanishDirective } from '../directives/scroll-vanish/scroll-vanish.directive';
import { BesoinAideType } from '../models/enums/besoin-aide-type.enum';
import { CustomerOperationStatus } from '../models/enums/om-customer-status.enum';
import { OffreService } from '../models/offre-service.model';
import { OMCustomerStatusModel } from '../models/om-customer-status.model';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
import { OperationService } from '../services/oem-operation/operation.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { convertObjectToLoggingPayload } from '../utils/utils';

@Component({
  selector: 'app-new-assistance-hub-v2',
  templateUrl: './new-assistance-hub-v2.page.html',
  styleUrls: ['./new-assistance-hub-v2.page.scss'],
})
export class NewAssistanceHubV2Page implements OnInit {
  @ViewChildren(ScrollVanishDirective) dir;
  moreActions = [
    //{
    //  act: 'IBOU_CONTACT',
    //  description: 'Contacter votre assistant Ibou',
    //  image:
    //    '/assets/images/04-boutons-01-illustrations-21-ibou-assistance.png',
    //},
    {
      act: 'AGENCE_LOCATOR',
      description: 'Trouver l’agence la plus proche',
      image: '/assets/images/04-boutons-01-illustrations-22-store-locator.svg',
    },
  ];
  listBesoinAides: OffreService[] = [];
  listFaqs?: OffreService[] = [];
  listActes?: OffreService[] = [];
  loadingHelpItems;
  currentUserMsisdn = this.dashboardService.getCurrentPhoneNumber();
  checkingStatus: boolean;
  userOMStatus: OMCustomerStatusModel;
  isIos: boolean;
  slideOpts = { slidesPerView: 2.4, spaceBetween: 15 };

  constructor(
    private operationService: OperationService,
    private router: Router,
    private inAppBrowser: InAppBrowser,
    private dashboardService: DashboardService,
    private orangeMoneyService: OrangeMoneyService,
    private platform: Platform,
    private navController: NavController,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.isIos = this.platform.is('ios');
    });
  }

  ionViewWillEnter(event?) {
    this.fetchAllHelpItems(event);
    console.log(this.currentUserMsisdn);
  }

  search() {
    this.dir.first.show();
  }

  async checkStatus() {
    this.checkingStatus = true;
    return await this.orangeMoneyService
      .getUserStatus(this.currentUserMsisdn)
      .pipe(
        catchError((err: any) => {
          return of(null);
        })
      )
      .toPromise();
  }

  filterOMActesFollowingOMStatus(user: OMCustomerStatusModel, actes: OffreService[]) {
    let response = actes;
    if (user.operation === 'DEPLAFONNEMENT' || user.operation === 'FULL') {
      response = actes.filter((item: OffreService) => {
        return item.code !== 'OUVERTURE_OM_ACCOUNT' && item.code !== 'OUVERTURE_OM_ACCOUNT_NEW';
      });
    } else if (user.operation === 'OUVERTURE_COMPTE' && user.operationStatus === CustomerOperationStatus.password_creation) {
      response = actes;
    } else {
      response = actes.filter((item: OffreService) => {
        return item.code !== 'DEPLAFONNEMENT' && item.code !== 'DEPLAFONNEMENT_NEW';
      });
    }
    return response;
  }

  fetchAllHelpItems(event?) {
    this.loadingHelpItems = true;
    this.operationService.getServicesByFormule(null, true, true).subscribe(
      async res => {
        if (!REGEX_FIX_NUMBER.test(this.currentUserMsisdn)) this.userOMStatus = await this.checkStatus();
        this.listBesoinAides = res;
        this.loadingHelpItems = false;
        this.oemLoggingService.registerEvent('Assistance_hub_affichage_success');
        this.splitHelpItemsByType();
        event ? event.target.complete() : '';
      },
      err => {
        this.loadingHelpItems = false;
        event ? event.target.complete() : '';
        this.oemLoggingService.registerEvent(
          'Assistance_hub_affichage_error',
          convertObjectToLoggingPayload({
            msisdn: this.currentUserMsisdn,
            error: err.status,
          })
        );
      }
    );
  }

  splitHelpItemsByType() {
    this.listActes = this.listBesoinAides.filter((item: OffreService) => {
      return item.typeService === BesoinAideType.ACTE;
    });
    this.listActes = this.filterOMActesFollowingOMStatus(this.userOMStatus, this.listActes);
    this.listFaqs = this.listBesoinAides.filter((item: OffreService) => {
      return item.typeService === BesoinAideType.FAQ;
    });
  }

  goAllActionsHub() {
    this.router.navigate(['/assistance-hub/actions'], {
      state: { listActes: this.listActes },
    });
    this.oemLoggingService.registerEvent('help_all_acts_click', []);
  }

  goAllQuestionsHub() {
    this.router.navigate(['/assistance-hub/questions'], {
      state: { listFaqs: this.listFaqs },
    });
    this.oemLoggingService.registerEvent('help_see_all_faq_click', []);
  }

  goFindToAgenceWebSite() {
    this.inAppBrowser.create(FIND_AGENCE_EXTERNAL_URL, '_self');
    this.oemLoggingService.registerEvent('Assistance_hub_Trouver_agence_orange_clic');
  }

  goFastAction(action) {
    switch (action.act) {
      case 'IBOU_CONTACT':
        this.goIbouContactPage();
        break;
      case 'AGENCE_LOCATOR':
        this.goFindToAgenceWebSite();
        break;
    }
  }

  async goIbouContactPage() {
    this.oemLoggingService.registerEvent('Assistance_Hub_Ibou_card_clic');
    this.router.navigate(['/contact-ibou-hub']);
  }

  onInputFocus() {
    this.navController.navigateForward(['/assistance-hub/search'], {
      state: { listBesoinAides: this.listBesoinAides },
    });
    this.oemLoggingService.registerEvent('Assistance_hub_recherche');
  }
}
