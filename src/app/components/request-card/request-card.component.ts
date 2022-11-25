import { Component, OnInit, Input } from '@angular/core';
import { DimeloCordovaPlugin } from 'DimeloPlugin/ngx';
import { RedirectionEnum, RequestOem } from 'src/app/models/request-oem.model';
import * as SecureLS from 'secure-ls';
import { InfosAbonneModel } from 'src/app/models/infos-abonne.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'oem-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
})
export class RequestCardComponent implements OnInit {
  @Input('request') request: RequestOem;
  @Input('fullDescription') fullDescription: boolean = false;
  constructor(private chatDimelo: DimeloCordovaPlugin, private dashboardServ: DashboardService, private iab: InAppBrowser) {}

  ngOnInit() {}

  callIbou() {
    const user: InfosAbonneModel = ls.get('userInfos');
    const username = `${user?.givenName} ${user?.familyName}`;
    const msisdn = this.dashboardServ.getMainPhoneNumber();
    this.chatDimelo
      .openChat(username, msisdn)
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  procesRedirection() {
    if (this.request.redirectTo === RedirectionEnum.IBOU) {
      this.callIbou();
    }
    //else {
    //	this.iab.open(this.request.redirectTo)
    //}
  }
}
