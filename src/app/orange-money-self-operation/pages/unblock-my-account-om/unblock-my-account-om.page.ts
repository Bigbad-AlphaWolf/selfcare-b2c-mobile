import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChallengeAnswersOMOEM, ValidateChallengeOMOEM } from 'src/app/models/challenge-answers-om-oem.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { getPageHeader } from 'src/app/utils/title.util';
import { OPERATION_RESET_PIN_OM } from 'src/shared';
import {ModalForUnblockAccountOmComponent} from '../../components/modal-for-unblock-account-om/modal-for-unblock-account-om.component';

export enum ChoiceType {
	FIRSTNAME = 'prenom',
	LASTNAME = 'nom',
	BIRTHDATE = 'date_naissance',
	CNI = 'cni'
}
@Component({
  selector: 'app-unblock-my-account-om',
  templateUrl: './unblock-my-account-om.page.html',
  styleUrls: ['./unblock-my-account-om.page.scss']
})
export class UnblockMyAccountOmPage implements OnInit {
  listItem = [
    {
      label: 'Nom',
      value: null,
			valueIndex: null,
      code: 'nom',
			listChoices: []
    },
    {
      label: 'Prénom',
      value: null,
			valueIndex: null,
      code: 'prenom',
			listChoices: []
    },
    {
      label: 'Date de naissance',
      value: null,
			valueIndex: null,
      code: 'date_naissance',
			listChoices: []
    },
    {
      label: "Numéro Pièce d'identité",
      value: null,
			valueIndex: null,
      code: 'cni',
			listChoices: []
    }
  ];
  isLoading: boolean;
  isLoadingChallenge: boolean;
	isformInvalid: boolean = true;
	errorLoadingChallengeMsg: string;
	omMsisdn: string;
	getMsisdnHasError: boolean;
	gettingOmNumber: boolean;
	type: string;
	title: string;
	subtitle: string;
	isElligible: boolean;
  constructor(private navController: NavController, private modalController: ModalController, private omService: OrangeMoneyService, private dashbServ: DashboardService, private followAnalyticsServ: FollowAnalyticsService, protected activatedRoute: ActivatedRoute, private appRouting: ApplicationRoutingService) {}

  ngOnInit() {
		this.activatedRoute.data.subscribe(data => {
      this.type = data.type;
			const textTitles = getPageHeader(this.type);
			this.title = textTitles.title;
			this.subtitle = textTitles.subTtile;
			console.log('data', data);
			this.getOmMsisdnAndFetchChallenge().subscribe();

    });
	}

	getPageTitle(operationType: string) {
    return getPageHeader(operationType).title;
  }

  goBack() {
    this.navController.pop();
  }

  async presentModal(typeInfos: 'conditions' | 'nom' | 'prenom' | 'date_naissance' | 'cni', listChoices?: string[], defaultIndexForModal?: number) {
    const modal = await this.modalController.create({
      component: ModalForUnblockAccountOmComponent,
      componentProps: {
        typeInfos,
				listChoices,
				selectedIndex: defaultIndexForModal
      },
      backdropDismiss: false,
      cssClass: 'select-recipient-modal'
    });
    modal.onDidDismiss().then((res: any) => {
			if(res?.data) {
				this.setValue(typeInfos, res?.data[typeInfos.toLowerCase()]);
			}
    });
    return await modal.present();
  }

  setValue(typeInfos:  'nom' | 'prenom' | 'date_naissance' | 'cni' | 'conditions', valueIndex: any) {
    this.listItem.forEach((res: {label: string;valueIndex: number; value: string; code: string, listChoices: string[]}) => {
      if (res.code.toLowerCase() === typeInfos.toLowerCase()) {
        res.value = res.listChoices[valueIndex];
				res.valueIndex = valueIndex;

      }
    });
		const nullItemValue: {label: string, value: string, code: string} = this.listItem.find((res: {label: string, value: string, code: string, listChoices: string[]}) => !res.value );
		this.isformInvalid = nullItemValue?.value === null ? !!!nullItemValue?.value : false;
  }

