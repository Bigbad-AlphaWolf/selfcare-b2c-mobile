import { Pipe, PipeTransform } from '@angular/core';
import { PassVolumeDisplayPipe } from './pass-volume-display.pipe';

@Pipe({
  name: 'formatDataVolume2',
})
export class FormatDataVolume2Pipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    let formattedVolume = '';
    const GO = Math.trunc(value / (1024 * 1024));
    if (GO) formattedVolume += `${GO} Go `;
    const MO = Math.trunc((value - GO * 1024 * 1024) / 1024);
    if (MO) formattedVolume += `${MO} Mo `;
    const KO = Math.trunc(value - GO * 1024 * 1024 - MO * 1024);
    if (KO) formattedVolume += `${KO} Ko `;
    return GO || MO || KO
      ? new PassVolumeDisplayPipe().transform(formattedVolume)
      : '0 Ko';
  }
}
