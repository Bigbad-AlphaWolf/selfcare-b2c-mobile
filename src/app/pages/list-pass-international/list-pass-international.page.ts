import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CountryPass } from 'src/app/models/country-pass.model';
import { PassVoyage } from 'src/app/models/enums/pass-voyage.enum';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { PassVoyageService } from 'src/app/services/pass-voyage/pass-voyage.service';
import {
	arrangePassByCategory,
	CountriesIndicatif,
  getOrderedListCategory,
  INTERNATIONAL_PASSES_INDICATIF_ARRAY,
	PassIllimModel,
} from 'src/shared';

@Component({
  selector: 'app-list-pass-international',
  templateUrl: './list-pass-international.page.html',
  styleUrls: ['./list-pass-international.page.scss'],
})
export class ListPassInternationalPage implements OnInit {
  loading: boolean;
  hasError: boolean;
  countries: CountryPass[];
  filters = [{ label: 'Pass Monde' }, { label: 'Pass Afrique' }];
  activeIndex = 0;
  passAfric;
  passWorld;
  @ViewChild('sliders') sliders: IonSlides;
	listCategory: string[] = [];
	filteredList: PassIllimModel[] = [];
	fullList: {label: string, pass: PassIllimModel[]}[] = [];
  opXtras: OperationExtras;

  constructor(
    private passVoyageService: PassVoyageService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getPassInternational();
  }

  getPassInternational() {
    this.loading = true;
    this.hasError = false;
    this.passVoyageService
      .fetchCountries()
      .pipe(
        switchMap((res: CountryPass[]) => {
          this.countries = res.filter((country) =>
            INTERNATIONAL_PASSES_INDICATIF_ARRAY.includes(country.indicatif)
          );
          const AFRICA = this.countries.find(
            (x) => x.indicatif === CountriesIndicatif.AFRICA
          );
          const WORLD = this.countries.find(
            (x) => x.indicatif === CountriesIndicatif.WORLD
          );
          const passAfriqueRequest = AFRICA
            ? this.passVoyageService.fetchPassVoyage(AFRICA, PassVoyage.TOUS)
            : of([]);
          const passMondeRequest = WORLD
            ? this.passVoyageService.fetchPassVoyage(WORLD, PassVoyage.TOUS)
            : of([]);
          return forkJoin([passAfriqueRequest, passMondeRequest]).pipe(
            tap(([passAfrica, passWorld]) => {
              this.loading = false;
              this.passAfric = passAfrica;
              this.passWorld = passWorld;
							this.listCategory = this.getCategoryPass([...this.passAfric,...this.passWorld]);
							this.fullList = arrangePassByCategory(
                [...this.passAfric,...this.passWorld],
                this.listCategory
              );
              this.opXtras = history.state;
            }),
            catchError((err) => {
              this.loading = false;
              this.hasError = true;
              return throwError(err);
            })
          );
        }),
        catchError((err) => {
          this.loading = false;
          this.hasError = true;
          return throwError(err);
        })
      )
      .subscribe();
  }

  changeCategory(index) {
    this.activeIndex = index;
    this.sliders.slideTo(index);
  }

  slideChanged() {
    this.sliders.getActiveIndex().then((index) => {
      this.activeIndex = index;
    });
  }

	getCategoryPass(listPass: PassIllimModel[]) {
		const categories = listPass.map((item) => {
			return item?.categoriePass
		});
		const responseWithoutDuplication = getOrderedListCategory(categories);
		return responseWithoutDuplication;
	}

  goBack() {
    this.navController.pop();
  }

  choosePass(pass: any) {
    this.opXtras.pass = pass;
    this.navController.navigateForward(['/operation-recap'], {
      state: this.opXtras,
    });
  }
}
