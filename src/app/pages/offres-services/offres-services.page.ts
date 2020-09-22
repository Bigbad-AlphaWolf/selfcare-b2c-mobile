import { Component, OnInit } from '@angular/core';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { Observable } from 'rxjs';
import { ZoneBanniere } from 'src/app/models/enums/zone-banniere.enum';

@Component({
  selector: 'app-offres-services',
  templateUrl: './offres-services.page.html',
  styleUrls: ['./offres-services.page.scss'],
})
export class OffresServicesPage implements OnInit {
  static ROUTE_PATH : string = '/offres-services';
  bannieres$ : Observable<any>;

  constructor(private banniereService : BanniereService) { }

  ngOnInit() {
    this.bannieres$ = this.banniereService.queryListBanniereByFormule(SessionOem.CODE_FORMULE, ZoneBanniere.offre);
  }

}
