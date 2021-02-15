import { Pipe, PipeTransform } from '@angular/core';
const MINUT = 60;
const HOUR = 60 * MINUT;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

@Pipe({
  name: 'publicationDateFormat',
})
export class PublicationDateFormatPipe implements PipeTransform {
  transform(value: string) {
    const valueDate = Date.parse(value);
    // elapsed time in seconds
    const elapsedTime = (Date.now() - valueDate) / 1000;
    switch (true) {
      case elapsedTime > YEAR:
        const year = Math.trunc(elapsedTime / YEAR);
        return `il y a ${year} ${year > 1 ? 'ans' : 'an'}`;
      case elapsedTime > MONTH:
        const month = Math.trunc(elapsedTime / MONTH);
        return `il y a ${month} mois`;
      case elapsedTime > DAY:
        const day = Math.trunc(elapsedTime / DAY);
        return `il y a ${day} ${day > 1 ? 'jours' : 'jour'}`;
      case elapsedTime > HOUR:
        const hour = Math.trunc(elapsedTime / HOUR);
        return `il y a ${hour} ${hour > 1 ? 'heures' : 'heure'}`;
      case elapsedTime > MINUT:
        const minut = Math.trunc(elapsedTime / MINUT);
        return `il y a ${minut} ${minut > 1 ? 'minutes' : 'minute'}`;
      case elapsedTime > 1:
        const second = elapsedTime;
        return `il y a ${second} ${second > 1 ? 'secondes' : 'seconde'}`;
      default:
        return 'maintenant';
    }
  }
}
