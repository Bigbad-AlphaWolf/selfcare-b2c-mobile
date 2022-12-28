import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-my-fixe-numbers',
  templateUrl: './my-fixe-numbers.component.html',
  styleUrls: ['./my-fixe-numbers.component.scss'],
})
export class MyFixeNumbersComponent {
  @Input() list: string[] = [];
  constructor(private popOverCtl: PopoverController) {}

  select(item: string) {
    this.popOverCtl.dismiss({
      selectedNumber: item,
    });
  }
}
