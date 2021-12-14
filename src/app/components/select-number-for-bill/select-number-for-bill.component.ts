import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isFixPostpaid, POSTPAID_TERANGA_OFFERS_ID } from 'src/app/dashboard';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import {
  REGEX_FIX_NUMBER,
  REGEX_NUMBER_OM,
  SubscriptionModel,
} from 'src/shared';

@Component({
  selector: 'app-select-number-for-bill',
  templateUrl: './select-number-for-bill.component.html',
  styleUrls: ['./select-number-for-bill.component.scss'],
})
export class SelectNumberForBillComponent implements OnInit {
  form: FormGroup;
  phoneNumber: string = null;
  checking: boolean;
  options = [
    { label: 'ligne mobile', value: 'MOBILE' },
    { label: 'ligne fixe', value: 'FIXE' },
  ];
  selectedOption;
  step: 'SET_LIGNE_TYPE' | 'TYPE_NUMBER' = 'SET_LIGNE_TYPE';
  hasError: boolean;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  selectOption(option) {
    this.selectedOption = option;
  }

  goStepTypeNumber() {
    this.step = 'TYPE_NUMBER';
    this.form = this.fb.group({
      number: ['', [Validators.required]],
    });
  }

  checkNumero() {
    this.hasError = false;
    this.checking = true;
    const numero = this.form?.value?.number;
    if (
      (this.selectedOption.value === 'FIXE' && REGEX_FIX_NUMBER.test(numero)) ||
      (this.selectedOption.value === 'MOBILE' && REGEX_NUMBER_OM.test(numero))
    ) {
      this.authService
        .getSubscriptionForTiers(numero)
        .pipe(
          tap((res: SubscriptionModel) => {
            this.checking = false;
            if (
              (this.selectedOption.value === 'MOBILE' &&
                POSTPAID_TERANGA_OFFERS_ID.includes(res.code)) ||
              (this.selectedOption.value === 'FIXE' &&
                isFixPostpaid(res.nomOffre))
            ) {
              this.modalController.dismiss();
              this.router.navigate(['/bills'], {
                state: { ligne: numero, type: this.selectedOption.value },
              });
            } else {
              this.hasError = true;
              this.errorMessage = `Vous ne pouvez pas payer de facture pour ce numéro`;
            }
          }),
          catchError((err) => {
            this.checking = false;
            return throwError(err);
          })
        )
        .subscribe();
    } else {
      this.hasError = true;
      this.errorMessage = `Le numéro saisi n'est pas une ligne ${
        this.selectedOption.value === 'FIXE' ? 'fixe' : 'mobile'
      } valide`;
    }
  }
}
