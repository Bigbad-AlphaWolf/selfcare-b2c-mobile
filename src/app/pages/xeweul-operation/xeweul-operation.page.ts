import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {XeweulSelectionComponent} from 'src/app/components/counter/xeweul-selection/xeweul-selection.component';
import {BottomSheetService} from 'src/app/services/bottom-sheet/bottom-sheet.service';
import {OPERATION_RAPIDO, OPERATION_XEWEUL} from 'src/app/utils/operations.constants';
import {BillAmountPage} from '../bill-amount/bill-amount.page';
import {OPERATION_SEE_SOLDE_XEWEUL} from 'src/shared';

@Component({
  selector: 'app-xeweul-operation',
  templateUrl: './xeweul-operation.page.html',
  styleUrls: ['./xeweul-operation.page.scss']
})
export class XeweulOperationPage implements OnInit {
  static ROUTE_PATH = '/xeweul-operation';

  constructor(private bsService: BottomSheetService, private navCtrl: NavController) {}

  ngOnInit() {
    this.bsService.initBsModal(XeweulSelectionComponent, OPERATION_XEWEUL, BillAmountPage.ROUTE_PATH).subscribe(_ => {});
  }

  onOpSolde() {
    this.bsService.openModal(XeweulSelectionComponent, {operation: OPERATION_SEE_SOLDE_XEWEUL});
  }

  onOpRecharge() {
    this.bsService.openModal(XeweulSelectionComponent, {operation: OPERATION_XEWEUL});
  }

  goBack() {
    this.navCtrl.pop();
  }
}
