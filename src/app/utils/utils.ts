import { MONTHS, OM_URLS } from './constants';
import { MonthOem } from '../models/month.model';

export function removeObjectField(obj: any, f: string) {
  const { [f]: propValue, ...rest } = obj;
  return rest;
}

export function previousMonths(n: number = 6) {
  let date = new Date();
  let r: MonthOem[] = [];
  for (let i = 0; i < n; i++) {
    date.setMonth(date.getMonth() - 1);
    let m = date.getMonth() + 1;
    r.push({
      position: m < 10 ? '0' + m : m + '',
      code: MONTHS[date.getMonth()].toLowerCase(),
      name: MONTHS[date.getMonth()],
      year: date.getFullYear().toString(),
    });
  }
  return r;
}

export function checkUrlMatchOM(url: string) {
  for (let i = 0; i < OM_URLS.length; i++) {
    if (url.match(OM_URLS[i])) return true;
  }
  return false;
}

export function checkUrlMatch(path: string) {
  const transferHubServices = ['/buy-pass-internet', '/buy-pass-illimix','/buy-credit'];

  for (let i = 0; i < transferHubServices.length; i++) {
    if (path.startsWith(transferHubServices[i])) return true;
  }
  return false;
}
