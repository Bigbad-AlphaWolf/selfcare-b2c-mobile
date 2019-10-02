import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatBillDate'
})
export class FormatBillDatePipe implements PipeTransform {
  transform(billDate: string, args?: any): any {
    if (billDate) {
      const timeReg = /\d\d:\d\d:\d\d/;
      billDate = billDate.replace(timeReg, '');
      return billDate;
    }
  }
}
