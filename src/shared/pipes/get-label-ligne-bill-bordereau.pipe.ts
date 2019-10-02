import { Pipe, PipeTransform } from '@angular/core';
import { REGEX_FIX_NUMBER } from '..';

@Pipe({
  name: 'getLabelLigneBillBordereau'
})
export class GetLabelLigneBillBordereauPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return REGEX_FIX_NUMBER.test(value) ? 'Fixe' : 'Internet';
  }
}
