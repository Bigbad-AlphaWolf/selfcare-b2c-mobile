import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'illiflexVoice',
})
export class IlliflexVoicePipe implements PipeTransform {
  transform(voice: number, args?: any): any {
    const roundedMinuts = Math.round(voice);
    if (roundedMinuts < 60) {
      return `${roundedMinuts} Min`;
    } else {
      const minuts = roundedMinuts % 60;
      return `${Math.floor(roundedMinuts / 60)} H ${
        minuts ? minuts + ' M' : ``
      }`;
    }
  }
}
