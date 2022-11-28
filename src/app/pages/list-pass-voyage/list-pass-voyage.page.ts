import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { PassVoyageService } from 'src/app/services/pass-voyage/pass-voyage.service';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { CountryPass } from 'src/app/models/country-pass.model';
import { tap, delay, map, catchError, finalize } from 'rxjs/operators';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { PassVoyage } from 'src/app/models/enums/pass-voyage.enum';
import { getOrderedListCategory, INTERNATIONAL_PASSES_INDICATIF_ARRAY } from 'src/shared';

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
  hasError: boolean;
  constructor(private passVoyageService: PassVoyageService, private navCtl: NavController) {}

  ngOnInit() {
    //1 Get countries
    this.isLoading = true;
    this.countries$ = this.passVoyageService.fetchCountries().pipe(
      map((res: CountryPass[]) => {
        return res.filter(country => !INTERNATIONAL_PASSES_INDICATIF_ARRAY.includes(country.indicatif));
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
      finalize(() => {
        this.isLoading = false;
      }),
      catchError(err => {
        this.hasError = true;
        return throwError(err);
      }),
      map((rs: any[]) => {
        this.isLoading = false;
        const [results] = rs;
        const response = [];
        this.tabHeaderItems = [];
        const pass_appel = results.filter(elt => {
          return elt.bundleType === PassVoyage.APPEL;
        });
        const pass_data = results.filter(elt => {
          return elt.bundleType === PassVoyage.DATA;
        });
        const pass_mixed = results.filter(elt => {
          return elt.bundleType === PassVoyage.TOUS;
        });

        if (pass_appel?.length) {
          this.tabHeaderItems.push('Appel');
          response.push(pass_appel);
        }

        if (pass_data?.length) {
          this.tabHeaderItems.push('Internet');
          response.push(pass_data);
        }

        if (pass_mixed.length) {
          const listCategory = this.getCategoryPass(pass_mixed);
          for (const category of listCategory) {
            const pass = pass_mixed.filter(elt => elt?.categoriePass?.libelle === category);
            this.tabHeaderItems.push(category);
            response.push(pass);
          }
        }

        console.log('result', response);

        return response;
      })
    );
  }

  constructPassRequests() {
    return [this.passVoyageService.fetchPassVoyage(this.country, PassVoyage.TOUS, this.opXtras.code)];
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
    this.sliders.getActiveIndex().then(index => {
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

  getCategoryPass(listPass: any[]) {
    const categories = listPass.map(item => {
      return item?.categoriePass;
    });
    const responseWithoutDuplication = getOrderedListCategory(categories);
    return responseWithoutDuplication;
  }
}
