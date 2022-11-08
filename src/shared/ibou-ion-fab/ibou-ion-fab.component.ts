import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { DimeloCordovaPlugin } from 'DimeloPlugin/ngx';
import { InfosAbonneModel } from 'src/app/models/infos-abonne.model';
import { ANALYTICS_PROVIDER, OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
const ls = new SecureLS({ encodingType: 'aes' });
const { DIMELO_CHAT_MARKUP } = environment;
@Component({
  selector: 'app-ibou-ion-fab',
  templateUrl: './ibou-ion-fab.component.html',
  styleUrls: ['./ibou-ion-fab.component.scss'],
})
export class IbouIonFabComponent implements OnInit {
  fabOpened = false;
  DIMELO_CHAT_MARKUP = DIMELO_CHAT_MARKUP;
  @Output() goTabAssistance: EventEmitter<any> = new EventEmitter();

  constructor(private oemLoggingService: OemLoggingService, private el: ElementRef, private dashboardServ: DashboardService, private sdkDimelo: DimeloCordovaPlugin) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  fabToggled() {
    //this.fabOpened = !this.fabOpened;
    this.oemLoggingService.registerEvent('Dashboard_click_on_Ibou', null, ANALYTICS_PROVIDER.ALL);
    this.openDimeloChat();
  }

  openDimeloChat() {
    const user: InfosAbonneModel = ls.get('userInfos');
    const username = `${user?.givenName} ${user?.familyName}`;
    const msisdn = this.dashboardServ.getMainPhoneNumber();
    //console.log('username', username);
    //console.log('msisdn', msisdn);

    this.sdkDimelo.openChat(username, msisdn).then(
      () => {
        console.log('chat open');
      },
      err => {
        console.log('chat not open', err);
      }
    );
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
}
