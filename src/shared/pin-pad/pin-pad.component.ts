import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pin-pad',
  templateUrl: './pin-pad.component.html',
  styleUrls: ['./pin-pad.component.scss']
})
export class PinPadComponent implements OnInit {
  @Output() pin = new EventEmitter();
  @Input() infosText: string;
  @Input() errorMsg: string;
  @Input() hasError: boolean;
  @Input() desktopPinPad = false;
  @Input() loading;
  @Input() notOrangeMoney;
  @Input() recurrentOperation;

  randomDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '0', ' '];
  codePin = [];
  digitPadIsActive = true;

  constructor(private omService: OrangeMoneyService, private router: Router) {}

  ngOnInit() {
    if (!this.notOrangeMoney) {
      this.omService.gotPinPadSubject.subscribe(value => {
        if (value) {
          this.randomDigits = value;
          this.omService.randomPinPadDigits = value;
          this.generateRandomDigitPad();
        }
      });
    }
  }

  generateRandomDigitPad() {
    this.resetPad();
    this.enableDigitPad();
  }

  private resetPad() {
    this.codePin = [];
  }

  type(digit: string) {
    if (this.digitPadIsActive) {
      if (this.codePin.length < 4 && digit !== ' ') {
        this.codePin.push(digit);
        if (this.codePin.length === 4) {
          const pin = this.codePin.join('');
          this.pin.emit(pin);
          if (!this.notOrangeMoney) {
            this.disableDigitPad();
          } else {
            this.resetPad();
          }
        }
      }
    }
  }
  delete() {
    this.codePin.pop();
  }

  private disableDigitPad() {
    this.digitPadIsActive = false;
  }
  private enableDigitPad() {
    this.digitPadIsActive = true;
  }

  goBackHome() {
    this.router.navigate(['/dashboard']);
  }
}
