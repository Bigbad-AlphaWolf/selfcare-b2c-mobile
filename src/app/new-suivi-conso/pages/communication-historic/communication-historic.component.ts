import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FormatSecondDatePipe } from 'src/shared/pipes/format-second-date.pipe';
import { displayDate } from '../../new-suivi-conso.utils';
const LOCAL_MSISDN_PREFIX = '22119';
const LOCAL_FIX_NUMBER_PREFIX = '221';
const LOCAL_NUMERO_VERT_PREFIX = '800';
const SPECIFIC_LOCAL_NUMBERS = ['17', '18', '1413', '1441'];
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.getPrepaidUserHistory();
  }

  public getPrepaidUserHistory() {
    this.loadingComHistoric = true;
    this.hasError = false;
    this.emptyHistoric = false;
    this.dashboardService.getUserConso(100).subscribe(
      (res: any) => {
        this.emptyHistoric = !res?.length;
        this.comHistoric = this.processCommunications(res);
        this.loadingComHistoric = false;
      },
      () => {
        this.hasError = true;
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
}
