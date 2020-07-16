import { Pipe, PipeTransform } from '@angular/core';
import { REGEX_FIX_NUMBER, REGEX_NUMBER } from '..';

@Pipe({
  name: 'getLabelLigneBillBordereau'
})
export class GetLabelLigneBillBordereauPipe implements PipeTransform {
  transform(value: string, args?: any): any {
    return REGEX_FIX_NUMBER.test(value) ? 'Ligne Fixe' : REGEX_NUMBER.test(value)?'Ligne Mobile': value.startsWith('SMM')?'Internet':'TV Orange';
  }
}
