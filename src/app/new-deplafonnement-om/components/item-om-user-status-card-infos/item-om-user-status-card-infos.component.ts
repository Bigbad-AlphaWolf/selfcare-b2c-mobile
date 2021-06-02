import { Component, Input, OnInit } from '@angular/core';
import { OMCustomerStatusModel } from 'src/app/models/om-customer-status.model';

@Component({
  selector: 'app-item-om-user-status-card-infos',
  templateUrl: './item-om-user-status-card-infos.component.html',
  styleUrls: ['./item-om-user-status-card-infos.component.scss'],
})
export class ItemOmUserStatusCardInfosComponent implements OnInit {
  @Input() userOmStatus: OMCustomerStatusModel;
  constructor() { }

  ngOnInit() {}

}
