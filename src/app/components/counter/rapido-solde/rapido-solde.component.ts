import { Component, OnInit, Input } from '@angular/core';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { RapidoService } from 'src/app/services/rapido/rapido.service';
import { tap, catchError } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { BillAmountPage } from 'src/app/pages/bill-amount/bill-amount.page';
import { OPERATION_RAPIDO } from 'src/app/utils/operations.constants';

@Component({
	selector: 'app-rapido-solde',
	templateUrl: './rapido-solde.component.html',
	styleUrls: ['./rapido-solde.component.scss'],
})
export class RapidoSoldeComponent implements OnInit {
	@Input() counter: { name: string; counterNumber: string };
	@Input() opXtras: OperationExtras;
	infoSolde: string;
	lastSoldeUpdate: string;
	isLoading: boolean;
	constructor(private rapidServ: RapidoService, private navCtl: NavController, private modal: ModalController) {}

	ngOnInit() {
		if (this.counter) this.getSolde(this.counter.counterNumber);
	}

	getSolde(counter: string) {
		this.isLoading = true;
		this.rapidServ
			.getSolde(counter)
			.pipe(
				tap((res: any) => {
					this.isLoading = false;
					const data = res.content.data;
					if (data) {
						this.infoSolde = data.solde;
						this.lastSoldeUpdate = data.date_solde;
					}
				}),
				catchError((err: any) => {
					this.isLoading = false;
					return err;
				})
			)
			.subscribe();
	}

	onRecharge() {
		const routePath = BillAmountPage.ROUTE_PATH;
		this.opXtras.purchaseType = OPERATION_RAPIDO;
		this.opXtras.billData ? (this.opXtras.billData.counter = this.counter) : '';
		this.modal.dismiss();
		this.navCtl.navigateForward([routePath], {
			state: this.opXtras,
		});
	}
}
