import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { Observable, of } from 'rxjs';
import { ZoneBanniere } from 'src/app/models/enums/zone-banniere.enum';
import { IonSlides, NavController } from '@ionic/angular';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { BaseComponent } from 'src/app/base.component';
import { takeUntil, switchMap, catchError, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { SubscriptionModel } from 'src/shared';
import { OffreService } from 'src/app/models/offre-service.model';

@Component({
  selector: 'app-offres-services',
  templateUrl: './offres-services.page.html',
  styleUrls: ['./offres-services.page.scss'],
})
export class OffresServicesPage extends BaseComponent implements OnInit {
  static ROUTE_PATH: string = '/offres-services';
  bannieres$: Observable<any>;

  slideSelected = 1;
  isLoading: boolean = false;
  activeTabIndex = 0;
  activeSubIndex = 0;
  currentPhoneNumber = this.dashbService.getCurrentPhoneNumber();
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true,
  };
  operations$: Observable<any[]>;
  tabHeaderItems: any[] = [];
  categoriesOffreServiceLevel1: any[];
  allServices: OffreService[];
  filteredServices: OffreService[];

  constructor(
    public banniereService: BanniereService,
    private navCtl: NavController,
    public opService: OperationService,
    private dashbService: DashboardService,
    private authServ: AuthenticationService
  ) {
    super();
  }

  ngOnInit() {
    this.banniereService
      .queryListBanniereByFormule(SessionOem.CODE_FORMULE, ZoneBanniere.offre)
      .subscribe();
    this.initData();
  }

  initData() {
    this.isLoading = true;
    this.authServ
      .getSubscription(this.currentPhoneNumber)
      .pipe(
        switchMap((res: SubscriptionModel) => {
          return this.opService.initServicesData(res.code).pipe(
            tap((res: any) => {
              this.isLoading = false;
              this.categoriesOffreServiceLevel1 = res.categories;
              this.allServices = res.services;
              this.filterServices();
            }),
            catchError((err: any) => {
              this.isLoading = false;
              return of(err);
            }),
            takeUntil(this.ngUnsubscribe)
          );
        }),
        catchError((err: any) => {
          this.isLoading = false;
          return err;
        })
      )
      .subscribe();
  }

  isServiceHidden(service: OffreService) {
    return (
      !service.activated &&
      (!service.reasonDeactivation || service.reasonDeactivation === '')
    );
  }

  changeTabHeader(tabIndex: number) {
    this.sliders.slideTo(tabIndex);
    this.activeTabIndex = tabIndex;
    this.activeSubIndex = 0;
    this.filterServices();
  }

  onChangeSubCat(subCatIndex: number) {
    this.activeSubIndex = subCatIndex;
    this.filterServices();
  }

  slideChanged() {
    this.sliders.getActiveIndex().then((index) => {
      this.activeTabIndex = index;
      this.activeSubIndex = 0;
      this.filterServices();
    });
  }

  filterServices() {
    const currentSubCategory = this.categoriesOffreServiceLevel1[
      this.activeTabIndex
    ].categorieOffreServices[this.activeSubIndex];
    this.filteredServices = this.allServices.filter((service) => {
      const serviceMappedCategoryById = service.categorieOffreServices.map(
        (x) => x.id
      );
      return serviceMappedCategoryById.includes(currentSubCategory.id);
    });
  }

  goBack() {
    this.navCtl.pop();
  }
}
