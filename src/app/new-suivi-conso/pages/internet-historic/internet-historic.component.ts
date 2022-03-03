import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserConsoService } from 'src/app/services/user-cunsommation-service/user-conso.service';
import { LIST_ICON_PURCHASE_HISTORIK_ITEMS } from 'src/shared';
import { displayDate } from '../../new-suivi-conso.utils';
const FILTER_CATEGORY_ALL = 'Tous';

@Component({
  selector: 'app-internet-historic',
  templateUrl: './internet-historic.component.html',
  styleUrls: ['./internet-historic.component.scss'],
})
export class InternetHistoricComponent implements OnInit {
  loadingComHistoric: boolean;
  hasError: boolean;
  emptyHistoric: boolean;
  comHistoric: any[];
  // formatSecondDatePipe = new FormatSecondDatePipe();
  selectedFilter = FILTER_CATEGORY_ALL;
  dateFilters = [
    { label: '2 jours', value: 1 },
    { label: '3 jours', value: 2 },
    { label: '5 jours', value: 4 },
    { label: '7 jours', value: 6 },
  ];
  selectedDateFilter = this.dateFilters[0];
  filteredHistoric;
  filters = [FILTER_CATEGORY_ALL];
  constructor(private userConsoService: UserConsoService) {}

  ngOnInit() {
    this.getConsoData();
  }

  getConsoData(event?) {
    this.loadingComHistoric = true;
    this.hasError = false;
    this.emptyHistoric = false;
    this.selectedFilter = FILTER_CATEGORY_ALL;
    this.userConsoService
      .getUserDataConsumation(this.selectedDateFilter.value)
      .pipe(
        tap((res) => {
          this.emptyHistoric = !res?.length;
          this.filters = Array.from(new Set(res.map((x) => x.chargeType)));
          this.filters.splice(0, 0, FILTER_CATEGORY_ALL);
          this.comHistoric = this.processCommunications(res);
          this.filteredHistoric = this.comHistoric.slice(0);
          this.loadingComHistoric = false;
          event ? event.target.complete() : '';
        }),
        catchError((err) => {
          this.hasError = true;
          event ? event.target.complete() : '';
          this.loadingComHistoric = false;
          return throwError(err);
        })
      )
      .subscribe();
  }

  processCommunications(historicArray: any[]) {
    const groups = historicArray.reduce((groupedHistoric, comItem) => {
      const date = comItem.date.substring(0, 10);
      if (!groupedHistoric[date]) {
        groupedHistoric[date] = [];
      }
      groupedHistoric[date].push(comItem);
      return groupedHistoric;
    }, {});
    console.log(groups);
    let response = [];
    for (let key in groups) {
      response.push({ key: key, value: groups[key] });
    }
    return response;
  }

  filterByDate(dateFilter) {
    this.selectedDateFilter = dateFilter;
    this.getConsoData();
  }

  getConsoByCounter(filterType: string) {
    this.selectedFilter = filterType;
    this.filteredHistoric = JSON.parse(JSON.stringify(this.comHistoric));
    if (this.selectedFilter === FILTER_CATEGORY_ALL) {
      return;
    }
    this.filteredHistoric = this.filteredHistoric.filter((item) =>
      item?.value.map((x) => x.chargeType).includes(this.selectedFilter)
    );
    this.filteredHistoric.forEach((element) => {
      element.value = element.value.filter(
        (x) => x.chargeType === this.selectedFilter
      );
    });
  }

  displayDate(date: string) {
    const formattedDate = date.split(' ')[0];
    return displayDate(formattedDate);
  }

  displayFilterName(filter: string) {
    switch (filter) {
      case 'illiflex Voix fee':
        return 'Minutes illiflex';
      case 'Bonus Tous Reseaux Fee':
        return 'Bonus Tous Réseaux';
      case 'illiflex SMS fee':
        return 'SMS illiflex';
      default:
        return filter;
    }
  }

  getCounterIcon(counterName) {
    switch (counterName) {
      case 'illiflex Data':
        return LIST_ICON_PURCHASE_HISTORIK_ITEMS['PASS_INTERNET'];
      default:
        return '/assets/images/ic-internet-usage.png';
    }
  }
}
