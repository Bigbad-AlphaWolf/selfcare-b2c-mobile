import {Component, Input, OnInit} from '@angular/core';
import {OMCustomerStatusModel} from 'src/app/models/om-customer-status.model';
import {ApplicationRoutingService} from 'src/app/services/application-routing/application-routing.service';
import {ConfirmMsisdnModel} from 'src/app/services/authentication-service/authentication.service';
import {OPERATION_CREATE_PIN_OM} from 'src/shared';

@Component({
  selector: 'app-item-om-user-status-card-infos',
  templateUrl: './item-om-user-status-card-infos.component.html',
  styleUrls: ['./item-om-user-status-card-infos.component.scss']
})
export class ItemOmUserStatusCardInfosComponent implements OnInit {
  @Input() userOmStatus: OMCustomerStatusModel;
  @Input() payload: ConfirmMsisdnModel;
  constructor(private appRouting: ApplicationRoutingService) {}

  ngOnInit() {}

  goToCreatePinOM() {
    this.appRouting.goToCreatePinOM(OPERATION_CREATE_PIN_OM, this.payload);
  }
}
