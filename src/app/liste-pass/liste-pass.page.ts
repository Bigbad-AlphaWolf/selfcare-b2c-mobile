import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import {
  arrangePassByCategory,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
} from 'src/shared';
import { PassIllimixService } from '../services/pass-illimix-service/pass-illimix.service';

@Component({
  selector: 'app-liste-pass',
  templateUrl: './liste-pass.page.html',
  styleUrls: ['./liste-pass.page.scss'],
})
export class ListePassPage implements OnInit {
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
  constructor(
    private router: Router,
    private appRouting: ApplicationRoutingService,
    private passIntService: PassInternetService,
    private passIllimixServ: PassIllimixService,
    private navContr: NavController
  ) {}

  ngOnInit() {
    // this.route.queryParams.subscribe((params) => {
    // if (
    //   this.router.getCurrentNavigation().extras.state &&
    //   this.router.getCurrentNavigation().extras.state.payload
    // ) {
    if (this.router) {
      this.userNumber = this.router.getCurrentNavigation().extras.state.payload.destinataire;
      this.userCodeFormule = this.router.getCurrentNavigation().extras.state.payload.code;
      this.recipientName = this.router.getCurrentNavigation().extras.state.payload.recipientName;
      this.purchaseType = this.router.getCurrentNavigation().extras.state.payload.purchaseType;
      this.listCategory = [];
      this.listPass = [];
      this.activeTabIndex = 0;
      if (this.purchaseType === OPERATION_TYPE_PASS_INTERNET) {
        this.passIntService.setUserCodeFormule(this.userCodeFormule);
        this.passIntService.setListPassInternetOfUserByQuery();
        this.passIntService
          .getStatusPassLoaded()
          .subscribe((status: boolean) => {
            this.isLoaded = status;
            if (this.isLoaded) {
              this.listCategory = this.passIntService.getListCategoryPassInternet();
              this.listPass = this.passIntService.getListPassInternetOfUser();
              this.fullListPass = arrangePassByCategory(
                this.listPass,
                this.listCategory
              );
            }
          });
      } else {
        this.passIllimixServ.setUserCodeFormule(this.userCodeFormule);
        this.passIllimixServ.setListPassIllimix();
        this.passIllimixServ
          .getStatusLoadingPass()
          .subscribe((status: boolean) => {
            this.isLoaded = status;
            if (this.isLoaded) {
              this.listCategory = this.passIllimixServ.getCategoryListPassIllimix();
              this.listPass = this.passIllimixServ.getListPassIllimix();
              this.fullListPass = arrangePassByCategory(
                this.listPass,
                this.listCategory
              );
            }
          });
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
    this.navContr.pop()
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
