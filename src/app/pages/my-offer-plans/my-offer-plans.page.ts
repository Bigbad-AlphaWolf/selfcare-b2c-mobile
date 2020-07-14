import { Component, OnInit, ViewChild } from '@angular/core';
import { OfferPlansService } from '../../services/offer-plans-service/offer-plans.service';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { ApplicationRoutingService } from '../../services/application-routing/application-routing.service';
import { DashboardService } from '../../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { SubscriptionModel, BONS_PLANS, OPERATION_TYPE_PASS_ILLIMIX, OPERATION_TYPE_PASS_INTERNET, listRegisterSargalBonPlanText } from 'src/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController, IonSlides } from '@ionic/angular';
import { getPageTitle } from '../../utils/title.util';
import { OperationExtras } from 'src/app/models/operation-extras.model';

@Component({
  selector: 'app-my-offer-plans',
  templateUrl: './my-offer-plans.page.html',
  styleUrls: ['./my-offer-plans.page.scss'],
})
export class MyOfferPlansPage implements OnInit {
  pageTitle: string;
  listCategories = [];
  categories = {
    illimix: 'Pass Illimix',
    internet: 'Pass internet',
    sargal: 'Sargal',
    autres: 'Autres',
    recharge: 'Recharge',
  };
  listOfferPlans: OfferPlan[] = [];
  isLoading: boolean;
  hasError: boolean;
  categorySelected: string;
  currentUserCodeFormule: string;
  payloadNavigation: { recipientMsisdn: string; recipientCodeFormule: string } = { recipientMsisdn: null, recipientCodeFormule: null };
  hasNoOfferPlans: boolean;
  fullList: { category: {label: string, value: string} , offersPlans: OfferPlan[] }[];
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true,
  };
  activeTabIndex = 0;

    constructor(
    private navController: NavController,
    private offerPlansServ: OfferPlansService,
    private appliRout: ApplicationRoutingService,
    private dashbServ: DashboardService,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {
    this.pageTitle = getPageTitle(BONS_PLANS).title;
    this.getUserOfferPlans();
    this.payloadNavigation.recipientMsisdn = this.dashbServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(this.payloadNavigation.recipientMsisdn).subscribe((res: SubscriptionModel) => {
      this.payloadNavigation.recipientCodeFormule = res.code;
    });
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
        return { label: this.categories[op.typeMPO.toLowerCase()], value: op.typeMPO };
      });
  }

  arrangeOfferPlansByCategory(listOffer: OfferPlan[], listCategories: {label: string, value: string}[]) {
    this.fullList = listCategories.map((category: {label: string, value: string})=> {
      const value = { category, offersPlans: [] };      
      value.offersPlans = listOffer.filter((offerPlanUncategorized)=>{        
        return offerPlanUncategorized.typeMPO.toLowerCase() === category.value.toLowerCase()
      })
      return value
    })
    console.log(this.fullList);
    
  }

  changeCategory(tabIndex: number) {
    this.sliders.slideTo(tabIndex);
    this.activeTabIndex = tabIndex;
  }

  slideChanged() {
    this.sliders.getActiveIndex().then((index) => {
      this.activeTabIndex = index;
    });
  }

  goToPage(offer: OfferPlan) {
    switch (offer.typeMPO.toLowerCase()) {
      case 'illimix':
        if(offer.pass){
          const payloadPassPageRecap = { pass: offer.pass, recipientName: null , purchaseType: OPERATION_TYPE_PASS_ILLIMIX, ...this.payloadNavigation, offerPlan: offer  }
          this.appliRout.goToPassRecapPage(payloadPassPageRecap);
        }
        break;
        
      case 'internet':
        if(offer.pass){
          const payloadPassPageRecap = { pass: offer.pass, recipientName: null , purchaseType: OPERATION_TYPE_PASS_INTERNET, ...this.payloadNavigation, offerPlan: offer  }
          this.appliRout.goToPassRecapPage(payloadPassPageRecap);
        }
        break;

      case 'recharge':
        const opBuyCreditSetAmountPayload: OperationExtras = {forSelf: true,recipientFirstname: null,recipientLastname: null,recipientFromContact: false,senderMsisdn: this.payloadNavigation.recipientMsisdn, offerPlan: offer }
        this.appliRout.goToBuyCreditSetAmount(opBuyCreditSetAmountPayload)
        break;

      case 'sargal':
        for (const text of listRegisterSargalBonPlanText) {
          if(offer.bpTarget.toLowerCase().includes(text) ) {
            this.appliRout.goToRegisterForSargal()
            break
          }
        }     
      default:
        break;
    }
  }
}
