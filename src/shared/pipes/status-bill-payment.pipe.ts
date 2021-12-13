import { Pipe, PipeTransform } from '@angular/core';
import { BILL_STATUS } from 'src/app/models/invoice-orange.model';

@Pipe({
  name: 'statusBillPayment',
})
export class StatusBillPaymentPipe implements PipeTransform {
  transform(status_payment: BILL_STATUS, ...args: unknown[]): unknown {
    switch (status_payment.toLowerCase()) {
      case BILL_STATUS.PAID:
        return 'Paiement effectué';
      case 'unpaid':
        return BILL_STATUS.UNPAID;
      default:
        return 'En cours de traitement …';
    }
  }
}
