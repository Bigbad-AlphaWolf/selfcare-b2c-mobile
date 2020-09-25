import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { Observable } from 'rxjs';
import { ZoneBanniere } from 'src/app/models/enums/zone-banniere.enum';
import { IonSlides, NavController } from '@ionic/angular';
import { OperationService } from 'src/app/services/oem-operation/operation.service';

@Component({
  selector: 'app-offres-services',
  templateUrl: './offres-services.page.html',
  styleUrls: ['./offres-services.page.scss'],
})
export class OffresServicesPage implements OnInit {
  static ROUTE_PATH: string = '/offres-services';
  bannieres$: Observable<any>;

  slideSelected = 1;
  isLoading: boolean = false;
  activeTabIndex = 0;
  activeSubIndex = 0;
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true,
  };
  operations$: Observable<any[]>;
  tabHeaderItems: any[] = [];

  constructor(
    private banniereService: BanniereService,
    private navCtl: NavController,
    public opService : OperationService
  ) {}

  ngOnInit() {
    this.bannieres$ = this.banniereService.queryListBanniereByFormule(
      SessionOem.CODE_FORMULE,
      ZoneBanniere.offre
    );

    this.initData();
  }

  initData(){
    this.opService.initServicesData().subscribe();
  }

  changeTabHeader(tabIndex: number) {
    this.sliders.slideTo(tabIndex);
    this.activeTabIndex = tabIndex;
    this.activeSubIndex = 0;
  }

  onChangeSubCat(subCatIndex: number){
    this.activeSubIndex = subCatIndex;
  }

  slideChanged() {
    this.sliders.getActiveIndex().then((index) => {
      this.activeTabIndex = index;
      this.activeSubIndex = 0;
    });
  }

  goBack() {
    this.navCtl.pop();
  }
}
