import { Component, OnInit } from '@angular/core';
import { FIXES_SERVICES_PAGE } from 'src/shared';
import { PageHeader } from '../models/page-header.model';
import { getPageHeader } from '../utils/title.util';

@Component({
  selector: 'app-fixes-services',
  templateUrl: './fixes-services.page.html',
  styleUrls: ['./fixes-services.page.scss'],
})
export class FixesServicesPage implements OnInit {
	pageInfos: PageHeader;
  constructor() { }

  ngOnInit() {
		this.pageInfos = getPageHeader(FIXES_SERVICES_PAGE)
  }

}
