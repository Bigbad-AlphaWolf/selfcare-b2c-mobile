import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InvoiceOrange } from 'src/app/models/invoice-orange.model';

@Component({
  selector: 'app-unpaid-bill-modal',
  templateUrl: './unpaid-bill-modal.component.html',
  styleUrls: ['./unpaid-bill-modal.component.scss'],
})
export class UnpaidBillModalComponent implements OnInit {
  @Input() unpaidBills: InvoiceOrange[];
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  pay() {
    this.modalController.dismiss('pay');
  }
}
