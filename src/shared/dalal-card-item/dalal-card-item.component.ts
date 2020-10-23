import { Component, Input, OnInit } from '@angular/core';
import { DalalTonesModel } from 'src/app/models/dalal-tones.model';
import { downloadAvatarEndpoint } from 'src/app/services/dashboard-service/dashboard.service';

@Component({
  selector: 'app-dalal-card-item',
  templateUrl: './dalal-card-item.component.html',
  styleUrls: ['./dalal-card-item.component.scss'],
})
export class DalalCardItemComponent implements OnInit {
  @Input() dalal: DalalTonesModel;
  @Input() disable: boolean;
  downloadAvatarEndpoint = downloadAvatarEndpoint;
  constructor() {}

  ngOnInit() {}
}
