import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {environment} from 'src/environments/environment.prod';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';
import {tap} from 'rxjs/operators';
import {isPrepaidOrHybrid, SubscriptionModel} from 'src/app/dashboard';
import * as SecureLS from 'secure-ls';
const ls = new SecureLS({encodingType: 'aes'});
const {DIMELO_CHAT_MARKUP} = environment;
@Component({
  selector: 'app-ibou-ion-fab',
  templateUrl: './ibou-ion-fab.component.html',
  styleUrls: ['./ibou-ion-fab.component.scss']
})
export class IbouIonFabComponent implements OnInit {
  fabOpened = false;
  DIMELO_CHAT_MARKUP = DIMELO_CHAT_MARKUP;
  currentMsisdn: string;
  @Output() goTabAssistance: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private socialSharing: SocialSharing,
    private el: ElementRef,
    private dashboardServ: DashboardService,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentMsisdn = this.dashboardServ.getCurrentPhoneNumber();
  }

  ionViewWillEnter() {}

  fabToggled() {
    //this.fabOpened = !this.fabOpened;
    this.followAnalyticsService.registerEventFollow('Dashboard_click_on_Ibou', 'event', 'clicked');
    this.openDimeloChat();
  }

  openDimeloChat() {
    const user = ls.get("user");
    const username = `${user.firstName} ${user.lastName}`;
    const msisdn = this.dashboardServ.getMainPhoneNumber();
    // @ts-ignore
    cordova.exec((res) => {
      console.log("Dimelo Plugin res", res);
    }, (err) => {
      console.log("Dimelo Plugin err", err);
      
    }, "DimeloCordovaPlugin", "openChat", [username, msisdn]);
  }

  hideChatBlock() {
    const chatBlock = this.el.nativeElement.querySelectorAll('.dimelo_chat_item_markup')[0];
    chatBlock.setAttribute('display', 'none');
    chatBlock.style.display = 'none';
  }

  chatWithIbou() {
    const btn = this.el.nativeElement.querySelectorAll('.contact-container-body-block-btn')[0];
    if (btn) btn.click();
  }

  goToSatisfactionForm() {
    this.router.navigate(['/satisfaction-form']);
    this.followAnalyticsService.registerEventFollow('Ibou_Formulaire_de_satisfaction_clic', 'event', 'clicked');
  }

  goToBesoinAide() {
    this.authServ
      .getSubscription(this.currentMsisdn)
      .pipe(
        tap((sub: SubscriptionModel) => {
          if (isPrepaidOrHybrid(sub)) {
            this.followAnalyticsService.registerEventFollow('Ibou_Assistance_Hub_clic_new_dashboard', 'event', 'clicked');
            this.goTabAssistance.emit();
          } else {
            this.router.navigate(['/assistance-hub']);
            this.followAnalyticsService.registerEventFollow('Ibou_Assistance_Hub_clic', 'event', 'clicked');
          }
        })
      )
      .subscribe();
  }

  defaulSharingSheet() {
    const url = 'http://bit.ly/2NHn5aS';
    const postTitle =
      "Comme moi télécharge et connecte toi gratuitement sur l'application " +
      'Orange et Moi Fi rek la http://onelink.to/6h78t2 ou sur www.orangeetmoi.sn ' +
      'Bu ande ak simplicité ak réseau mo gën #WaawKay';

    this.socialSharing
      .share(postTitle, null, null, url)
      .then(_ => {
        this.followAnalyticsService.registerEventFollow('Ibou_open_native_share_application_success', 'event');
      })
      .catch((err: any) => {
        console.log('Cannot open default sharing sheet' + err);
        this.followAnalyticsService.registerEventFollow('Ibou_open_native_share_application_failed', 'error', {error: err});
      });
    this.followAnalyticsService.registerEventFollow('Ibou_share_application_clic', 'event', 'clicked');
  }

  goIbouPage() {
    this.router.navigate(['/contact-ibou-hub']);
    this.followAnalyticsService.registerEventFollow('Ibou_talk_to_Ibou_clic', 'event', 'clicked');
  }
}
