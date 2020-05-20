import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfferPlansService } from '../services/offer-plans-service/offer-plans.service';
import { OfferPlan } from 'src/shared/models/offer-plan.model';

@Component({
  selector: 'app-my-offer-plans',
  templateUrl: './my-offer-plans.page.html',
  styleUrls: ['./my-offer-plans.page.scss'],
})
export class MyOfferPlansPage implements OnInit {
  // defaultListCategories: {label: string, value: string}[] = [{label: "Pass Internet",value:"INTERNET"}, {label: "Pass Illimix",value:"ILLIMIX"}, {label: "Recharge",value:"RECHARGE"},{label: "Autres",value:"AUTRES"},{label: "Sargal",value:"SARGAL"}];
  listCategories = [];
  categories = {illimix: "Pass Illimix", internet: "Pass internet", sargal: "Sargal", autres: "Autres", recharge: "Recharge"}
  listOfferPlans: OfferPlan[] = [];
  isLoading:boolean;
  hasError: boolean;
  filteredListOfferPlans: OfferPlan[] = [];
  categorySelected: string;
  constructor(private router: Router, private offerPlansServ: OfferPlansService) { }
  
  ngOnInit() {
    this.getUserOfferPlans();
    
  }

  ionViewWillEnter(){
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

}
