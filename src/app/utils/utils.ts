import { MONTHS } from "./constants";
import { MonthOem } from "../models/month.model";

export function removeObjectField(obj: any, f: string) {
  const { [f]: propValue, ...rest } = obj;
  return rest;
}

export function previousMonths(n: number) {
  let date = new Date();
  let r: MonthOem[] = [];
  for (let i = 0; i < n; i++) {
    date.setMonth(date.getMonth() - 1);
    let m = date.getMonth() + 1;
    r.push({
      position: m < 10 ? '0'+m:m+'',
      code: MONTHS[date.getMonth()].toLowerCase(),
      name: MONTHS[date.getMonth()],
      year: date.getFullYear().toString(),
    });
  }
  return r;
}


