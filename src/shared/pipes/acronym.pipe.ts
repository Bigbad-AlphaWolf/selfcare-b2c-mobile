import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronym',
})
export class AcronymPipe implements PipeTransform {
  transform(value: string, args?: any): any {
    if (value) {
      return value.substring(0,1).toUpperCase();
    }
    return '';
  }
}
