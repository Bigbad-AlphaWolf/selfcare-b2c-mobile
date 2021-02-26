import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PalierModel } from 'src/app/models/palier.model';
const BASE_MULTIPLE = 50;
@Component({
  selector: 'app-illiflex-set-amount-modal',
  templateUrl: './illiflex-set-amount-modal.component.html',
  styleUrls: ['./illiflex-set-amount-modal.component.scss'],
})
export class IlliflexSetAmountModalComponent implements OnInit {
  amountForm: FormGroup;
  hasError: boolean;
  error: string;
  rapidChoices = [500, 1300, 2200];
  aroundInf: number;
  aroundSup: number;
  isAmountValid: boolean;
  amount: number;
  @Input() pricings: PalierModel[] = [];
  minAmountIlliflex: number = 500;
  maxAmountIlliflex: number = 15000;
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initForm();
    this.getMinAndMax();
  }

  getMinAndMax() {
    if (!this.pricings && !this.pricings.length) return;
    const maxArray = this.pricings.map((pricing) => pricing.maxPalier);
    this.maxAmountIlliflex = Math.max(...maxArray);
    const minArray = this.pricings.map((pricing) => pricing.minPalier);
    this.minAmountIlliflex = Math.min(...minArray);
  }

  chooseAmount(amount) {
    this.amount = amount;
    this.onAmountChanged(amount);
  }

  onAmountChanged(amount) {
    this.amount = +amount;
    this.isAmountValid =
      this.amount >= this.minAmountIlliflex &&
      this.amount <= this.maxAmountIlliflex &&
      this.amount % BASE_MULTIPLE === 0
        ? true
        : false;
    this.aroundInf = Math.trunc(this.amount / BASE_MULTIPLE) * BASE_MULTIPLE;
    this.aroundSup = Math.ceil(this.amount / BASE_MULTIPLE) * BASE_MULTIPLE;
  }

  initForm() {
    this.amountForm = this.fb.group(
      {
        amount: ['', [Validators.required, this.validateAmount()]],
      },
      { updateOn: 'change' }
    );
  }

  validateAmount(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log(+control.value);
      const amount = +control.value;
      return amount % BASE_MULTIPLE === 0 &&
        amount <= this.maxAmountIlliflex &&
        amount >= this.minAmountIlliflex
        ? null
        : { wrong: true };
    };
  }

  getValidity(amount) {
    if (!this.pricings.length) return;
    const currentPalier = this.pricings.find(
      (palier) => amount >= palier.minPalier && amount <= palier.maxPalier
    );
    const validity = currentPalier.validite;
    switch (validity) {
      case 'Jour':
        return '24 heures';
      case 'Semaine':
        return '7 jours';
      case 'Mois':
        return '30 jours';
    }
  }

  setAmount(amount) {
    this.hasError = false;
    if (amount < this.minAmountIlliflex) {
      this.hasError = true;
      this.error = `Le montant saisi doit être supérieur à ${this.minAmountIlliflex} F CFA`;
    } else if (amount > this.maxAmountIlliflex) {
      this.hasError = true;
      this.error = `Le montant saisi doit être inférieur à ${this.minAmountIlliflex} F CFA`;
    } else {
      this.modalController.dismiss(amount);
    }
  }
}
