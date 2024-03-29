import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EmergencyService } from 'src/app/services/emergency-service/emergency.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { NumeroSeriePopupComponent } from '../numero-serie-popup/numero-serie-popup.component';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

@Component({
  selector: 'app-recharge-card-number',
  templateUrl: './recharge-card-number.component.html',
  styleUrls: ['./recharge-card-number.component.scss'],
})
export class RechargeCardNumberComponent implements OnInit {
  form: FormGroup;
  errorNumSerie = '';
  errorFiveConsecutiveNumbers = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private emergencyService: EmergencyService,
    private autheServ: AuthenticationService,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      numSerie: ['', [Validators.required, Validators.pattern(/\d/), Validators.minLength(15), Validators.maxLength(15)]],
      fiveConsecutiveNumbers: ['', [Validators.required, Validators.pattern(/\d/), Validators.minLength(5), Validators.maxLength(5)]],
    });
  }

  getMoreInfos(type: string) {
    this.form.reset();
    this.dialog.open(NumeroSeriePopupComponent, {
      data: type,
    });
  }

  getCodeCarte() {
    this.errorNumSerie = '';
    this.errorFiveConsecutiveNumbers = '';
    this.loading = true;
    const msisdn = this.autheServ.getUserMainPhoneNumber();
    const sNumeroSerie = this.form.value.numSerie;
    const consecutive = this.form.value.fiveConsecutiveNumbers;
    const carteInfos = { msisdn, sNumeroSerie, consecutive };
    this.emergencyService.getCodeCarteRecharge(carteInfos).subscribe(
      res => {
        this.loading = false;
        if (res === 'consecutif') {
          this.errorFiveConsecutiveNumbers = 'Les 5 chiffres consécutifs saisis sont incorrects';
          this.oemLoggingService.registerEvent('Code_Carte_Recharge_Error', convertObjectToLoggingPayload({ error: this.errorFiveConsecutiveNumbers }));
        } else if (res === 'NumeroSerie') {
          this.errorNumSerie = 'Le numéro de série saisi est incorrect';
          this.oemLoggingService.registerEvent('Code_Carte_Recharge_Error', convertObjectToLoggingPayload({ error: this.errorNumSerie }));
        } else if (res === 'OK') {
          this.openSuccessDialog('carte');
          this.oemLoggingService.registerEvent('Code_Carte_Recharge_Success', convertObjectToLoggingPayload({ msisdn: msisdn }));
        } else {
          this.errorFiveConsecutiveNumbers = 'Ce service est momentanément indisponible.';
          this.oemLoggingService.registerEvent('Code_Carte_Recharge_Error', convertObjectToLoggingPayload({ error: this.errorFiveConsecutiveNumbers }));
        }
      },
      err => {
        this.loading = false;
        this.errorFiveConsecutiveNumbers = 'Ce service est momentanément indisponible.';
      }
    );
  }

  openSuccessDialog(type: string) {
    this.dialog.open(ModalSuccessComponent, {
      data: { type },
    });
  }
}
