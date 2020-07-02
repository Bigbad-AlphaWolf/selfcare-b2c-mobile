import { Component, OnInit, Input } from '@angular/core';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { BsBillsHubService } from 'src/app/services/bottom-sheet/bs-bills-hub.service';
import { NavController } from '@ionic/angular';
import { OperationOem } from 'src/app/models/operation.model';
import { WOYOFAL } from 'src/app/utils/bills.util';
import { IMAGES_DIR_PATH } from 'src/app/utils/constants';
import { CounterSelectionComponent } from '../counter/counter-selection/counter-selection.component';

@Component({
  selector: 'oem-operations',
  templateUrl: './oem-operations.component.html',
  styleUrls: ['./oem-operations.component.scss'],
})
export class OemOperationsComponent implements OnInit {
  @Input('operations') operations: OperationOem[] = [];
  @Input('showMore') showMore : boolean = true;

  constructor(
    private bsService: BottomSheetService,
    private bsBillService: BsBillsHubService,
    private navCtl : NavController
  ) { }

  ngOnInit() {}

  onOperation(op: OperationOem) {
    if(op.type === 'NAVIGATE') this.navCtl.navigateForward([op.action]);
    if(this.bsService[op.action]){
      this.bsService[op.action](...op.params);
      return;
    }

    if(this.bsBillService[op.action]){
      this.bsBillService.opXtras.billData = {
        company: {
          name: "Woyofal",
          code: WOYOFAL,
          logo: `${IMAGES_DIR_PATH}/woyofal@3x.png`,
        },
      };
      this.bsBillService.initBs(CounterSelectionComponent).subscribe((_) => {});
      this.bsBillService.openBSCounterSelection(CounterSelectionComponent);
      return;
    }
  }
}
