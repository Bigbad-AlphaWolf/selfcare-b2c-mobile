import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoosterModel } from 'src/app/models/booster.model';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';
import { SubscriptionModel, CODE_KIRENE_Formule } from 'src/shared';

@Component({
  selector: 'app-item-pass-illimix',
  templateUrl: './item-pass-illimix.component.html',
  styleUrls: ['./item-pass-illimix.component.scss'],
})
export class ItemPassIllimixComponent implements OnInit {
  @Input() passIllimix: any;
  @Input() boosters: BoosterModel[];
  @Output() selectPass = new EventEmitter();
  @Input() subscription: SubscriptionModel;
  KIRENE_SUBSCRIPTION_CODE_FORMULE = CODE_KIRENE_Formule;
  FILE_BASE_URL: string = FILE_DOWNLOAD_ENDPOINT;
  constructor() {}

  ngOnInit() {}

  choosePass(pass: any) {
    this.selectPass.emit(pass);
  }
}
