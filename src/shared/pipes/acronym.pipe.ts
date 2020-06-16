import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronym',
})
export class AcronymPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const matches = value.match(/\b(\w)/g);
    const acronym = matches.join('');
    return acronym;
  }
}
