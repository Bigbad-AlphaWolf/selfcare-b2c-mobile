import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  isFixPostpaid,
  PROFILE_TYPE_HYBRID,
  PROFILE_TYPE_HYBRID_2,
  PROFILE_TYPE_POSTPAID,
} from 'src/app/dashboard';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import {
  OPERATION_TYPE_PAY_BILL,
  OPERATION_TYPE_TERANGA_BILL,
} from 'src/app/utils/operations.constants';
import { previousMonths } from 'src/app/utils/utils';
import {
  OPERATION_SUGGEST_RATTACH_NUMBER,
  REGEX_FIX_NUMBER,
  REGEX_NUMBER_OM,
  SubscriptionModel,
} from 'src/shared';
import { YesNoModalComponent } from 'src/shared/yes-no-modal/yes-no-modal.component';
import { LinesComponent } from '../lines/lines.component';

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
  selectedOption = { label: 'ligne fixe', value: 'FIXE' };
  step: 'SET_LIGNE_TYPE' | 'TYPE_NUMBER' = 'TYPE_NUMBER';
  hasError: boolean;
  errorMessage: string;
  @Input() operation;
  OPERATION_TYPE_TERANGA_BILL = OPERATION_TYPE_TERANGA_BILL;
  OPERATION_TYPE_PAY_BILL = OPERATION_TYPE_PAY_BILL;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private modalController: ModalController,
    private billsService: BillsService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit() {
    this.checkBillPaymentType();
  }

  checkBillPaymentType() {
    if (this.operation === OPERATION_TYPE_TERANGA_BILL) {
      this.selectedOption = this.options[0];
    } else if (this.operation === OPERATION_TYPE_PAY_BILL) {
      this.selectedOption = this.options[1];
    }
    this.step = 'TYPE_NUMBER';
    this.form = this.fb.group({
      number: ['', [Validators.required]],
    });
  }

  selectOption(option) {
    this.selectedOption = option;
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
          switchMap((sub: SubscriptionModel) => {
            if (this.selectedOption.value === "FIXE") {
              return of(sub);
            } else {
              // if the numero is mobile, we should get all his bills and check if there is at least one bill with amount > 150.000 FCFA
              const { clientCode } = sub;
              return from(
                this.billsService.moisDisponible(clientCode, "MOBILE", numero)
              ).pipe(
                switchMap((moisDispo) => {
                  const months = previousMonths(moisDispo);
                  const month = months[0];
                  return this.billsService
                    .invoices(clientCode, "MOBILE", numero, month)
                    .pipe(
                      switchMap(res => {
                        return this.billsService.getBillAmountLimit().pipe(
                          switchMap((amountLimit) => {
                            const hasBillMoreThan150K = res.find(
                              (bill) => bill.montantFacture >= amountLimit
                            );
                            if (hasBillMoreThan150K) {
                              return this.dashboardService.attachedNumbers().pipe(
                                map((numbers: any[]) => {
                                  const isRattached = numbers.map(el => el.msisdn).includes(numero);
                                  if (isRattached) {
                                    this.modalController.dismiss();
                                    this.router.navigate(["/bills"], {
                                      state: {
                                        inputPhone: numero,
                                        clientCode,
                                      },
                                    });
                                  } else {
                                    this.modalController.dismiss();
                                    this.suggestAttachement(numero);
                                  }
                                  return numbers
                                })
                              )
                            } else {
                              return of(sub)
                            }
                          })
                        )
                      })
                    );
                })
              );
            }
          }),
          tap((res: SubscriptionModel) => {
            this.checking = false;
            const clientCode = res.clientCode;
            if (
              (this.selectedOption.value === 'MOBILE' &&
                (res?.profil === PROFILE_TYPE_POSTPAID ||
                  res?.profil === PROFILE_TYPE_HYBRID ||
                  res?.profil === PROFILE_TYPE_HYBRID_2)) ||
              (this.selectedOption.value === 'FIXE' &&
                isFixPostpaid(res.nomOffre))
            ) {
              this.modalController.dismiss();
              this.router.navigate(['/bills'], {
                state: {
                  ligne: numero,
                  type: this.selectedOption.value,
                  clientCode,
                  operationType: this.operation
                },
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
      this.checking = false;
    }
  }

  async openLinesModal(event: MouseEvent) {
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: LinesComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        phoneType: this.selectedOption.value === 'FIXE' ? 'FIXE' : 'MOBILE',
      },
    });
    modal.onDidDismiss().then((response) => {
      console.log(response);
      if (response?.data?.phone) {
        this.form.patchValue({ number: response.data?.phone });
        this.checkNumero();
        // this.modalController.dismiss();
        // this.router.navigate(['/bills'], {
        //   state: {
        //     inputPhone: response.data?.phone,
        //     clientCode: response.data?.codeClient,
        //     operationType: this.operation
        //   },
        // });
      }
    });
    return await modal.present();
  }

  async suggestAttachement(msisdn) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        typeModal: OPERATION_SUGGEST_RATTACH_NUMBER,
        numero: msisdn,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response?.data?.continue) {
        this.router.navigate(['rattached-phones-number'], {
          state: { numberToRegister: msisdn },
        })
      }
    })
    return await modal.present();
  }

}
