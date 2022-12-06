import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CreateRequestOem } from 'src/app/models/create-request-oem.model';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';
import { OPERATION_CREATE_REQUEST_DEMANDE_TICKET, REGEX_NUMBER_OM } from 'src/shared';

function msisdnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const isNumberValide = REGEX_NUMBER_OM.test(value);

    return !isNumberValide ? { invalid: true } : null;
  };
}

@Component({
  selector: 'app-create-request-or-trouble-ticket',
  templateUrl: './create-request-or-trouble-ticket.page.html',
  styleUrls: ['./create-request-or-trouble-ticket.page.scss'],
})
export class CreateRequestOrTroubleTicketPage implements OnInit {
  pageTitle = 'Signaler un dérangement/réclamations';
  listMotifs: string[] = [
    'Déplafonnement de compte Orange Money',
    'Ouverture de compte Orange Money',
    'Correction erreur de transaction Orange Money',
    'Contestation de facture',
    'Dérangement ADSL',
    'Dérangement Fibre',
    'Désactivation de services',
    'Configuration 3G/4G',
    'Duplicata factures',
    'Souci couverture réseau',
    'Réclamation sur le crédit',
    'Activation services',
    'SAV (Service après-vente)',
  ];
  requestForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.email]],
    msisdn: [null, { validators: [Validators.required, msisdnValidator()], updateOn: 'blur' }],
    type: [null, [Validators.required]],
    num_fix: [null, [Validators.required]],
    motif: [null, [Validators.required]],
    message: [null, [Validators.required]],
  });
  hasError: boolean;
  errorMsg: string;
  isProcessing: boolean;
  listFixNumbers: string[] = [];
  constructor(private formBuilder: FormBuilder, private dashbService: DashboardService, private requestService: RequestOemService, private modalController: ModalController) {}

  ngOnInit() {
    this.fetchFixNumbers();
    this.setMainNumberAsDefault();
  }

  processForm() {
    this.isProcessing = true;
    this.hasError = false;
    const payload: CreateRequestOem = this.requestForm.value;
    this.requestService.createRequestOrDerangement(payload).subscribe(
      res => {
        this.isProcessing = false;
        this.showModalSuccess({ purchaseType: OPERATION_CREATE_REQUEST_DEMANDE_TICKET, textMsg: `Votre ${payload.type.toLowerCase()} a bien été soumis(e) au service client` });
      },
      err => {
        this.isProcessing = false;
        this.hasError = true;
      }
    );
  }

  fetchFixNumbers() {
    this.dashbService.fetchFixedNumbers().subscribe(res => {
      this.listFixNumbers = res;
      this.requestForm.patchValue({
        num_fix: res[0],
      });
    });
  }

  setMainNumberAsDefault() {
    this.requestForm.patchValue({
      msisdn: this.dashbService.getMainPhoneNumber(),
    });
  }

  async showModalSuccess(data: { purchaseType: string; textMsg: string }) {
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'failed-modal',
      componentProps: data,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }
}
