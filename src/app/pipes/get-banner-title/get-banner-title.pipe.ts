import { Pipe, PipeTransform } from '@angular/core';
import { getBanniereDescription } from 'src/shared';

@Pipe({
  name: 'getBannerTitle',
})
export class GetBannerTitlePipe implements PipeTransform {
  transform(description: string, ...args: unknown[]): unknown {
    return getBanniereDescription(description);
  }
}
