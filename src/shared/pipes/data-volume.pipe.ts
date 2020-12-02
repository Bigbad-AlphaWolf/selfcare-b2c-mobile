import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataVolume',
})
export class DataVolumePipe implements PipeTransform {
  transform(value: number, args?: any): any {
    let dataVolume;
    if (value <= 1024) {
      dataVolume = `${Math.round(value)} Mo`;
    } else if (value <= 1024 * 10) {
      dataVolume = `${Math.round((value * 100) / 1024) / 100} Go`;
    } else {
      dataVolume = `${Math.round((value * 10) / 1024) / 10} Go`;
    }
    return dataVolume;
  }
}
