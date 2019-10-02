import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { OPERATION_TYPE_RECHARGE_CREDIT, GiftSargalItem } from '..';
import { SoSModel } from 'src/app/services/sos-service';

@Component({
	selector: 'app-operation-success-fail',
	templateUrl: './operation-success-fail.component.html',
	styleUrls: ['./operation-success-fail.component.scss']
})
export class OperationSuccessFailComponent implements OnInit {
	@Input() failed;
	@Input() passInternetBought: any;
	@Input() sosSelected: SoSModel;
	@Input() type;
	@Input() errorMsg;
	@Input() recipient;
	@Input() amount;
	@Output() returnInitialStep = new EventEmitter();
	@Input() giftSargal: GiftSargalItem;

	OPERATION_TYPE_RECHARGE_CREDIT = OPERATION_TYPE_RECHARGE_CREDIT;

	constructor(private router: Router) {}

	ngOnInit() {}

	goToDashboardPage() {
		this.router.navigate(['/dashboard']);
	}
	goToBuyPassPage() {
		if (this.failed) {
			this.router.navigate(['/buy-credit']);
		} else {
			this.returnInitialStep.emit();
		}
	}
}
