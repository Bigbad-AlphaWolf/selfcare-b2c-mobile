import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { FeeModel, ORANGE_MONEY_TRANSFER_FEES } from '../services/orange-money-service';

@Component({
  selector: 'app-transfert-om-set-amount',
  templateUrl: './transfert-om-set-amount.page.html',
  styleUrls: ['./transfert-om-set-amount.page.scss'],
})
export class TransfertOmSetAmountPage implements OnInit {
  transfertOMType = 'TRANSFERT_OM_WITHOUT_CODE';
  recipientMsisdn: string;
  recipientFirstname: string;
  recipientLastname: string;
  hasLoadedFees:boolean;
  transfertOMFees = 0;
  summaryTransfertAmount = 0;
  allTransfertFees: FeeModel[];
  includeFees: boolean;
  isTransfertAmountValid: boolean;
  maxAmountTransfertOM: number;
  constructor(private route: ActivatedRoute, private router: Router, private appRouting: ApplicationRoutingService, private omService: OrangeMoneyService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.transfertOMType &&
        this.router.getCurrentNavigation().extras.state.recipientMsisdn
      ) {
        this.transfertOMType = this.router.getCurrentNavigation().extras.state.transfertOMType;
        this.recipientMsisdn = this.router.getCurrentNavigation().extras.state.recipientMsisdn;
        this.recipientFirstname = this.router.getCurrentNavigation().extras.state.recipientFirstname;
        this.recipientLastname = this.router.getCurrentNavigation().extras.state.recipientLastname;

      }else{
        this.appRouting.goToTransfertMoneyPage();
      }
    });
  }

  ionViewWillEnter(){
    this.getFees();
  }

  goToTransfertMoneyHubServicesPage(){
    this.appRouting.goToTransfertMoneyPage();
  }

  getFees() {
    this.hasLoadedFees = false;
    this.omService.getTransferFees().subscribe(
      (fees: FeeModel[]) => {
        this.hasLoadedFees = true;
        this.allTransfertFees = fees;
        this.maxAmountTransfertOM = fees[fees.length - 1].maximum;
      },
      err => {
        this.hasLoadedFees = true;
        this.allTransfertFees = ORANGE_MONEY_TRANSFER_FEES;
        this.maxAmountTransfertOM = this.allTransfertFees[this.allTransfertFees.length - 1].maximum;
      }
    );
  }

  extractFees(fees: FeeModel[], amount: number){
    const result: { without_code: number, with_code: number } = {without_code: null, with_code: null};
    for (let fee of fees){
      if(amount >= fee.minimum && amount <= fee.maximum){
        result.without_code = fee.withoutCode;
        result.with_code = fee.withCode;
        
        return result;
      }
    }
  }

  computeSummaryTransfertAmount(input: any){
    const amount = input.target.valueAsNumber;
    if(amount && amount <= this.maxAmountTransfertOM && amount > 0){
      this.isTransfertAmountValid = true;
      const {without_code, with_code } = this.extractFees(this.allTransfertFees, amount);
      if(this.transfertOMType === 'TRANSFERT_OM_WITHOUT_CODE'){
        this.transfertOMFees = without_code;
        if(this.includeFees){
          this.summaryTransfertAmount = amount + without_code;

        }else{
          this.summaryTransfertAmount = amount;
        }
       
        
      }else{
        this.transfertOMFees = with_code;
        
        if(this.includeFees){
          this.summaryTransfertAmount = amount + with_code;

        }else{
          this.summaryTransfertAmount = amount;

        }
       
      }
    }else{
      this.isTransfertAmountValid = false;
      this.transfertOMFees = 0;
      this.summaryTransfertAmount = 0;
    }
  }

  updateAmountTransfert(event: any, inputAmountEntered: any){    
    const includeFees = event.detail.checked;
    const amountEntered = inputAmountEntered.valueAsNumber;

    if(amountEntered <= this.maxAmountTransfertOM && amountEntered > 0){
      if(includeFees){
          this.summaryTransfertAmount = amountEntered + this.transfertOMFees;
          
        }else{
          this.summaryTransfertAmount = amountEntered ? amountEntered : 0 ;
          
        }
      }
  }


  confirmAmountTrannsfertOM(){
    const payload = {
      transfertOMType: this.transfertOMType,
      recipientMsisdn: this.recipientMsisdn,
      recipientFirstname: this.recipientFirstname,
      recipientLastname: this.recipientLastname,
      transfertOMAmount: this.summaryTransfertAmount
    }
    this.appRouting.goToTransfertMoneyRecapPage(payload);
  }
}
