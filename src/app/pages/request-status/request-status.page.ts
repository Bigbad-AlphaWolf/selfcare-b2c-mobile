import { Component, OnInit } from '@angular/core';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';
import { ReclamationType } from 'src/app/models/enums/reclamation.enum';

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.page.html',
  styleUrls: ['./request-status.page.scss'],
})
export class RequestStatusPage implements OnInit {
  static PATH_ROUTE = 'request-status';
  title : string = 'Réclamation';
  constructor(public requestService : RequestOemService) { }

  ngOnInit() {
    this.title = this.requestService.currentRequestStatus[0].type === ReclamationType.REQUEST ? 'Demande' : 'Dérangement';
  }

}
