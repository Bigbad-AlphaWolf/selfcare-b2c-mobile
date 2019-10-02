import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SoSModel } from 'src/app/services/sos-service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { SosService } from 'src/app/services/sos-service/sos.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
	selector: 'app-sos-list',
	templateUrl: './sos-list.component.html',
	styleUrls: ['./sos-list.component.scss']
})
export class SosListComponent implements OnInit {
	@Output() chooseSos = new EventEmitter();

	allSOS: SoSModel[];
	sosShown: SoSModel[];
	filterSelected: string;
	sosFilters: string[];
	currentNumber: string;
	constructor(
		private dashboardService: DashboardService,
		private authServ: AuthenticationService,
		private sosService: SosService
	) {}

	ngOnInit() {
		this.getAllSos();
	}

	getAllSos() {
		this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
		this.authServ.getSubscription(this.currentNumber).subscribe(res => {
			if (res) {
				this.sosService
					.getListSosByFormule(res.code)
					.subscribe((listSos: SoSModel[]) => {
						this.allSOS = listSos;
						this.getOrderedSosFilter();
						this.selectSosFilter(this.sosFilters[0]);
					});
			}
		});
	}

	selectSos(sos: SoSModel) {
		this.chooseSos.emit(sos);
	}

	selectSosFilter(type: string) {
		this.filterSelected = type;
		this.sosShown = this.allSOS.filter((x: SoSModel) => {
			return x.typeSOS.nom === type;
		});
	}

	getOrderedSosFilter() {
		const filters = this.allSOS.map(x => {
			return x.typeSOS;
		});
		filters.sort((elt1: any, elt2: any) => elt1.ordre - elt2.ordre);
		const sosFilters = [...new Set(filters.map(x => x.nom))];
		this.sosFilters = sosFilters;
	}
}
