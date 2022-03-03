import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberDisplay',
})
export class PhoneNumberDisplayPipe implements PipeTransform {
  transform(phoneNumber: string, args?: any): any {
    let result = phoneNumber;
    if (phoneNumber) {
      if (phoneNumber.length === 9) {
        result =
          phoneNumber.slice(0, 2) +
          ' ' +
          phoneNumber.slice(2, 5) +
          ' ' +
          phoneNumber.slice(5, 7) +
          ' ' +
          phoneNumber.slice(7, 9);
      } else {
        result = phoneNumber.match(/.{1,2}/g).join(' ');
      }
    }
    return result;
  }
}
