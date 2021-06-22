import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PalierModel } from 'src/app/models/palier.model';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
const BASE_MULTIPLE = 100;
@Component({
  selector: 'app-illiflex-set-amount-modal',
  templateUrl: './illiflex-set-amount-modal.component.html',
  styleUrls: ['./illiflex-set-amount-modal.component.scss'],
})
export class IlliflexSetAmountModalComponent implements OnInit {
  amountForm: FormGroup;
  hasError: boolean;
  error: string;
  rapidChoices = [600, 2100, 7500];
  aroundInf: number;
  aroundSup: number;
  isAmountValid: boolean;
  amount: number;
  @Input() pricings: PalierModel[] = [];
  minAmountIlliflex: number = 500;
  maxAmountIlliflex: number = 15000;
  @ViewChild('amountInput') input: ElementRef;
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private followAnalyticsServ: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getMinAndMax();
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 300);
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

  setAmount(amount, rapideChoice?: boolean) {
    this.hasError = false;
    this.addFollowEvent(amount, rapideChoice);
    if (amount < this.minAmountIlliflex) {
      this.hasError = true;
      this.error = `Le montant saisi doit être supérieur à ${this.minAmountIlliflex} F CFA`;
    } else if (amount > this.maxAmountIlliflex) {
      this.hasError = true;
      this.error = `Le montant saisi doit être inférieur à ${this.maxAmountIlliflex} F CFA`;
    } else {
      this.modalController.dismiss(amount);
    }
  }

  addFollowEvent(amount: number, rapideChoice?: boolean) {
    const eventIlliflex_clic = `Illiflex_amount_${amount}_${rapideChoice ? 'clic' : 'typed'}`;
    this.followAnalyticsServ.registerEventFollow(eventIlliflex_clic, 'event')
  }
}
