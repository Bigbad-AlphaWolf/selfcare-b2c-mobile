import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {ModalForUnblockAccountOmComponent} from '../../components/modal-for-unblock-account-om/modal-for-unblock-account-om.component';

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
      code: 'FIRSTNAME'
    },
    {
      label: 'Prénom',
      value: null,
      code: 'LASTNAME'
    },
    {
      label: 'Date de naissance',
      value: null,
      code: 'BIRTHDATE'
    },
    {
      label: "Numéro Pièce d'identité",
      value: null,
      code: 'CNI'
    }
  ];
  isLoading: boolean;
	isformInvalid: boolean = true;
  constructor(private navController: NavController, private modalController: ModalController) {}

  ngOnInit() {}

  goBack() {
    this.navController.pop();
  }

  async presentModal(typeInfos: 'CONDITIONS' | 'LASTNAME' | 'FIRSTNAME' | 'BIRTHDATE' | 'CNI') {
    const modal = await this.modalController.create({
      component: ModalForUnblockAccountOmComponent,
      componentProps: {
        typeInfos
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

  setValue(typeInfos: 'CONDITIONS' | 'LASTNAME' | 'FIRSTNAME' | 'BIRTHDATE' | 'CNI', value: any) {
    this.listItem.forEach((res: {label: string; value: string; code: string}) => {
      if (res.code.toLowerCase() === typeInfos.toLowerCase()) {
        res.value = value;
      }
    });
		const nullItemValue: {label: string, value: string, code: string} = this.listItem.find((res: {label: string, value: string, code: string}) => !res.value );
		this.isformInvalid = nullItemValue?.value === null ? !!!nullItemValue?.value : false;
  }

  process() {}

}
