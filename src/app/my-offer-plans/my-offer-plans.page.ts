import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfferPlansService } from '../services/offer-plans-service/offer-plans.service';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { SubscriptionModel } from 'src/shared';

@Component({
  selector: 'app-my-offer-plans',
  templateUrl: './my-offer-plans.page.html',
  styleUrls: ['./my-offer-plans.page.scss'],
})
export class MyOfferPlansPage implements OnInit {
  listCategories = [];
  categories = {illimix: "Pass Illimix", internet: "Pass internet", sargal: "Sargal", autres: "Autres", recharge: "Recharge"}
  listOfferPlans: OfferPlan[] = [];
  isLoading:boolean;
  hasError: boolean;
  filteredListOfferPlans: OfferPlan[] = [];
  categorySelected: string;
  currentUserCodeFormule: string;
  payloadNavigation: {destinataire: string, code: string } = {destinataire: null, code: null};
  constructor(private router: Router, private offerPlansServ: OfferPlansService, private appliRout: ApplicationRoutingService, private dashbServ: DashboardService, private authServ: AuthenticationService) { }
  
  ngOnInit() {
    this.getUserOfferPlans();
    this.payloadNavigation.destinataire = this.dashbServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(this.payloadNavigation.destinataire).subscribe((res: SubscriptionModel)=>{
      this.payloadNavigation.code = res.code;
    })
  }


  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getUserOfferPlans(){
    this.isLoading = true;
    this.offerPlansServ.getCurrentUserOfferPlans().subscribe((response: OfferPlan[])=>{
      this.isLoading = false;
      this.hasError = false;
      this.listOfferPlans = response;
      this.initCategoriesOfferPlan();
      this.onCategorySelected(this.listCategories[0].value);
      
    }, (err:any)=>{
      this.isLoading = false;
      this.hasError = true;
    })
  }

  onCategorySelected(category: string){
    this.categorySelected = category;

    if (this.listOfferPlans.length) 
      this.filteredListOfferPlans = this.listOfferPlans.filter((offerPlan: OfferPlan) => offerPlan.typeMPO == category )
    
  }

  initCategoriesOfferPlan(){
    let cats = [];
    this.listCategories = this.listOfferPlans.filter((op: OfferPlan)=> { 
                                        if(!cats.includes(op.typeMPO)){                                            
                                          cats.push(op.typeMPO);
                                          return true
                                        } else return false })
                                    .map((op: OfferPlan)=>{
                                      return { label: this.categories[op.typeMPO.toLowerCase()],value: op.typeMPO }
                                    });

    
  }

  goToPage(category: string){
    switch (category) {
      case 'illimix':
        this.appliRout.goToListPassIllimix(this.payloadNavigation);
        break;
      case 'internet':
        this.appliRout.goToListPassInternet(this.payloadNavigation);
        break;
      case 'recharge':
        // put the new route for recharge page
        break;
      default:
        break;
    }
  }



}
