import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSecondDate'
})
export class FormatSecondDatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    value = +value;
    let formatedTime = '';
    if (value >= 3600) {
      const h: number = Math.trunc(value / 3600);
      value = value % 3600;
      formatedTime += `${h} h`;
    }

    if (value >= 60) {
      const m: number = Math.trunc(value / 60);
      value = value % 60;
      formatedTime += ` ${m} min`;
    }

    if (value < 60) {
      formatedTime += ` ${value} s`;
    }

    return formatedTime;
  }
}
