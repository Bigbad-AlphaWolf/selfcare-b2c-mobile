import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('fr');

export const displayDate = (date) => {
  const todayDate = new Date();
  let yesterdayDate = new Date();
  yesterdayDate.setDate(todayDate.getDate() - 1);
  const today = datePipe.transform(todayDate, 'shortDate');
  const yesterday = datePipe.transform(yesterdayDate, 'shortDate');
  switch (true) {
    case date === today:
      return `Aujourd'hui`;
    case date === yesterday:
      return `Hier`;
    default:
      const formattedDate = date.split('/');
      return datePipe.transform(
        new Date(
          formattedDate[1] + '/' + formattedDate[0] + '/' + formattedDate[2]
        ),
        'fullDate'
      );
  }
};
