import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApplicationRoutingService } from '../../services/application-routing/application-routing.service';
import { PassInternetService } from '../../services/pass-internet-service/pass-internet.service';
import {
  arrangePassByCategory,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  CODE_KIRENE_Formule,
  ERROR_MSG_PASS,
  OPERATION_TYPE_PASS_ALLO,
} from 'src/shared';
import { PassIllimixService } from '../../services/pass-illimix-service/pass-illimix.service';

@Component({
  selector: 'app-liste-pass',
  templateUrl: './liste-pass.page.html',
  styleUrls: ['./liste-pass.page.scss'],
})
export class ListePassPage implements OnInit {
  static ROUTE_PATH: string = '/list-pass';
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
  fullListPass: { label: string; pass: any[] }[];
  recipientName: string;
  purchaseType: string;
  OPERATION_INTERNET_TYPE = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_ILLIMIX_TYPE = OPERATION_TYPE_PASS_ILLIMIX;
  OPERATION_ALLO_TYPE = OPERATION_TYPE_PASS_ALLO;
  constructor(
    private router: Router,
    private appRouting: ApplicationRoutingService,
    private passIntService: PassInternetService,
    private passIllimixServ: PassIllimixService,
    private navCtl: NavController
  ) {}

  ngOnInit() {
    // this.route.queryParams.subscribe((params) => {
    // if (
    //   this.router.getCurrentNavigation().extras.state &&
    //   this.router.getCurrentNavigation().extras.state.payload
    // ) {
    if (this.router) {
      let payload = this.router.getCurrentNavigation().extras.state.payload;
      payload = payload ? payload : history.state;

      this.userNumber = payload.destinataire;
      this.userCodeFormule = payload.code;
      this.recipientName = payload.recipientName;
      this.purchaseType = payload.purchaseType;
      this.listCategory = [];
      this.listPass = [];
      this.activeTabIndex = 0;
      if (this.purchaseType === OPERATION_TYPE_PASS_INTERNET) {
        this.passIntService.setUserCodeFormule(this.userCodeFormule);
        this.passIntService
          .queryListPassInternetOfUser(this.userCodeFormule)
          .subscribe(
            (res: any) => {
              this.isLoaded = true;
              this.listCategory = this.passIntService.getListCategoryPassInternet();
              this.listPass = this.passIntService.getListPassInternetOfUser();
              this.fullListPass = arrangePassByCategory(
                this.listPass,
                this.listCategory
              );
            },
            (err: any) => {
              this.isLoaded = true;
            }
          );
      } else {
        const category =
          this.purchaseType === OPERATION_TYPE_PASS_ALLO ? 'allo' : null;
        this.passIllimixServ
          .queryListPassIllimix(this.userCodeFormule, category)
          .subscribe(
            (res: any) => {
              this.isLoaded = true;
              this.listCategory = this.passIllimixServ.getCategoryListPassIllimix();
              this.listPass = this.passIllimixServ.getListPassIllimix();
              this.fullListPass = arrangePassByCategory(
                this.listPass,
                this.listCategory
              );
            },
            (err: any) => {
              this.isLoaded = true;
            }
          );
      }
    }

    // }else{
    // this.appRouting.goToDashboard();
    // }
    // });
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
    // switch (this.purchaseType) {
    //   case OPERATION_TYPE_PASS_INTERNET:
    //     this.goToRecepientPassInternetPage();
    //     break;
    //   case OPERATION_TYPE_PASS_ILLIMIX:
    //     this.goToRecipientPassIllimixPage();
    //     break;
    //   default:
    //     break;
    // }
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

  getErrorMessageNoPass() {
    if (this.userCodeFormule === CODE_KIRENE_Formule) {
      return ERROR_MSG_PASS.LIST_EMPTY_FOR_KIRENE;
    }
    return ERROR_MSG_PASS.LIST_EMPTY;
  }
}
