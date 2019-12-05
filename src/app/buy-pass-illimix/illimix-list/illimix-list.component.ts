import { Subscription } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { PassIllimixService } from 'src/app/services/pass-illimix-service/pass-illimix.service';
import { getListPassFilteredByLabelAndPaymentMod } from 'src/shared';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-illimix-list',
  templateUrl: './illimix-list.component.html',
  styleUrls: ['./illimix-list.component.scss']
})
export class IllimixListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() paymentMode: string;
  @Output() passToStepValidation = new EventEmitter();
  selectedCategory: string;
  listCategory = [];
  listUserPassIllimix: any[] = [];
  listPassIllimixShown = [];
  isLoaded: boolean;
  error;
  noPass;

  constructor(
    private dashbServ: DashboardService,
    private router: Router,
    private passIllimixService: PassIllimixService
  ) {}

  ngOnInit() {
    // this.getListPassIllimix();
    const userPhoneNumber = this.dashbServ.getCurrentPhoneNumber();
    this.passIllimixService.setPhoneNumber(userPhoneNumber);
    this.passIllimixService.setPaymentMod(this.paymentMode);
    this.getListPassIllimix();
  }

  getListPassIllimix() {
    this.passIllimixService.setListPassIllimix();
    this.subscriptions.push(
    this.passIllimixService
      .getStatusLoadingPass()
      .subscribe((status: boolean) => {
        this.isLoaded = status;
        if (this.isLoaded) {
          this.listUserPassIllimix = this.passIllimixService.getListPassIllimix();
          this.listPassIllimixShown = this.passIllimixService.getListPassIllimixShown();
          this.listCategory = this.passIllimixService.getCategoryListPassIllimix();
          this.selectedCategory = this.listCategory[0];
        }
      })
      );
  }

  goToActivationPage() {
    this.router.navigate(['/activate-om']);
  }
  filterPassBy(label: string) {
    this.selectedCategory = label;
    // filter according to payment mode
    this.listPassIllimixShown = getListPassFilteredByLabelAndPaymentMod(
      label,
      this.listUserPassIllimix,
      this.paymentMode
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

ngOnDestroy() {
}
}

