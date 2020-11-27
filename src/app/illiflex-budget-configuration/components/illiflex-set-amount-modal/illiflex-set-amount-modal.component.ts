import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-illiflex-set-amount-modal',
  templateUrl: './illiflex-set-amount-modal.component.html',
  styleUrls: ['./illiflex-set-amount-modal.component.scss'],
})
export class IlliflexSetAmountModalComponent implements OnInit {
  amountForm: FormGroup;
  hasError: boolean;
  error: string;
  rapidChoices = [500, 1000, 2000, 2500, 5000, 7500];
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.amountForm = this.fb.group({
      amount: [null, [Validators.required]],
    });
  }

  setAmount(amount) {
    this.hasError = false;
    if (amount < 500) {
      this.hasError = true;
      this.error = 'Le montant saisi doit être supérieur à 500 F CFA';
    } else if (amount > 15000) {
      this.hasError = true;
      this.error = 'Le montant saisi doit être inférieur à 15000 F CFA';
    } else {
      this.modalController.dismiss(amount);
    }
  }
}
