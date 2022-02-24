import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TRANSFER_OM_INTERNATIONAL_COUNTRIES } from 'src/app/utils/constants';

@Component({
  selector: 'app-select-country-modal',
  templateUrl: './select-country-modal.component.html',
  styleUrls: ['./select-country-modal.component.scss'],
})
export class SelectCountryModalComponent implements OnInit {
  countries = TRANSFER_OM_INTERNATIONAL_COUNTRIES;
  @Input() country;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  selectCountry(country) {
    this.country = country;
  }

  closeModal() {
    this.modalController.dismiss(this.country);
  }
}
