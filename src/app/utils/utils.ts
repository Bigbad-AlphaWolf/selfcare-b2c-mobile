import { MONTHS, NO_TOKEN_URLS, OM_URLS } from './constants';
import { MonthOem } from '../models/month.model';
import { REGEX_FIX_NUMBER } from 'src/shared';
import {
  isPostpaidFix,
  isPostpaidMobile,
  ModelOfSouscription,
} from '../dashboard';

export function removeObjectField(obj: any, f: string) {
  const { [f]: propValue, ...rest } = obj;
  return rest;
}

export function previousMonths(moisDispo: string, n: number = 6) {
  let date = new Date();
  date.setMonth(date.getMonth() - 1);
  if (moisDispo) {
    let moisItems: string[] = moisDispo.split('-');
    date = new Date(parseInt(moisItems[0]), parseInt(moisItems[1]) - 1, 1);
  }
  let r: MonthOem[] = [];
  for (let i = 0; i < n; i++) {
    let m = date.getMonth();
    let p = m + 1;

    r.push({
      position: p < 10 ? '0' + p : p + '',
      code: MONTHS[m].toLowerCase(),
      name: MONTHS[m],
      year: date.getFullYear().toString(),
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

export function isLineNumber(phone: string, souscription: ModelOfSouscription) {
  return (
    (REGEX_FIX_NUMBER.test(phone) && isPostpaidFix(souscription)) ||
    (!REGEX_FIX_NUMBER.test(phone) && isPostpaidMobile(souscription))
  );
}

export function checkUrlMatch(path: string) {
  const transferHubServices = [
    '/buy-pass-internet',
    '/buy-pass-illimix',
    '/buy-credit',
  ];

  for (let i = 0; i < transferHubServices.length; i++) {
    if (path.startsWith(transferHubServices[i])) return true;
  }
  return false;
}
