import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-type-otp-modal',
  templateUrl: './type-otp-modal.component.html',
  styleUrls: ['./type-otp-modal.component.scss'],
})
export class TypeOtpModalComponent implements OnInit, AfterViewInit {
  currentInput = 1;
  @ViewChild('input') input: IonInput;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.setFocus();
    }, 500);
  }
}
