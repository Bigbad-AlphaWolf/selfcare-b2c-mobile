import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { SubscriptionModel } from '..';

@Component({
  selector: 'app-infos-ligne-fixe',
  templateUrl: './infos-ligne-fixe.component.html',
  styleUrls: ['./infos-ligne-fixe.component.scss'],
})
export class InfosLigneFixeComponent implements OnInit {
	isNumberActivated: boolean;
	@Input() ligneNumber: string
	@Input() customerOfferInfos: SubscriptionModel;
	@Input() showClose: boolean;
	isLoading: boolean;
  constructor(private dashbordServ: DashboardService, private modCtl: ModalController) { }

  ngOnInit() {
		this.fetchInfosStatusLigne();
	}

	close() {
		this.modCtl.dismiss();
	}

	fetchInfosStatusLigne() {
		this.isLoading = true;
		this.dashbordServ
      .getFixPostpaidInfos(this.ligneNumber)
      .pipe(
        tap((status: string) => {
					this.isLoading = false;
          if (status === 'ACTIVATED') {
            this.isNumberActivated = true;
          }
        }),
				catchError((err) => {
					this.isLoading = false;
					return throwError(err);
				})
      )
      .subscribe();
	}

}
