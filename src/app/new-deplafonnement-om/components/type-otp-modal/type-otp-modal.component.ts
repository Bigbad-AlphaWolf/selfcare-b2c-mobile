import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { OmCheckOtpModel } from 'src/app/models/om-self-operation-otp.model';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';

@Component({
  selector: 'app-type-otp-modal',
  templateUrl: './type-otp-modal.component.html',
  styleUrls: ['./type-otp-modal.component.scss'],
})
export class TypeOtpModalComponent implements OnInit, AfterViewInit {
  currentInput = 1;
  @ViewChild('input') input: IonInput;
  @Input() checkOtpPayload: OmCheckOtpModel;
  checkingOtp: boolean;
  errorCheckOtp: boolean;
  errorMsg: string;

  constructor(private orangeMoneyService: OrangeMoneyService, private modal: ModalController) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.setFocus();
    }, 500);
  }

  checkOtp() {
    this.checkingOtp = true;
    this.errorCheckOtp = false;
    const otp = this.input.value;
    this.orangeMoneyService
      .checkSelfOperationOtp(this.checkOtpPayload, otp)
      .subscribe(
        (res) => {
          this.checkingOtp = false;
          this.modal.dismiss({accept: true});
        },
        (err) => {
          this.errorCheckOtp = true;
          this.checkingOtp = false;
          this.errorMsg =
            err && err.message ? err.message : 'Une erreur est survenue';
        }
      );
  }
}
