import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { OPERATION_ABONNEMENT_WIDO, PassInfoModel, PassInternetModel } from 'src/shared';
import { OffreService } from '../models/offre-service.model';
import { PageHeader } from '../models/page-header.model';
import { PassAbonnementWidoService } from '../services/pass-abonnement-wido-service /pass-abonnement-wido.service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import { getPageHeader } from '../utils/title.util';

enum WIDO_CATEGORIES {
  ABONNEMENT = 'ABONNEMENT',
  PPV = 'PPV',
}
@Component({
  selector: 'app-list-pass-usage',
  templateUrl: './list-pass-usage.page.html',
  styleUrls: ['./list-pass-usage.page.scss'],
})
export class ListPassUsagePage implements OnInit {
  loadingPass: boolean;
  loadingPassPPV: boolean;
  errorLoadingPass: boolean;
  listPass: any[];
  listPassPPV: any[];
  serviceUsage: OffreService;
  recipientMsisdn: string;
  state: any;
  pageInfos: PageHeader;
  OPERATION_ABONNEMENT_WIDO = OPERATION_ABONNEMENT_WIDO;
  categories = [
    {
      label: 'Abonnement',
      value: WIDO_CATEGORIES.ABONNEMENT,
    },
    {
      label: 'Pay Per View',
      value: WIDO_CATEGORIES.PPV,
    },
  ];
  selectedCategory: WIDO_CATEGORIES = WIDO_CATEGORIES.ABONNEMENT;
  constructor(private router: Router, private navController: NavController, private passService: PassInternetService, private passAbonnementWido: PassAbonnementWidoService) {}

  ngOnInit() {
    this.getPageParams();
  }

  getPageParams() {
    if (this.router && this.router.getCurrentNavigation()) {
      let state = this.router.getCurrentNavigation().extras.state;
      this.state = state ? state : history.state;
      console.log(this.state);
      this.serviceUsage = state.serviceUsage;
      this.recipientMsisdn = state.recipientMsisdn;
      this.pageInfos = getPageHeader(this.serviceUsage.code, this.serviceUsage);
      this.loadPass();
    }
  }

  loadPass() {
    this.loadingPass = true;
    this.loadingPassPPV = true;
    this.errorLoadingPass = false;
    if (this.serviceUsage) {
      if (this.serviceUsage.code === OPERATION_ABONNEMENT_WIDO) {
        this.passAbonnementWido
          .getListPassAbonnementWido(this.recipientMsisdn)
          .pipe(
            tap((res: PassInternetModel[]) => {
              this.loadingPass = false;
              this.listPass = res;
            }),
            catchError(err => {
              this.loadingPass = false;
              this.errorLoadingPass = true;
              return throwError(err);
            })
          )
          .subscribe();

        this.passAbonnementWido
          .getListPassPPVWido(this.recipientMsisdn)
          .pipe(
            map((res: PassInfoModel[]) => {
              const responseWitthoutDuplication = res.filter((item, index, a) => a.findIndex(t => t.price_plan_index === item.price_plan_index) === index);
              return responseWitthoutDuplication;
            }),
            tap((res: PassInfoModel[]) => {
              this.loadingPassPPV = false;
              this.listPassPPV = res;
            }),
            catchError(err => {
              this.loadingPassPPV = false;
              this.errorLoadingPass = true;
              return throwError(err);
            })
          )
          .subscribe();
      } else {
        this.passService.getPassUsage(this.serviceUsage.code, this.recipientMsisdn).subscribe(
          res => {
            this.loadingPass = false;
            this.listPass = res;
          },
          err => {
            this.loadingPass = false;
            this.errorLoadingPass = true;
          }
        );
      }
    }
  }

  changeCategory(value: WIDO_CATEGORIES) {
    this.selectedCategory = value;
  }

  goBack() {
    this.navController.pop();
  }

  choosePass(pass) {
    this.state.pass = pass;
    console.log('state to send', this.state);

    let navigationExtras: NavigationExtras = {
      state: this.state,
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
  }
}
