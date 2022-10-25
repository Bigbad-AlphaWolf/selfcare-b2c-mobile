import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDuration2',
})
export class FormatDuration2Pipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    let formattedDuration = '';
    const HOUR = Math.trunc(value / 3600);
    if (HOUR) formattedDuration += `${HOUR} h `;
    const MIN = Math.trunc((value - HOUR * 3600) / 60);
    if (MIN) formattedDuration += `${MIN} min `;
    const SEC = value - MIN * 60 - HOUR * 3600;
    if (SEC) formattedDuration += `${SEC} s`;

    return HOUR || MIN || SEC ? formattedDuration : '0 s';
  }
}
