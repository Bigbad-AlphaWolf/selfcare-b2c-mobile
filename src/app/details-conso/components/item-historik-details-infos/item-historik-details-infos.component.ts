import { Component, OnInit, Input } from '@angular/core';
import { PurchaseModel } from 'src/shared';

@Component({
  selector: 'app-item-historik-details-infos',
  templateUrl: './item-historik-details-infos.component.html',
  styleUrls: ['./item-historik-details-infos.component.scss'],
})
export class ItemHistorikDetailsInfosComponent implements OnInit {
  @Input() historikInfos: any;
  @Input() purchaseInfos: PurchaseModel;
  @Input() itemType:string;
  @Input() userProfil:string;
  constructor() { }

  ngOnInit() {}

  formatVolumeData(volume: string) {
    return volume.substring(0, volume.indexOf(',') + 3);
  }

}
