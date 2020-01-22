import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'formatBillDate'
})
export class FormatBillDatePipe implements PipeTransform {
  transform(billDate: string, args?: any): any {
      const format = 'dd/MM/yyyy';
      const locale = 'fr-FR';
      if (billDate) {
          billDate = formatDate(billDate, format, locale);
          console.log(billDate);
          return billDate;
      }
  }
}
