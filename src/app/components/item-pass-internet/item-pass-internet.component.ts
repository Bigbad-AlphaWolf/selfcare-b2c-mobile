import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PassInternetModel, CODE_KIRENE_Formule } from 'src/shared';
import { SubscriptionModel } from 'src/app/dashboard';
import { BoosterModel } from 'src/app/models/booster.model';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';

@Component({
  selector: 'app-item-pass-internet',
  templateUrl: './item-pass-internet.component.html',
  styleUrls: ['./item-pass-internet.component.scss'],
})
export class ItemPassInternetComponent implements OnInit {
  @Input() passInternet: any;
  @Output() selectPass = new EventEmitter();
  @Input() subscription: SubscriptionModel;
  @Input() boosters: BoosterModel[];
  KIRENE_SUBSCRIPTION_CODE_FORMULE = CODE_KIRENE_Formule;
  FILE_BASE_URL: string = FILE_DOWNLOAD_ENDPOINT;
  constructor() {}

  ngOnInit() {}

  choosePass(pass: any) {
    this.selectPass.emit(pass);
  }
}
