import { Component, OnInit } from '@angular/core';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.page.html',
  styleUrls: ['./request-status.page.scss'],
})
export class RequestStatusPage implements OnInit {
  static PATH_ROUTE = 'request-status';
  constructor(protected requestService : RequestOemService) { }

  ngOnInit() {
  }

}
