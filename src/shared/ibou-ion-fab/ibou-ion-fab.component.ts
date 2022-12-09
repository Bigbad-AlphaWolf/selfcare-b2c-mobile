import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import * as SecureLS from 'secure-ls';
import { ANALYTICS_PROVIDER, OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { AssistanceService } from 'src/app/services/assistance.service';
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

  constructor(private oemLoggingService: OemLoggingService, private el: ElementRef, private dashboardServ: DashboardService, private assistanceService: AssistanceService) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  fabToggled() {
    //this.fabOpened = !this.fabOpened;
    this.oemLoggingService.registerEvent('Dashboard_click_on_Ibou', null, ANALYTICS_PROVIDER.ALL);
    this.openDimeloChat();
  }

  openDimeloChat() {
    this.assistanceService.openIbouDimeloChat();
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
