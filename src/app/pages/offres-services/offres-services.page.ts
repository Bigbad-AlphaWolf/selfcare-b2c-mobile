import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { Observable } from 'rxjs';
import { ZoneBanniere } from 'src/app/models/enums/zone-banniere.enum';
import { IonSlides, NavController } from '@ionic/angular';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { BaseComponent } from 'src/app/base.component';
import { takeUntil, switchMap, catchError, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { SubscriptionModel } from 'src/shared';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CookieService, Cookie } from 'ng2-cookies';
import { HttpResponse } from '@angular/common/http';
declare let cordova: any;
@Component({
  selector: 'app-offres-services',
  providers: [CookieService],
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

  constructor(
    public banniereService: BanniereService,
    private navCtl: NavController,
    public opService: OperationService,
    private dashbService: DashboardService,
    private authServ: AuthenticationService,
    private inAppBrowser: InAppBrowser,
    public cookieService: CookieService
  ) {
    super();
  }

  ngOnInit() {
    this.banniereService
      .queryListBanniereByFormule(SessionOem.CODE_FORMULE, ZoneBanniere.offre)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
    this.initData();
  }

  initData() {
    this.isLoading = true;
    this.authServ
      .getSubscriptionForTiers(this.currentPhoneNumber)
      .pipe(
        switchMap((res: SubscriptionModel) => {
          return this.opService.initServicesData(res.code).pipe(
            tap((res: any) => (this.isLoading = false)),
            catchError((err: any) => {
              this.isLoading = false;
              return err;
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

  changeTabHeader(tabIndex: number) {
    this.sliders.slideTo(tabIndex);
    this.activeTabIndex = tabIndex;
    this.activeSubIndex = 0;
  }

  onChangeSubCat(subCatIndex: number) {
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
