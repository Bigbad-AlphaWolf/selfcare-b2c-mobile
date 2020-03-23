import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { CODE_KIRENE_Formule, FormuleMobileModel, TarifZoningByCountryModel } from 'src/shared';
import { FormuleService } from '../services/formule-service/formule.service';
import { SubscriptionModel, dashboardOpened } from '../dashboard';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-my-formule',
  templateUrl: './my-formule.page.html',
  styleUrls: ['./my-formule.page.scss']
})
export class MyFormulePage implements OnInit {
  currentFormule;
  otherFormules;
  error;
  formulesArray = [];
  callCategoryList;
  smsCategoryList;
  dataLoaded = false;
  step = 'MA_FORMULE';
  detailsFormule: FormuleMobileModel;
  currentNumber: string;
  customAlertOptions: any = {
    header: 'Liste de pays',
    subHeader: 'Choisir un pays',
    translucent: true
  };

  images = [
    {
      codeFormule: '9133',
      icon: '/assets/images/4-2-g.png',
      banner: '/assets/images/background-header-jamono-max.jpg'
    },
    {
      codeFormule: '9131',
      icon: '/assets/images/4-g.png',
      banner: '/assets/images/background-header-jamono-new-scool.jpg'
    },
    {
      codeFormule: '9132',
      icon: '/assets/images/4-g.png',
      banner: '/assets/images/background-header-jamono-allo.jpg'
    }
  ];
  scr;

  listTarifsInternationaux: TarifZoningByCountryModel[] = [];

  tarifsByCountry: {tarifAppel: any, tarifSms: any};
  constructor(
    private router: Router,
    private formuleService: FormuleService,
    private authServ: AuthenticationService,
    private dashbdServ: DashboardService,
    private followAnalyticsService: FollowAnalyticsService,
  ) {}

  ngOnInit() {
  }

  queryAllTarifs(){
    this.formuleService.getAllCountriesWithTarifs().subscribe((res: TarifZoningByCountryModel[])=>{
      this.listTarifsInternationaux = res;
      if(this.listTarifsInternationaux.length){
        this.tarifsByCountry = {tarifAppel: this.listTarifsInternationaux[0].zone.tarifFormule ? this.listTarifsInternationaux[0].zone.tarifFormule.tarifAppel : '', tarifSms: this.listTarifsInternationaux[0].zone.tarifFormule ? this.listTarifsInternationaux[0].zone.tarifFormule.tarifSms : ''};
      }
    })
  }

  ionViewWillEnter(){
    this.currentNumber = this.dashbdServ.getCurrentPhoneNumber();
    this.processInfosFormules();
    // this.queryAllTarifs();
    // this.authServ.UpdateNotificationInfo();
  }

  getTarifs(event: any){
    const selectCountry = event.detail.value;
    const selectedTarifs = this.listTarifsInternationaux.find((value: TarifZoningByCountryModel)=>{
      return value.name === selectCountry;
    })
    this.tarifsByCountry = selectedTarifs.zone.tarifFormule;    
  }

  processInfosFormules() {
    this.authServ.getSubscription(this.currentNumber).subscribe(
      (res: SubscriptionModel) => {
        this.followAnalyticsService.registerEventFollow(
          'MaFormule_sidemenu',
          'event',
          'opened'
        );
        this.formuleService.getformules(res.profil).subscribe(
          (resp: FormuleMobileModel[]) => {
            this.formulesArray = resp.filter((val: FormuleMobileModel)=>{
              return val.type === 'MOBILE';
            });
            if (this.formulesArray.length === 0) {
              this.dataLoaded = true;
              this.error = 'Problème de chargement';
            } else {
              this.getCurrentAndOthersFormules();
            }
          },
          (error: any) => {
            this.dataLoaded = true;
            // call log service
            this.error = 'erreur lors du chargement';
          }
        );
      },
      err => {
        this.dataLoaded = true;
        this.error = 'erreur lors du chargement';
      }
    );
  }

  getCurrentAndOthersFormules() {
    this.dataLoaded = false;
    this.error = null;
    this.authServ.getSubscription(this.currentNumber).subscribe(
      (resp: SubscriptionModel) => {
        this.dataLoaded = true;
        this.currentFormule = this.formulesArray.find(
          (formule: FormuleMobileModel) => {
            return formule.code === resp.code;
          }
        );
        if (this.currentFormule) {
          if (this.currentFormule.code !== this.getKireneFormule()) {
            this.otherFormules = this.formulesArray.filter(
              (formule: FormuleMobileModel) => {
                return (
                  formule.code !== this.currentFormule.code &&
                  formule.code !== this.getKireneFormule()
                );
              }
            );
          }
        } else {
          this.error =
            'Erreur, Votre formule n\'est peut etre pas encore prise en compte ';
        }
        this.dataLoaded = true;
      },
      (err: any) => {
        this.dataLoaded = true;
        this.error =
          'Erreur, Votre formule n\'est peut etre pas encore prise en compte ';
      }
    );
  }
  getCategoryList(currentFormuleArray, category: string) {
    return currentFormuleArray.filter(item => {
      return item.categorie === category;
    });
  }
  getKireneFormule() {
    return CODE_KIRENE_Formule;
  }
  getImgByFormule(formule: FormuleMobileModel) {
    const img = this.images.find(image => {
      return image.codeFormule === formule.code;
    });
    return img && img.icon ? img.icon : '/assets/images/4-2-g.png';
  }

  getBannerByFormule(formule: FormuleMobileModel) {
    let img;
    if (formule && formule.code) {
      img = this.images.find(element => {
        return element.codeFormule === formule.code;
      });
    }
    return img && img.banner
      ? img.banner
      : '/assets/images/background-header-jamono-allo.jpg';
  }

  seeDetailsFormule(formule: FormuleMobileModel) {
    this.detailsFormule = formule;
    this.step = 'DETAILS_FORMULE';
  }

  goBack() {
    if (this.step === 'MA_FORMULE') {
      this.router.navigate(['/dashboard']);
    } else {
      this.step = 'MA_FORMULE';
    }
  }

  getNewFormuleInfos() {
    this.getCurrentAndOthersFormules();
    this.goBack();
  }
}
