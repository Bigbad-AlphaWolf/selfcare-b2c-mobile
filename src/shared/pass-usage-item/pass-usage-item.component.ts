import { Component, Input, OnInit } from '@angular/core';
import { OffreService } from 'src/app/models/offre-service.model';

@Component({
  selector: 'app-pass-usage-item',
  templateUrl: './pass-usage-item.component.html',
  styleUrls: ['./pass-usage-item.component.scss'],
})
export class PassUsageItemComponent implements OnInit {
  @Input() serviceUsage: OffreService;
  @Input() passUsage: any;
  mockBackground = '/assets/images/background_wido.png';

  constructor() {}

  ngOnInit() {}
}
