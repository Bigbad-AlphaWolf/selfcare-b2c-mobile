import { Pipe, PipeTransform } from '@angular/core';
import { getBanniereTitle } from 'src/shared';

@Pipe({
  name: 'getBannerDescription',
})
export class GetBannerDescriptionPipe implements PipeTransform {
  transform(description: string, ...args: unknown[]): unknown {
    return getBanniereTitle(description);
  }
}
