import { Component, OnInit } from '@angular/core';
import { OperationOem } from 'src/app/models/operation.model';
import { ACTIONS_RAPIDES_OPERATIONS_DASHBOARD, ACTIONS_RAPIDES_OPERATIONS_POSTPAID } from 'src/app/utils/operations.util';

@Component({
  selector: 'app-oem-services',
  templateUrl: './oem-services.page.html',
  styleUrls: ['./oem-services.page.scss'],
})
export class OemServicesPage implements OnInit {
  operations: OperationOem[] = ACTIONS_RAPIDES_OPERATIONS_POSTPAID;

  constructor() { }

  ngOnInit() {
  }

}
