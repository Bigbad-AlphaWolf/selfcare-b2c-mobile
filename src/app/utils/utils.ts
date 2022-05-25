import {MONTHS, NO_TOKEN_URLS, OM_URLS, TRANSFER_OM_INTERNATIONAL_COUNTRIES} from './constants';
import {MonthOem} from '../models/month.model';
import {REGEX_FIX_NUMBER, REGEX_NUMBER_OM, SubscriptionModel} from 'src/shared';
import {isPostpaidFix, isPostpaidMobile, ModelOfSouscription} from '../dashboard';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';

export function removeObjectField(obj: any, f: string) {
  const {[f]: propValue, ...rest} = obj;
  return rest;
}

export function previousMonths(moisDispo: number, n: number = 6) {
  let date = new Date();
  const currentMonth = date.getMonth();
  if (moisDispo) {
    moisDispo = moisDispo > currentMonth + 1 ? moisDispo - 12 : moisDispo;
    date.setMonth(moisDispo - 1);
  } else {
    return [];
  }

  let r: MonthOem[] = [];
  for (let i = 0; i < n; i++) {
    let m = date.getMonth();
    let p = m + 1;

    r.push({
      position: p < 10 ? '0' + p : p + '',
      code: MONTHS[m] ? MONTHS[m].toLowerCase() : null,
      name: MONTHS[m],
      year: date.getFullYear().toString()
    });

    date.setMonth(m - 1);
  }
  return r;
}

export function checkUrlMatchOM(url: string) {
  for (let i = 0; i < OM_URLS.length; i++) {
    if (url.match(OM_URLS[i])) return true;
  }
  return false;
}

export function checkUrlNotNeedAuthorization(url: string) {
  for (let i = 0; i < NO_TOKEN_URLS.length; i++) {
    if (url.match(NO_TOKEN_URLS[i])) return true;
  }
  return false;
}

export function isLineNumber(phone: string, souscription: SubscriptionModel) {
  return (
    (REGEX_FIX_NUMBER.test(phone) && isPostpaidFix(souscription)) ||
    (!REGEX_FIX_NUMBER.test(phone) && isPostpaidMobile(souscription))
  );
}

export function checkUrlMatch(path: string) {
  const transferHubServices = ['/buy-pass-internet', '/buy-pass-illimix', '/buy-credit'];

  for (let i = 0; i < transferHubServices.length; i++) {
    if (path.startsWith(transferHubServices[i])) return true;
  }
  return false;
}

export function dateValidatorLessThan(startDate: string, endDate: string) {
  return (group: FormGroup): {[key: string]: any} => {
    const start = new Date(group.controls[startDate].value);
    const end = new Date(group.controls[endDate].value);
    if (start > end) {
      return {
        dates: 'Date startDate should be less than Date endDate'
      };
    }
    return {};
  };
}

export function parseDate(date: string) {
  const pipe = new DatePipe('fr');
  return pipe.transform(date, 'ddMMyyyy');
}

export function getCountryInfos(phoneNumber: string) {
  switch (true) {
    case phoneNumber.startsWith('+221') || phoneNumber.startsWith('00221'):
    case REGEX_NUMBER_OM.test(phoneNumber):
      return TRANSFER_OM_INTERNATIONAL_COUNTRIES[0];
    case phoneNumber.startsWith('+225') || phoneNumber.startsWith('00225'):
      return TRANSFER_OM_INTERNATIONAL_COUNTRIES[1];
    case phoneNumber.startsWith('+226') || phoneNumber.startsWith('00226'):
      return TRANSFER_OM_INTERNATIONAL_COUNTRIES[2];
    case phoneNumber.startsWith('+223') || phoneNumber.startsWith('00223'):
      return TRANSFER_OM_INTERNATIONAL_COUNTRIES[3];
    case phoneNumber.startsWith('+227') || phoneNumber.startsWith('00227'):
      return TRANSFER_OM_INTERNATIONAL_COUNTRIES[4];
    case phoneNumber.startsWith('+245') || phoneNumber.startsWith('00245'):
      return TRANSFER_OM_INTERNATIONAL_COUNTRIES[5];
    default:
      break;
  }
}
