import {Component, OnInit, ViewChild} from '@angular/core';
import {OfferPlansService} from '../../services/offer-plans-service/offer-plans.service';
import {OfferPlan} from 'src/shared/models/offer-plan.model';
import {ApplicationRoutingService} from '../../services/application-routing/application-routing.service';
import {DashboardService} from '../../services/dashboard-service/dashboard.service';
import {AuthenticationService} from '../../services/authentication-service/authentication.service';
import {
  SubscriptionModel,
  BONS_PLANS,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_PASS_INTERNET,
  listRegisterSargalBonPlanText,
  OPERATION_TYPE_BONS_PLANS
} from 'src/shared';
import {HttpErrorResponse} from '@angular/common/http';
import {NavController, IonSlides} from '@ionic/angular';
import {getPageHeader} from '../../utils/title.util';
import {OperationExtras} from 'src/app/models/operation-extras.model';
import {take, map} from 'rxjs/operators';
import {CATEGORY_MPO} from 'src/app/utils/constants';
import {SargalService} from 'src/app/services/sargal-service/sargal.service';
import {SargalSubscriptionModel, SARGAL_NOT_SUBSCRIBED, SARGAL_UNSUBSCRIPTION_ONGOING} from 'src/app/dashboard';
import {MatDialog} from '@angular/material/dialog';
import {ModalSuccessComponent} from 'src/shared/modal-success/modal-success.component';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-my-offer-plans',
  templateUrl: './my-offer-plans.page.html',
  styleUrls: ['./my-offer-plans.page.scss']
})
export class MyOfferPlansPage implements OnInit {
  pageTitle: string;
  listCategories = [];
  categories = {
    illimix: 'Pass Illimix',
    internet: 'Pass internet',
    sargal: 'Sargal',
    autres: 'Autres',
    recharge: 'Recharge'
  };
  listOfferPlans: OfferPlan[] = [];
  isLoading: boolean;
  hasError: boolean;
  categorySelected: string;
  currentUserCodeFormule: string;
  payloadNavigation: {
    recipientMsisdn: string;
    recipientCodeFormule: string;
  } = {recipientMsisdn: null, recipientCodeFormule: null};
  hasNoOfferPlans: boolean;
  fullList: {
    category: {label: string; value: string};
    offersPlans: OfferPlan[];
  }[];
  hasErrorProcessingMPO: boolean;
  selectedOfferPlan: OfferPlan;
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true
  };
  activeTabIndex = 0;
  isChecking: boolean;
  constructor(
    private navController: NavController,
    private offerPlansServ: OfferPlansService,
    private appliRout: ApplicationRoutingService,
    private dashbServ: DashboardService,
    private authServ: AuthenticationService,
    private sargalServ: SargalService,
    private matDialog: MatDialog,
    private followAnalyticsServ: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.pageTitle = getPageHeader(BONS_PLANS).title;
    this.payloadNavigation.recipientMsisdn = this.dashbServ.getCurrentPhoneNumber();
    this.getUserOfferPlans();
    this.authServ.getSubscription(this.payloadNavigation.recipientMsisdn).subscribe((res: SubscriptionModel) => {
      this.payloadNavigation.recipientCodeFormule = res.code;
    });
    this.followAnalyticsServ.registerEventFollow('page_bons_plans_Affichage', 'event');
  }

  goBack() {
    this.navController.navigateBack(['/dashboard']);
  }

  getUserOfferPlans() {
    this.isLoading = true;
    this.hasNoOfferPlans = false;
    this.hasError = false;
    this.offerPlansServ.getCurrentUserOfferPlans().subscribe(
      (response: OfferPlan[]) => {
        this.isLoading = false;
        this.hasError = false;

        this.followAnalyticsServ.registerEventFollow('page_bons_plans_Recupération_bons_plans_Success', 'event', {
          bonsPlans: response,
          user: this.payloadNavigation.recipientMsisdn
        });

        if (response.length === 0) {
          this.hasNoOfferPlans = true;
        } else {
          this.hasNoOfferPlans = false;
          this.listOfferPlans = response;
          this.initCategoriesOfferPlan();
          this.arrangeOfferPlansByCategory(response, this.listCategories);
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.followAnalyticsServ.registerEventFollow('page_bons_plans_Recupération_bons_plans_Failed', 'error', {
          error: err,
          user: this.payloadNavigation.recipientMsisdn
        });
        if (err.status === 400) {
          this.hasNoOfferPlans = true;
        } else {
          this.hasError = true;
        }
      }
    );
  }

  initCategoriesOfferPlan() {
    let cats = [];
    this.listCategories = this.listOfferPlans
      .filter((op: OfferPlan) => {
        if (!cats.includes(op.typeMPO)) {
          cats.push(op.typeMPO);
          return true;
        } else return false;
      })
      .map((op: OfferPlan) => {
        return {
          label: this.categories[op.typeMPO.toLowerCase()],
          value: op.typeMPO
        };
      });
  }

  arrangeOfferPlansByCategory(listOffer: OfferPlan[], listCategories: {label: string; value: string}[]) {
    this.fullList = listCategories.map((category: {label: string; value: string}) => {
      const value = {category, offersPlans: []};
      value.offersPlans = listOffer.filter(offerPlanUncategorized => {
        return offerPlanUncategorized.typeMPO.toLowerCase() === category.value.toLowerCase();
      });
      return value;
    });
  }

  changeCategory(tabIndex: number) {
    this.sliders.slideTo(tabIndex);
    this.activeTabIndex = tabIndex;
  }

  slideChanged() {
    this.sliders.getActiveIndex().then(index => {
      this.activeTabIndex = index;
    });
  }

  orderBonPlan(offer: OfferPlan) {
    return this.offerPlansServ.orderBonPlanProduct(offer.productOfferingId).pipe(take(1));
  }

  openPopUpSargalError(type: string) {
    this.matDialog.open(ModalSuccessComponent, {
      width: '300px',
      data: {type}
    });
  }

  async processMPO(offer: OfferPlan) {
    this.hasErrorProcessingMPO = false;
    this.followAnalyticsServ.registerEventFollow('page_bons_plans_Clic_bon_plan', 'event', {
      bonPlan: offer
    });
    if (offer.typeMPO.toLowerCase() === CATEGORY_MPO.sargal) {
      for (const text of listRegisterSargalBonPlanText) {
        if (offer.bpTarget.toLowerCase().includes(text)) {
          const isRegistered = await this.isUserSargalRegistered();
          if (isRegistered) {
            const type = 'sargal-already-registered';
            this.openPopUpSargalError(type);
            return;
          }
        }
      }
    }
    this.orderBonPlan(offer).subscribe(
      () => {
        this.followAnalyticsServ.registerEventFollow('page_bons_plans_Order_bon_plan_Success', 'event', {
          bonPlan: offer
        });
        this.goToPage(offer);
      },
      (err: any) => {
        this.selectedOfferPlan = offer;
        this.hasErrorProcessingMPO = true;
        this.followAnalyticsServ.registerEventFollow('page_bons_plans_Order_bon_plan_failed', 'event', {
          bonPlan: offer,
          err: err
        });
      }
    );
  }

  async isUserSargalRegistered() {
    this.isChecking = true;
    const msisdn = this.payloadNavigation.recipientMsisdn;
    return await this.sargalServ
      .getSargalBalance(msisdn)
      .pipe(
        map((res: SargalSubscriptionModel) => {
          this.isChecking = false;
          const UNSUSCRIBED_SARGAL_STATUS = [SARGAL_NOT_SUBSCRIBED, SARGAL_UNSUBSCRIPTION_ONGOING];
          return !UNSUSCRIBED_SARGAL_STATUS.includes(res.status);
        })
      )
      .toPromise()
      .catch(() => {
        this.isChecking = false;
      });
  }

  goToPage(offer: OfferPlan) {
    switch (offer.typeMPO.toLowerCase()) {
      case CATEGORY_MPO.illimix:
        if (offer.pass) {
          const payloadPassPageRecap = {
            pass: offer.pass,
            recipientName: null,
            purchaseType: OPERATION_TYPE_PASS_ILLIMIX,
            ...this.payloadNavigation,
            offerPlan: offer,
            fromPage: OPERATION_TYPE_BONS_PLANS
          };
          this.followAnalyticsServ.registerEventFollow('page_bons_plans_Redirection_page_recap', 'event', {
            bonPlan: offer
          });
          this.appliRout.goToPassRecapPage(payloadPassPageRecap);
        }
        break;

      case CATEGORY_MPO.internet:
        if (offer.pass) {
          const payloadPassPageRecap = {
            pass: offer.pass,
            recipientName: null,
            purchaseType: OPERATION_TYPE_PASS_INTERNET,
            ...this.payloadNavigation,
            offerPlan: offer,
            fromPage: OPERATION_TYPE_BONS_PLANS
          };
          this.followAnalyticsServ.registerEventFollow('page_bons_plans_Redirection_page_recap', 'event', {
            bonPlan: offer
          });
          this.appliRout.goToPassRecapPage(payloadPassPageRecap);
        }
        break;

      case CATEGORY_MPO.recharge:
        const opBuyCreditSetAmountPayload: OperationExtras = {
          forSelf: true,
          recipientFirstname: null,
          recipientLastname: null,
          recipientFromContact: false,
          senderMsisdn: this.payloadNavigation.recipientMsisdn,
          ...this.payloadNavigation,
          offerPlan: offer,
          fromPage: OPERATION_TYPE_BONS_PLANS
        };
        this.followAnalyticsServ.registerEventFollow('page_bons_plans_Redirection_page_choix_montant', 'event', {
          bonPlan: offer
        });
        this.appliRout.goToBuyCreditSetAmount(opBuyCreditSetAmountPayload);
        break;

      case CATEGORY_MPO.sargal:
        for (const text of listRegisterSargalBonPlanText) {
          if (offer.bpTarget.toLowerCase().includes(text)) {
            this.followAnalyticsServ.registerEventFollow('page_bons_plans_Redirection_page_inscription_sargal', 'event', {
              bonPlan: offer
            });
            this.appliRout.goToRegisterForSargal(OPERATION_TYPE_BONS_PLANS);
            break;
          }
        }
      default:
        break;
    }
  }

  showErrorMsg() {
    this.hasErrorProcessingMPO = true;
  }
}
