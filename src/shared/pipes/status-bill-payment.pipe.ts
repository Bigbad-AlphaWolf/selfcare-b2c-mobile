import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'statusBillPayment'
})
export class StatusBillPaymentPipe implements PipeTransform {
  transform(status_payment: 'paid' | 'unpaid' | 'initialized', ...args: unknown[]): unknown {
    switch (status_payment.toLowerCase()) {
      case 'paid':
        return 'Payée';
      case 'unpaid':
        return 'Payer la facture';
      default:
        return 'Paiement en cours de traitement';
    }
  }
}
