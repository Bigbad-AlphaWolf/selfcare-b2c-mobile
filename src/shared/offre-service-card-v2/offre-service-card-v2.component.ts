import { Component, Input, OnInit } from '@angular/core';
import { OffreService } from 'src/app/models/offre-service.model';

@Component({
  selector: 'app-offre-service-card-v2',
  templateUrl: './offre-service-card-v2.component.html',
  styleUrls: ['./offre-service-card-v2.component.scss'],
})
export class OffreServiceCardV2Component implements OnInit {
  @Input() service: OffreService;
  constructor() {}

  ngOnInit() {}
}
