import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { OPERATION_TYPE_PASS_INTERNET, OPERATION_TYPE_PASS_ILLIMIX, arrangePassByCategory } from 'src/shared';
import { Router, NavigationExtras } from '@angular/router';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { PassInternetService } from 'src/app/services/pass-internet-service/pass-internet.service';
import { PassIllimixService } from 'src/app/services/pass-illimix-service/pass-illimix.service';
import { PassVoyageService } from 'src/app/services/pass-voyage/pass-voyage.service';
import { Observable, forkJoin } from 'rxjs';
import { CountryPass } from 'src/app/models/country-pass.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-list-pass-voyage',
  templateUrl: './list-pass-voyage.page.html',
  styleUrls: ['./list-pass-voyage.page.scss'],
})
export class ListPassVoyagePage implements OnInit {
  static ROUTE_PATH : string = '/list-pass-voyage';
  slideSelected = 1;
  userNumber: string;
  userCodeFormule: string;
  listCategory = [];
  listPass: any;
  isLoaded: boolean;
  activeTabIndex = 0;
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true,
  };
  fullListPass: any[];
  recipientName: string;
  purchaseType: string;
  OPERATION_INTERNET_TYPE = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_ILLIMIX_TYPE = OPERATION_TYPE_PASS_ILLIMIX;
  countries$: Observable<CountryPass[]>;
  country: CountryPass;
  passs$: Observable<any[]>;
  tabHeaderItems : any[] = [
    'Appel', 'Internet', 'Illimix'
  ]
  codeFormule: any;
  opXtras: any;
  constructor(
    private router: Router,
    private appRouting: ApplicationRoutingService,
    private passVoyageService: PassVoyageService,
    private navCtl:NavController
  ) {}

  ngOnInit() {
    //Get countries
    this.countries$ = this.passVoyageService.fetchCountries().pipe(
      tap((countries:any)=>{
        if(countries.length){
          this.country = countries[0];
          this.passs$ = forkJoin(this.constructPassRequests());
        }
      })
    );
    // get first one
    //fetch all pass[appel, internet, illimix]
    //after that, init slides
    //on country change, repeat step 3

    this.opXtras = history.state
    this.activeTabIndex = 0;

  }

  constructPassRequests(){
    return [
    this.passVoyageService.fetchPassAppel(this.country, this.codeFormule),
      this.passVoyageService.fetchPassInternet(this.country, this.codeFormule),
      this.passVoyageService.fetchPassIllimix(this.country, this.codeFormule)
    ];
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
  
  goToRecepientPassInternetPage() {
    this.appRouting.goToSelectRecepientPassInternet();
  }

  goToRecipientPassIllimixPage() {
    this.appRouting.goToSelectRecepientPassIllimix();
  }

  choosePass(pass: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        pass,
        recipientMsisdn: this.userNumber,
        recipientCodeFormule: this.userCodeFormule,
        recipientName: this.recipientName,
        purchaseType: this.purchaseType,
      },
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
  }

}
