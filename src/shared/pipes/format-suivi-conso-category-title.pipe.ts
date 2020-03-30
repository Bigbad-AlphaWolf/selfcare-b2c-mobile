import { Pipe, PipeTransform } from '@angular/core';
import { SMS_LABEL_CATEGORY, CREDIT_APPEL_CATEGORY, INTERNET_LABEL_CATEGORY } from '..';

@Pipe({
  name: 'formatSuiviConsoCategoryTitle'
})
export class FormatSuiviConsoCategoryTitlePipe implements PipeTransform {

  transform(consoType: any, args?: any): any {
    switch (consoType) {
      case "APPEL":
        return CREDIT_APPEL_CATEGORY;
        break;
      case "SMS":
        return SMS_LABEL_CATEGORY;
        break;
      case "INTERNET":
        return INTERNET_LABEL_CATEGORY;
        break;
      default:
        return ""
        break;
    };
  }

}
