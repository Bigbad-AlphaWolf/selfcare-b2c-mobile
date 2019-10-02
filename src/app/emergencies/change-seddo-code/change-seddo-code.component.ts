import { Component, OnInit } from '@angular/core';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { EmergencyService } from 'src/app/services/emergency-service/emergency.service';
import { MatDialog } from '@angular/material';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-change-seddo-code',
  templateUrl: './change-seddo-code.component.html',
  styleUrls: ['./change-seddo-code.component.scss']
})
export class ChangeSeddoCodeComponent implements OnInit {
  form: FormGroup;
  numbers;
  errorMsg = '';
  loading;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private emergencyService: EmergencyService,
    private dialog: MatDialog,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {
    this.getAllNumbers();
    this.form = this.fb.group({
      phoneNumber: [this.numbers[0], []],
      actualCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/\d/g),
          Validators.minLength(4),
          Validators.maxLength(4)
        ]
      ],
      newCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/\d/g),
          Validators.minLength(4),
          Validators.maxLength(4)
        ]
      ],
      confirmNewCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/\d/g),
          Validators.minLength(4),
          Validators.maxLength(4)
        ]
      ]
    });
  }

  getAllNumbers() {
    const mainNumber = this.authServ.getUserMainPhoneNumber();
    this.numbers = [];
    this.numbers.push(mainNumber);
    this.dashboardService.getAttachedNumbers().subscribe((res: any[]) => {
      res.forEach(number => {
        this.numbers.push(number.msisdn);
      });
    });
  }

  openSuccessDialog(type: string) {
    this.dialog.open(ModalSuccessComponent, {
      data: { type }
    });
  }

  onSubmit() {
    this.loading = true;
    const newPin = this.form.value.newCode;
    const confirmPin = this.form.value.confirmNewCode;
    const pin = this.form.value.actualCode;
    const msisdn = this.form.value.phoneNumber;
    this.errorMsg = '';
    if (newPin === confirmPin && newPin !== '0000' && newPin !== '1234') {
      const changePinPayload = { msisdn, pin, newPin };
      this.emergencyService.changePinSeddo(changePinPayload).subscribe(
        (res: any) => {
          this.loading = false;
          if (res.status === '200') {
            this.openSuccessDialog('seddoCode');
          } else {
            this.errorMsg = res.message;
          }
        },
        (err: any) => {
          this.loading = false;
          this.errorMsg = 'Erreur';
        }
      );
    } else if (newPin === '0000' || newPin === '1234') {
      this.loading = false;
      this.errorMsg = 'Le code saisi doit être different de 0000 ou 1234.';
    } else {
      this.loading = false;
      this.errorMsg = 'Les 2 codes saisis ne sont pas identiques.';
    }
  }
}
