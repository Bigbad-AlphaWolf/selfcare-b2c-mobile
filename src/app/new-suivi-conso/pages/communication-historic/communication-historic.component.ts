import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { FormatSecondDatePipe } from 'src/shared/pipes/format-second-date.pipe';
import { displayDate } from '../../new-suivi-conso.utils';
const LOCAL_MSISDN_PREFIX = '22119';
const LOCAL_FIX_NUMBER_PREFIX = '221';
const LOCAL_NUMERO_VERT_PREFIX = '800';
const SPECIFIC_LOCAL_NUMBERS = ['17', '18', '1413', '1441'];
const FILTER_CATEGORY_ALL = 'Tous';
@Component({
  selector: 'app-communication-historic',
  templateUrl: './communication-historic.component.html',
  styleUrls: ['./communication-historic.component.scss'],
})
export class CommunicationHistoricComponent implements OnInit {
  loadingComHistoric: boolean;
  hasError: boolean;
  emptyHistoric: boolean;
  comHistoric: any[];
  formatSecondDatePipe = new FormatSecondDatePipe();
  selectedFilter = FILTER_CATEGORY_ALL;
  dateFilters = [
    { label: '2 jours', value: 2 },
    { label: '3 jours', value: 3 },
    { label: '5 jours', value: 5 },
    { label: '7 jours', value: 7 },
  ];
  selectedDateFilter = this.dateFilters[0];
  filteredHistoric;
  filters = [FILTER_CATEGORY_ALL];

  constructor(
    private dashboardService: DashboardService,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.getPrepaidUserHistory();
  }

  filterByDate(dateFilter) {
    this.selectedDateFilter = dateFilter;
    this.oemLoggingService.registerEvent('conso_communications_filter', [
      { dataName: 'date', dataValue: dateFilter?.label },
    ]);
    this.getPrepaidUserHistory();
  }

  getTransactionByType(filterType: string) {
    this.selectedFilter = filterType;
    this.oemLoggingService.registerEvent('conso_communications_filter', [
      { dataName: 'type', dataValue: filterType },
    ]);
    this.filteredHistoric = JSON.parse(JSON.stringify(this.comHistoric));
    if (this.selectedFilter === FILTER_CATEGORY_ALL) {
      return;
    }
    this.filteredHistoric = this.filteredHistoric.filter((item) =>
      item?.value.map((x) => x.chargeType1).includes(this.selectedFilter)
    );
    this.filteredHistoric.forEach((element) => {
      element.value = element.value.filter(
        (x) => x.chargeType1 === this.selectedFilter
      );
    });
  }

  public getPrepaidUserHistory(event?) {
    this.loadingComHistoric = true;
    this.hasError = false;
    this.emptyHistoric = false;
    this.dashboardService.getUserConso(this.selectedDateFilter.value).subscribe(
      (res: any) => {
        this.emptyHistoric = !res?.length;
        this.filters = Array.from(new Set(res.map((x) => x.chargeType1)));
        this.filters.splice(0, 0, FILTER_CATEGORY_ALL);
        this.comHistoric = this.processCommunications(res);
        this.filteredHistoric = this.comHistoric.slice(0);
        this.loadingComHistoric = false;
        event ? event.target.complete() : '';
      },
      () => {
        this.hasError = true;
        event ? event.target.complete() : '';
        this.loadingComHistoric = false;
      }
    );
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

  isInternationalNumber(msisdn: string) {
    return (
      !msisdn.startsWith(LOCAL_FIX_NUMBER_PREFIX) &&
      !msisdn.startsWith(LOCAL_NUMERO_VERT_PREFIX) &&
      !SPECIFIC_LOCAL_NUMBERS.includes(msisdn)
    );
  }

  getCommunicationType(item) {
    switch (item?.categorie) {
      case 'APPEL':
        return this.isInternationalNumber(item?.calledNumber)
          ? {
              label: 'Appel international',
              icon: '/assets/images/ic-africa.svg',
            }
          : { label: 'Appel local', icon: '/assets/images/ic-call.svg' };
      case 'SMS':
        return { label: 'SMS', icon: '/assets/images/ic-sms-message.svg' };
    }
  }

  formatCalledMsisdn(msisdn: string) {
    switch (true) {
      case msisdn.startsWith(LOCAL_MSISDN_PREFIX):
        return msisdn.substring(6);
      case msisdn.startsWith(LOCAL_FIX_NUMBER_PREFIX):
        return msisdn.substring(3);
      default:
        return msisdn;
    }
  }

  formatPrice(itemCom) {
    const counterName: string = itemCom?.chargeType1;
    switch (true) {
      case counterName.includes('Minutes'):
      case counterName.includes('illiflex Voix'):
      case counterName.includes('Durée offerte'):
        return this.formatSecondDatePipe.transform(
          itemCom?.duration.toString()
        );
      case counterName.includes('SMS to Reseaux Fees'):
      case counterName.includes('illiflex SMS fee'):
        return itemCom?.charge1;
      default:
        return `${itemCom?.charge1} FCFA`;
    }
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
}
