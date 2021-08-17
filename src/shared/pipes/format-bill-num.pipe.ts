import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatBillNum'
})
export class FormatBillNumPipe implements PipeTransform {
  transform(billNumero: any, args?: any): any {
    const regexNumber = /\d{9}/;
    billNumero = billNumero ? billNumero.replace(regexNumber, '') : '';
    return billNumero;
  }
}
