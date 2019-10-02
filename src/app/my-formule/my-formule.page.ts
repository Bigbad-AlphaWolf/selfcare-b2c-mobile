import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { CODE_KIRENE_Formule, FormuleMobileModel } from 'src/shared';
import { FormuleService } from '../services/formule-service/formule.service';
import { SubscriptionModel } from '../dashboard';

@Component({
	selector: 'app-my-formule',
	templateUrl: './my-formule.page.html',
	styleUrls: ['./my-formule.page.scss']
})
export class MyFormulePage implements OnInit {
	currentFormule;
	otherFormules;
	error;
	formulesArray = [];
	callCategoryList;
	smsCategoryList;
	dataLoaded = false;
	step = 'MA_FORMULE';
	detailsFormule: FormuleMobileModel;
	currentNumber: string;

	images = [
		{
			codeFormule: '9133',
			icon: '/assets/images/4-2-g.png',
			banner: '/assets/images/background-header-jamono-max.jpg'
		},
		{
			codeFormule: '9131',
			icon: '/assets/images/4-g.png',
			banner: '/assets/images/background-header-jamono-new-scool.jpg'
		},
		{
			codeFormule: '9132',
			icon: '/assets/images/4-g.png',
			banner: '/assets/images/background-header-jamono-allo.jpg'
		}
	];
	scr;
	constructor(
		private router: Router,
		private formuleService: FormuleService,
		private authServ: AuthenticationService,
		private dashbdServ: DashboardService
	) {}

	ngOnInit() {
		this.currentNumber = this.dashbdServ.getCurrentPhoneNumber();
		this.processInfosFormules();
	}

	processInfosFormules() {
		this.authServ.getSubscription(this.currentNumber).subscribe(
			(res: SubscriptionModel) => {
				// FollowAnalytics.logEvent('MaFormule_sidemenu', 'Opened');
				this.formuleService.getformules(res.profil).subscribe(
					(resp: FormuleMobileModel[]) => {
						this.formulesArray = resp;
						if (this.formulesArray.length === 0) {
							this.dataLoaded = true;
							this.error = 'Problème de chargement';
						} else {
							this.getCurrentAndOthersFormules();
						}
					},
					(error: any) => {
						this.dataLoaded = true;
						// call log service
						this.error = 'erreur lors du chargement';
					}
				);
			},
			err => {
				this.dataLoaded = true;
				this.error = 'erreur lors du chargement';
			}
		);
	}

	getCurrentAndOthersFormules() {
		this.dataLoaded = false;
		this.error = null;
		this.authServ.getSubscription(this.currentNumber).subscribe(
			(resp: SubscriptionModel) => {
				this.dataLoaded = true;
				this.currentFormule = this.formulesArray.find((formule: FormuleMobileModel) => {
					return formule.code === resp.code;
				});
				if (this.currentFormule) {
					if (this.currentFormule.code !== this.getKireneFormule()) {
						this.otherFormules = this.formulesArray.filter((formule: FormuleMobileModel) => {
							return formule.code !== this.currentFormule.code && formule.code !== this.getKireneFormule();
						});
					}
				} else {
					this.error = "Erreur, Votre formule n'est peut etre pas encore prise en compte ";
				}
				this.dataLoaded = true;
			},
			(err: any) => {
				this.dataLoaded = true;
				this.error = "Erreur, Votre formule n'est peut etre pas encore prise en compte ";
			}
		);
	}
	getCategoryList(currentFormuleArray, category: string) {
		return currentFormuleArray.filter(item => {
			return item.categorie === category;
		});
	}
	getKireneFormule() {
		return CODE_KIRENE_Formule;
	}
	getImgByFormule(formule: FormuleMobileModel) {
		const img = this.images.find(image => {
			return image.codeFormule === formule.code;
		});
		return img.icon ? img.icon : '/assets/images/4-2-g.png';
	}

	getBannerByFormule(formule: FormuleMobileModel) {
		let img;
		if (formule && formule.code) {
			img = this.images.find(element => {
				return element.codeFormule === formule.code;
			});
		}
		return img && img.banner ? img.banner : '/assets/images/background-header-jamono-allo.jpg';
	}

	seeDetailsFormule(formule: FormuleMobileModel) {
		this.detailsFormule = formule;
		this.step = 'DETAILS_FORMULE';
	}

	goBack() {
		if (this.step === 'MA_FORMULE') {
			this.router.navigate(['/dashboard']);
		} else {
			this.step = 'MA_FORMULE';
		}
	}

	getNewFormuleInfos() {
		this.getCurrentAndOthersFormules();
		this.goBack();
	}
}