  process() {
		const data = this.getPayloadForValidation();

		this.errorLoadingChallengeMsg = null
		this.isLoading = true;
		this.omService.validateOMChallengeForUnlockAndResetOMAccount(this.omMsisdn, this.type, data).subscribe(
			(_) => {
				this.isLoading = false;
				if(this.type === OPERATION_RESET_PIN_OM) {
					this.goToResetPinOM()
				} else {
					this.showModal({purchaseType: this.type, textMsg: 'Votre compte Orange Money a été débloqué. Veuillez réessayer plus tard'});
				}
			},

			(_) => {
				this.isLoading = false;
				this.errorLoadingChallengeMsg = "Une erreur est survenue durant la validation. Veuillez réessayer plus tard"
			}
		)
	}

	async showModal(data: {purchaseType: string; textMsg: string}) {
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'failed-modal',
      componentProps: data,
      backdropDismiss: false
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }


	async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {
        this.getOmMsisdnAndFetchChallenge().subscribe();
      } else {
        this.navController.pop();
      }
    });
    return await modal.present();
  }

	getOmMsisdnAndFetchChallenge() {
    this.getMsisdnHasError = false;
    this.gettingOmNumber = true;
    return this.omService.getOmMsisdn().pipe(
      tap((msisdn: string) => {
        this.gettingOmNumber = false;
        if (msisdn.match('error')) {
          //this.openPinpad();
          this.omMsisdn = this.dashbServ.getCurrentPhoneNumber();
          this.getMsisdnHasError = true;
          this.followAnalyticsServ.registerEventFollow(
            'deblocage_reset_pin_om_recuperation_numéro_msisdn_failed',
            'error',
            {
              userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
              error: 'no om number registered',
            }
          );
        } else {
          this.omMsisdn = msisdn;
          this.followAnalyticsServ.registerEventFollow(
            'deblocage_reset_pin_om_recuperation_numéro_msisdn_success',
            'event',
            {
              userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
              omMsisdn: this.omMsisdn,
            }
          );
        }
				this.fetchOMChallenge();
      }),
      catchError((err: any) => {
        this.getMsisdnHasError = true;
        this.followAnalyticsServ.registerEventFollow(
          'deblocage_reset_pin_om_recuperation_numéro_msisdn_failed',
          'error',
          {
            userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
            error: err,
          }
        );
        return of(err);
      })
    );
  }

	fetchOMChallenge() {
	this.isLoadingChallenge = true;
		this.errorLoadingChallengeMsg = null;
		this.isElligible = false;
		this.omService.fetchOMChallengeForUnlockAndReset(this.omMsisdn).pipe(
			tap((res: ChallengeAnswersOMOEM) => {
				this.isLoadingChallenge = false;
				if(res.barred && res.eligible || this.type === OPERATION_RESET_PIN_OM && res.eligible) {
					this.isElligible = true;
					this.setListChoices(res.prenoms, ChoiceType.FIRSTNAME);
					this.setListChoices(res.noms, ChoiceType.LASTNAME);
					this.setListChoices(res.cnis, ChoiceType.CNI);
					this.setListChoices(res.datesNaissance, ChoiceType.BIRTHDATE);

				} else {
					this.isElligible = false;
					this.errorLoadingChallengeMsg = "Vous n'êtes éligible au service déblocage de compte OM"
				}
			}),
			catchError((err) => {
				this.isLoadingChallenge = false;
				this.errorLoadingChallengeMsg = 'Une erreur est survenue. Veuillez réessayer';

				if(err?.error.messageDescriptionList?.length) {
					this.errorLoadingChallengeMsg = err?.error?.messageDescriptionList.join(' .');
				} else {
					this.errorLoadingChallengeMsg = err?.error?.message;
				}
				return of(err)
			} )
		).subscribe();
	}

	setListChoices(data: string[], typeChoice: 'nom' | 'prenom' | 'date_naissance' | 'cni'){
		const index = this.listItem.findIndex((item) => item.code.toLowerCase() === typeChoice.toLowerCase());
		this.listItem[index].listChoices = data;
	}

	getValueByCode(code: string) {
		return this.listItem.find((item) =>	item.code === code )
	}

	getPayloadForValidation(){
		const payload: ValidateChallengeOMOEM = {
			index_cni: this.getValueByCode('cni')?.valueIndex,
			index_date_naissance: this.getValueByCode('date_naissance')?.valueIndex,
			index_nom: this.getValueByCode('nom')?.valueIndex,
			index_prenom: this.getValueByCode('prenom')?.valueIndex,
			msisdn: this.omMsisdn
		}
		return payload;
	}


	goToResetPinOM() {
    this.appRouting.goToCreatePinOM(OPERATION_RESET_PIN_OM, { msisdn: this.omMsisdn });
  }

}
