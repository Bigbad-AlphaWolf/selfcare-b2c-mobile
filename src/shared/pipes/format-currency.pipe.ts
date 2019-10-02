import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    }
    return '0';
  }
}
