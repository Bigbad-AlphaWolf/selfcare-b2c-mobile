import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { PassInternetService } from 'src/app/services/pass-internet-service/pass-internet.service';
import { getListPassFilteredByLabelAndPaymentMod } from 'src/shared';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-list-pass-internet-v2',
  templateUrl: './list-pass-internet-v2.component.html',
  styleUrls: ['./list-pass-internet-v2.component.scss']
})
export class ListPassInternetV2Component implements OnInit, OnDestroy {
  @Input() destinataire: string;
  @Input() paymentMode: string;
  @Output() getSelectedPassInternet = new EventEmitter();
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: false,
    zoom: false
  };

  selectedCategory: string;
  listCategory = [];
  listPassInternet: any;
  listPassInternetShown: any[] = [];
  isLoaded: boolean;
  activeTabIndex = 0;
  fromSubscription: Subscription;

  constructor(
    private router: Router,
    private dashbServ: DashboardService,
    private passIntService: PassInternetService
  ) {}

  ngOnInit() {
    const userPhoneNumber = this.destinataire ? this.destinataire : this.dashbServ.getCurrentPhoneNumber();
    this.passIntService.setUserPhoneNumber(userPhoneNumber);
    this.passIntService.setPaymentMod(this.paymentMode);
    this.passIntService.setListPassInternetOfUserByQuery();
    this.fromSubscription = this.passIntService.getStatusPassLoaded().subscribe((status: boolean) => {
      this.isLoaded = status;
      if (this.isLoaded) {
        this.listCategory = this.passIntService.getListCategoryPassInternet();
        this.listPassInternet = this.passIntService.getListPassInternetOfUser();
        this.listPassInternetShown = this.passIntService.getListPassInternetShown();
        this.selectedCategory = this.listCategory[0];
      }
    });
  }

  goToActivationPage() {
    this.router.navigate(['/activate-om']);
  }

  changeCategorie(index: number) {
    this.activeTabIndex = index;
    this.sliders.slideTo(index);
  }
  filterPassBy(label: string) {
    this.selectedCategory = label;
    this.listPassInternetShown = getListPassFilteredByLabelAndPaymentMod(
      label,
      this.listPassInternet,
      this.paymentMode
    );
  }

  selectPass(passInternetSelected: any) {
    let data = passInternetSelected;
    if (passInternetSelected.passPromo) {
      data = passInternetSelected.passPromo;
    }
    if (passInternetSelected.canalPromotion) {
      data.canalPromotion = passInternetSelected.canalPromotion;
    }
    this.getSelectedPassInternet.emit(data);
  }

  ngOnDestroy(): void {
    if (this.fromSubscription) {
      this.fromSubscription.unsubscribe();
    }
  }

  slideChanged() {
    this.sliders.getActiveIndex().then(index => {
      this.activeTabIndex = index;
      console.log('index', index);
    });
  }

  slideChangeTop() {}
}
