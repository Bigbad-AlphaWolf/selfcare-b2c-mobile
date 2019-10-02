import { Component, OnInit } from '@angular/core';
import { CancelOperationPopupComponent } from 'src/shared/cancel-operation-popup/cancel-operation-popup.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

@Component({
	selector: 'app-sargal-registration',
	templateUrl: './sargal-registration.page.html',
	styleUrls: ['./sargal-registration.page.scss']
})
export class SargalRegistrationPage implements OnInit {
	confirmDialog: MatDialogRef<CancelOperationPopupComponent>;
	mainPhoneNumber: string;
	isProcessing: boolean;
	hasError: boolean;
	constructor(
		private router: Router,
		private matDialog: MatDialog,
		private sargalServ: SargalService,
		private dashbServ: DashboardService
	) {}
	ngOnInit() {
		this.mainPhoneNumber = this.dashbServ.getMainPhoneNumber();
	}

	goBack() {
		this.router.navigate(['/dashboard']);
	}

	goToRegisterSargal() {
		this.confirmDialog = this.matDialog.open(CancelOperationPopupComponent, {
			data: { cancelDialogRegister: true },
			maxWidth: '92%'
		});
		this.confirmDialog.afterClosed().subscribe((status: any) => {
			if (status) {
				this.isProcessing = true;
				this.hasError = false;
				this.sargalServ.registerToSargal(this.mainPhoneNumber).subscribe(
					(res: any) => {
						this.isProcessing = false;
						this.goBack();
					},
					(err: any) => {
						this.isProcessing = false;
						this.hasError = true;
					}
				);
			}
		});
	}
}
