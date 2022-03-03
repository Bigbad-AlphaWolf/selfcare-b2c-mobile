import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { UNKNOWN_ECHEANCE } from '..';

@Pipe({
  name: 'formatBillDate',
})
export class FormatBillDatePipe implements PipeTransform {
  transform(billDate: string, args?: any): any {
    if (billDate === UNKNOWN_ECHEANCE) {
      return UNKNOWN_ECHEANCE;
    }
    const format = 'dd/MM/yyyy';
    const locale = 'fr-FR';
    if (billDate) {
      billDate = formatDate(billDate, format, locale);
      return billDate;
    }
  }
}
