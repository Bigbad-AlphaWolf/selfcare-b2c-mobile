import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { PurchaseModel, LIST_ICON_PURCHASE_HISTORIK_ITEMS } from 'src/shared';

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
  mainUser: string
  constructor(private dashbServ: DashboardService) {
    this.mainUser = this.dashbServ.getMainPhoneNumber();
   }

  ngOnInit() {}

  formatVolumeData(volume: string) {
    return volume.substring(0, volume.indexOf(',') + 3);
  }

  getPurchaseItemIcon(item: PurchaseModel){
    const typeAchat = item.typeAchat;
    return LIST_ICON_PURCHASE_HISTORIK_ITEMS[typeAchat];    
  }

  isSargalTransaction(purchase: PurchaseModel): boolean {
    return purchase.typeAchat === "SARGAL";
  }

}
