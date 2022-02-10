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
  @Input() typeInfos: 'CONDITIONS' | 'LASTNAME' | 'FIRSTNAME' | 'BIRTHDATE' | 'CNI';
  titles = {
    CONDITIONS: 'Conditions de déblocage',
    FIRSTNAME: 'Choix du nom',
    LASTNAME: 'Choix du prénom',
    BIRTHDATE: 'Choix de la date de naissance',
    CNI: 'Choix du numéro de CNI'
  };
  listChoices: {label: string; choices: string[]} = null;
  form: FormGroup = new FormGroup({});
  constructor(private modalCtrl: ModalController, private omService: OrangeMoneyService, private fb: FormBuilder) {}

  ngOnInit() {
    this.omService.getUnblockOMAccountChoices(this.typeInfos).subscribe((res: {label: string; choices: string[]}) => {
      this.listChoices = res;
      if (this.listChoices?.choices?.length)
        this.form.addControl(this.listChoices.label, new FormControl(this.listChoices.choices[0], Validators.required));
    });
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  process() {
    this.modalCtrl.dismiss(this.form.value);
  }
}
