import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import { arrangePassByCategory } from 'src/shared';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-list-pass-internet-v3',
  templateUrl: './list-pass-internet-v3.page.html',
  styleUrls: ['./list-pass-internet-v3.page.scss'],
})
export class ListPassInternetV3Page implements OnInit {
  slideSelected = 1;
  userNumber: string;
  userCodeFormule: string;
  listCategory = [];
  listPassInternet: any;
  isLoaded: boolean;
  activeTabIndex = 0;
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true,
  };
  fullListPass: any[];
  recipientName:string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appRouting: ApplicationRoutingService,
    private passIntService: PassInternetService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.payload
      ) {
        this.userNumber = this.router.getCurrentNavigation().extras.state.payload.destinataire;
        this.userCodeFormule = this.router.getCurrentNavigation().extras.state.payload.code;
        this.recipientName = this.router.getCurrentNavigation().extras.state.payload.recipientName;
        this.passIntService.setUserCodeFormule(this.userCodeFormule);
        this.passIntService.setListPassInternetOfUserByQuery();
        this.passIntService.getStatusPassLoaded().subscribe((status: boolean) => {
          this.isLoaded = status;
          if (this.isLoaded) {
            this.listCategory = this.passIntService.getListCategoryPassInternet();
            this.listPassInternet = this.passIntService.getListPassInternetOfUser();
            this.fullListPass = arrangePassByCategory(this.listPassInternet,this.listCategory);
          }
        });

      }else{
        this.appRouting.goToSelectRecepientPassInternet();
      }
    });
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

  goToRecepientPassInternetPage() {
    this.appRouting.goToSelectRecepientPassInternet();
  }

  choosePass(pass: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        pass,
        recipientMsisdn: this.userNumber,
        recipientCodeFormule: this.userCodeFormule,
        recipientName: this.recipientName,
      },
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
  }
}
