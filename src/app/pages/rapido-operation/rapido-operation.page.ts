import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RapidoSelectionComponent } from 'src/app/components/counter/rapido-selection/rapido-selection.component';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { OPERATION_RAPIDO } from 'src/app/utils/operations.constants';
import { BillAmountPage } from '../bill-amount/bill-amount.page';
import { OPERATION_SEE_SOLDE_RAPIDO } from 'src/shared';

@Component({
  selector: 'app-rapido-operation',
  templateUrl: './rapido-operation.page.html',
  styleUrls: ['./rapido-operation.page.scss'],
})
export class RapidoOperationPage implements OnInit {
  static ROUTE_PATH = '/rapido-operation';
  constructor(private bsService: BottomSheetService, private navCtrl : NavController) { }

  ngOnInit() {
    this.bsService
    .initBsModal(
      RapidoSelectionComponent,
      OPERATION_RAPIDO,
      BillAmountPage.ROUTE_PATH
      
    )
    .subscribe((_) => {});
  }
  onOpSolde(){
    this.bsService.openModal(RapidoSelectionComponent, { operation: OPERATION_SEE_SOLDE_RAPIDO });
  }
  onOpRecharge(){
    this.bsService.openModal(RapidoSelectionComponent, { operation: OPERATION_RAPIDO });
  }

  goBack(){
    this.navCtrl.pop();
  }
}
