import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { PassVoyageService } from 'src/app/services/pass-voyage/pass-voyage.service';
import { Observable, forkJoin, of } from 'rxjs';
import { CountryPass } from 'src/app/models/country-pass.model';
import { tap, delay, map } from 'rxjs/operators';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { PassVoyage } from 'src/app/models/enums/pass-voyage.enum';
import { INTERNATIONAL_PASSES_INDICATIF_ARRAY } from 'src/shared';

@Component({
  selector: 'app-list-pass-voyage',
  templateUrl: './list-pass-voyage.page.html',
  styleUrls: ['./list-pass-voyage.page.scss'],
})
export class ListPassVoyagePage implements OnInit {
  static ROUTE_PATH: string = '/list-pass-voyage';
  slideSelected = 1;
  listPass: any;
  isLoading: boolean = false;
  activeTabIndex = 0;
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true,
  };
  countries$: Observable<CountryPass[]>;
  country: CountryPass;
  passs$: Observable<any[]>;
  tabHeaderItems: any[] = [];
  codeFormule: any;
  opXtras: OperationExtras;
  constructor(
    private passVoyageService: PassVoyageService,
    private navCtl: NavController
  ) {}

  ngOnInit() {
    //1 Get countries
    this.isLoading = true;
    this.countries$ = this.passVoyageService.fetchCountries().pipe(
      map((res: CountryPass[]) => {
        return res.filter(
          (country) =>
            !INTERNATIONAL_PASSES_INDICATIF_ARRAY.includes(country.indicatif)
        );
      }),
      tap((countries: any) => {
        this.isLoading = false;
        if (countries.length) {
          //2 get first one
          this.country = countries[0];
          //3 initi all pass[appel, internet]
          this.initAllPass();
        }
      })
    );

    this.opXtras = history.state;
    this.activeTabIndex = 0;
  }

  initAllPass() {
    this.isLoading = true;
    this.activeTabIndex = 0;
    this.passs$ = forkJoin(this.constructPassRequests()).pipe(
      delay(100),
      map((rs: any[]) => {
        this.isLoading = false;
        let results: any[] = [];
        this.tabHeaderItems = [];
        if (rs[0].length) {
          this.tabHeaderItems.push('Appel');
          results.push(rs[0]);
        }

        if (rs[1].length) {
          this.tabHeaderItems.push('Internet');
          results.push(rs[1]);
        }
        return results;
      })
    );
  }

  constructPassRequests() {
    return [
      this.passVoyageService.fetchPassVoyage(this.country, PassVoyage.APPEL, this.opXtras.code),
      this.passVoyageService.fetchPassVoyage(this.country, PassVoyage.DATA, this.opXtras.code),
    ];
  }

  onCountryChanged($evt: CustomEvent) {
    //on country change, repeat step 3
    this.country = $evt.detail.value;
    this.initAllPass();
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

  goBack() {
    this.navCtl.pop();
  }

  choosePass(pass: any) {
    this.opXtras.pass = pass;
    this.navCtl.navigateForward(['/operation-recap'], { state: this.opXtras });
  }
}
