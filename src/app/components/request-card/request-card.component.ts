import { Component, OnInit, Input } from '@angular/core';
import { DimeloCordovaPlugin } from 'DimeloPlugin/ngx';
import { RedirectionEnum, RequestOem } from 'src/app/models/request-oem.model';
import * as SecureLS from 'secure-ls';
import { InfosAbonneModel } from 'src/app/models/infos-abonne.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AssistanceService } from 'src/app/services/assistance.service';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'oem-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
})
export class RequestCardComponent implements OnInit {
  @Input('request') request: RequestOem;
  @Input('fullDescription') fullDescription: boolean = false;
  constructor(private assistantServ: AssistanceService) {}

  ngOnInit() {}

  procesRedirection() {
    if (this.request.redirectTo === RedirectionEnum.IBOU) {
      this.assistantServ.openIbouDimeloChat();
    }
    //else {
    //	this.iab.open(this.request.redirectTo)
    //}
  }
}
