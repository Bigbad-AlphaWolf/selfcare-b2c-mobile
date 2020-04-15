import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCalledNumber'
})
export class FormatCalledNumberPipe implements PipeTransform {

  transform(numberCalled: any, args?: any): any {
    if (
      numberCalled.startsWith('221') ||
      numberCalled.startsWith('00221') ||
      numberCalled.startsWith('+221') ||
      (numberCalled.startsWith('07') || numberCalled.startsWith('03'))
    ) {
      return numberCalled.substring(numberCalled.length - 9);
    }
    return numberCalled;
  }

}
