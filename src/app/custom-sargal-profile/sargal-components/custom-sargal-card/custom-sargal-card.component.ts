import { Component, Input, OnInit } from '@angular/core';
import { BonPlanSargalModel } from 'src/app/models/bons-plans-sargal.model';
import { downloadAvatarEndpoint } from 'src/app/services/dashboard-service/dashboard.service';
import { LocalStorageService } from 'src/app/services/localStorage-service/local-storage.service';

@Component({
  selector: 'app-custom-sargal-card',
  templateUrl: './custom-sargal-card.component.html',
  styleUrls: ['./custom-sargal-card.component.scss'],
})
export class CustomSargalCardComponent implements OnInit {
  @Input() sargalCard: BonPlanSargalModel;
  downloadAvatarEndpoint = downloadAvatarEndpoint;
  name: string;

  constructor(private lsService: LocalStorageService) { }

  ngOnInit() {
    this.getUsername();
  }

  getUsername() {
    const user = this.lsService.getFromLocalStorage('user');
    this.name = `${user.firstName} ${user.lastName}`;
  }

}
