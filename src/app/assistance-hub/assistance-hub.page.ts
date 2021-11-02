import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {NavController} from '@ionic/angular';
import {of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {FIND_AGENCE_EXTERNAL_URL, REGEX_FIX_NUMBER} from 'src/shared';
import {BesoinAideType} from '../models/enums/besoin-aide-type.enum';
import {OffreService} from '../models/offre-service.model';
import {OMCustomerStatusModel} from '../models/om-customer-status.model';
import {DashboardService} from '../services/dashboard-service/dashboard.service';
import {FollowAnalyticsService} from '../services/follow-analytics/follow-analytics.service';
import {OperationService} from '../services/oem-operation/operation.service';
import {OrangeMoneyService} from '../services/orange-money-service/orange-money.service';

@Component({
  selector: 'app-assistance-hub',
  templateUrl: './assistance-hub.page.html',
  styleUrls: ['./assistance-hub.page.scss']
})
export class AssistanceHubPage implements OnInit {
  slideOpts = {
    speed: 400,
    slidesPerView: 1.14,
    slideShadows: true,
    loop: true
  };
  moreActions = [
    {
      act: 'IBOU_CONTACT',
      description: 'Contacter votre assistant Ibou',
      image: '/assets/images/04-boutons-01-illustrations-21-ibou-assistance.png'
    },
    {
      act: 'AGENCE_LOCATOR',
      description: 'Trouver l’agence la plus proche',
      image: '/assets/images/04-boutons-01-illustrations-22-store-locator.svg'
    }
  ];
  listBesoinAides: OffreService[] = [];
  listFaqs?: OffreService[] = [];
  listActes?: OffreService[] = [];
  loadingHelpItems: boolean;
  displaySearchIcon: boolean = true;
  @ViewChild('searchInput', {static: true})
  searchRef;
  current_user_msisdn = this.dashboardService.getCurrentPhoneNumber();
  checkingStatus: boolean;
  userOMStatus: OMCustomerStatusModel;
  constructor(
    private operationService: OperationService,
    private router: Router,
    private navController: NavController,
    private inAppBrowser: InAppBrowser,
    private followAnalyticsService: FollowAnalyticsService,
    private dashboardService: DashboardService,
    private orangeMoneyService: OrangeMoneyService
  ) {}

  ngOnInit() {
    this.fetchAllHelpItems();
  }

  ionViewDidEnter() {
    this.searchRef.value = '';
  }

  async checkStatus() {
    this.checkingStatus = true;
    return await this.orangeMoneyService
      .getUserStatus(this.current_user_msisdn)
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
    } else if (user.operation === 'OUVERTURE_COMPTE') {
      response = actes.filter((item: OffreService) => {
        return item.code !== 'DEPLAFONNEMENT' && item.code !== 'DEPLAFONNEMENT_NEW';
      });
    }
    return response;
  }

  fetchAllHelpItems() {
    this.loadingHelpItems = true;
    this.operationService.getServicesByFormule(null, true).subscribe(
      async res => {
        if (!REGEX_FIX_NUMBER.test(this.current_user_msisdn)) this.userOMStatus = await this.checkStatus();
        this.listBesoinAides = res;
        this.loadingHelpItems = false;
        this.followAnalyticsService.registerEventFollow('Assistance_hub_affichage_success', 'event');
        this.splitHelpItemsByType();
      },
      err => {
        this.loadingHelpItems = false;
        this.followAnalyticsService.registerEventFollow('Assistance_hub_affichage_error', 'error', {
          msisdn: this.current_user_msisdn,
          error: err.status
        });
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
      state: {listActes: this.listActes}
    });
    this.followAnalyticsService.registerEventFollow('Assistance_hub_voir_toutes_actions_clic', 'event', 'clicked');
  }

  goAllQuestionsHub() {
    this.router.navigate(['/assistance-hub/questions'], {
      state: {listFaqs: this.listFaqs}
    });
    this.followAnalyticsService.registerEventFollow('Assistance_hub_voir_tous_faq_clic', 'event', 'clicked');
  }

  goBack() {
    this.navController.pop();
  }

  goFindToAgenceWebSite() {
    this.inAppBrowser.create(FIND_AGENCE_EXTERNAL_URL, '_self');
    this.followAnalyticsService.registerEventFollow('Assistance_hub_Trouver_agence_orange_clic', 'event', 'clicked');
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
    this.followAnalyticsService.registerEventFollow('Assistance_Hub_Ibou_card_clic', 'event', 'clicked');
    this.router.navigate(['/contact-ibou-hub']);
  }

  onInputChange($event) {
    const inputvalue = $event.detail.value;
    this.displaySearchIcon = true;
    if (inputvalue) {
      this.navController.navigateForward(['/assistance-hub/search'], {
        state: {listBesoinAides: this.listBesoinAides, search: inputvalue}
      });
      this.followAnalyticsService.registerEventFollow('Assistance_hub_recherche', 'event', {keyword: inputvalue});
      this.displaySearchIcon = false;
    }
  }

  onClear(searchInput) {
    const inputValue: string = searchInput.value;
    searchInput.value = inputValue.slice(0, inputValue.length - 1);
  }
}
