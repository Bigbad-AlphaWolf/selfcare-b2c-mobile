import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RapidoSelectionComponent } from 'src/app/components/counter/rapido-selection/rapido-selection.component';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { OPERATION_RAPIDO } from 'src/app/utils/operations.constants';
import { BillAmountPage } from '../bill-amount/bill-amount.page';

@Component({
  selector: 'app-rapid-operation',
  templateUrl: './rapid-operation.page.html',
  styleUrls: ['./rapid-operation.page.scss'],
})
export class RapidOperationPage implements OnInit {
  static ROUTE_PATH = '/rapid-operation';
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

  }
  onOpRecharge(){
    this.bsService.openModal(RapidoSelectionComponent);
  }

  goBack(){
    this.navCtrl.pop();
  }
}
