import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { ModalController, NavController } from '@ionic/angular';

@Component( {
	selector: 'banniere-description',
	templateUrl: './banniere-description.page.html',
	styleUrls: ['./banniere-description.page.scss'],
} )
export class BanniereDescriptionPage implements OnInit {
	static ROUTE_PATH: string = '/banniere-description'
	@Input() banniere: BannierePubModel;
	constructor( public banniereService: BanniereService, private modController: ModalController ) { }

	ngOnInit() {

	}

	openUrl() {
		let url = this.banniere.action.url;
		if ( !url ) return;
		window.open( url );
	}

	quit() {
		this.modController.dismiss();
	}

}
