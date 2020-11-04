import { Component, OnInit } from '@angular/core';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';
import { ReclamationType } from 'src/app/models/enums/reclamation.enum';
import { RequestOem } from 'src/app/models/request-oem.model';

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.page.html',
  styleUrls: ['./request-status.page.scss'],
})
export class RequestStatusPage implements OnInit {
  static PATH_ROUTE = 'request-status';
  title : string = 'Réclamation';
  listRequestWithStatus: { "current" : RequestOem, "previous" : RequestOem[], "next": RequestOem[] } = { "current": null, "previous": [], "next": []} ;
  constructor(public requestService : RequestOemService) {
    const requests = requestService.currentRequestStatus;
    this.listRequestWithStatus.current = requests.find((el: RequestOem) => {
      return el.currentState
    });

    this.listRequestWithStatus.previous = requests.filter((elt: RequestOem) => {
      return elt.order < this.listRequestWithStatus.current.order;
    });

    this.listRequestWithStatus.next = requests.filter((elt: RequestOem) => {
      return elt.order > this.listRequestWithStatus.current.order;
    })
   }

  ngOnInit() {
    this.title = this.requestService.currentRequestStatus[0].type === ReclamationType.REQUEST ? 'Demande' : 'Dérangement';
  }

}
