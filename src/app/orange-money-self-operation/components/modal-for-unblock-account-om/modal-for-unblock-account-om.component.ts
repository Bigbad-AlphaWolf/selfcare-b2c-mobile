import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';

@Component({
  selector: 'app-modal-for-unblock-account-om',
  templateUrl: './modal-for-unblock-account-om.component.html',
  styleUrls: ['./modal-for-unblock-account-om.component.scss']
})
export class ModalForUnblockAccountOmComponent implements OnInit {
  @Input() typeInfos: 'conditions' | 'nom' | 'prenom' | 'date_naissance' | 'cni';
  @Input() listChoices: string[];
	@Input() selectedIndex: number = 0;
  titles = {
    CONDITIONS: 'Conditions de déblocage',
    FIRSTNAME: 'Choix du nom',
    LASTNAME: 'Choix du prénom',
    BIRTHDATE: 'Choix de la date de naissance',
    CNI: 'Choix du numéro de CNI'
  };
  form: FormGroup = new FormGroup({});
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
		if (this.listChoices?.length)
			this.form.addControl(this.typeInfos, new FormControl(this.selectedIndex === null ? 0 : this.selectedIndex, Validators.required));
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  process() {
    this.modalCtrl.dismiss(this.form.value);
  }
}
