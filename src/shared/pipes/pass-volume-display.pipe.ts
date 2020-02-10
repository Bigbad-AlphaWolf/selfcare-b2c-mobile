import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passVolumeDisplay'
})
export class PassVolumeDisplayPipe implements PipeTransform {
  transform(volume: string): any {
    let value = volume;
    if (volume && volume.includes('Go') && volume.includes('Mo')) {
      value = volume.substring(0, volume.indexOf('Mo') + 2);
    }
    return value;
  }
}
