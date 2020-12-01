import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { PassIllimixService } from 'src/app/services/pass-illimix-service/pass-illimix.service';
import { getListPassFilteredByLabelAndPaymentMod, CODE_KIRENE_Formule, ERROR_MSG_PASS } from 'src/shared';

@Component({
  selector: 'app-illimix-list-v2',
  templateUrl: './illimix-list-v2.component.html',
  styleUrls: ['./illimix-list-v2.component.scss']
})
export class IllimixListV2Component implements OnInit {
  @Input() paymentMode: string;
  @Input() destCodeFormule: string;
  @Output() passToStepValidation = new EventEmitter();
  selectedCategory: string;
  listCategory = [];
  listUserPassIllimix: any[] = [];
  listPassIllimixShown = [];
  isLoaded: boolean;
  error;
  noPass;
  showAlertAvantages = true;

  constructor(
    private router: Router,
    private passIllimixService: PassIllimixService
  ) {}

  ngOnInit() {
    this.getListPassIllimix();
  }

  getListPassIllimix() {
    this.passIllimixService.queryListPassIllimix(this.destCodeFormule).subscribe(
      (res: any) => {
      this.isLoaded = true;
      this.listUserPassIllimix = this.passIllimixService.getListPassIllimix();
      this.listPassIllimixShown = this.passIllimixService.getListPassIllimixShown();
      this.listCategory = this.passIllimixService.getCategoryListPassIllimix();
      this.selectedCategory = this.listCategory[0];
      
    },(err: any) => {
      this.isLoaded = true;
    });
  }

  goToActivationPage() {
    this.router.navigate(['/activate-om']);
  }
  filterPassBy(label: string) {
    this.selectedCategory = label;
    // filter according to payment mode
    this.listPassIllimixShown = getListPassFilteredByLabelAndPaymentMod(
      label,
      this.listUserPassIllimix
    );
  }

  selectPassIllimix(passIllimix: any) {
    let data = passIllimix;
    if (passIllimix.passPromo) {
      data = passIllimix.passPromo;
    }
    if (passIllimix.canalPromotion) {
      data.canalPromotion = passIllimix.canalPromotion;
    }
    this.passToStepValidation.emit(data);
  }
  hideAlert() {
    this.showAlertAvantages = false;
}
getErrorMessageNoPass(){
  if(this.destCodeFormule === CODE_KIRENE_Formule){
    return ERROR_MSG_PASS.LIST_EMPTY_FOR_KIRENE
  }
  return ERROR_MSG_PASS.LIST_EMPTY
}

}
