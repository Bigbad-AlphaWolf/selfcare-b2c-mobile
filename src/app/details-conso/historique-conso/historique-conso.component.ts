import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { USER_CONS_CATEGORY_CALL } from 'src/app/dashboard';

@Component({
  selector: 'app-historique-conso',
  templateUrl: './historique-conso.component.html',
  styleUrls: ['./historique-conso.component.scss']
})
export class HistoriqueConsoComponent implements OnInit {
  @Input() chargeTypes;
  @Input() dateFilterItems = [];
  @Input() consoshistorique;
  @Input() chargeType;
  @Input() selectedDate;
  @Input() dataLoaded;
  @Input() error;
  @Input() notdata;
  @Output() getConsoByDay = new EventEmitter<number>();
  @Output() selectedFilterButton = new EventEmitter();
  currentProfil;

  constructor(
    private authService: AuthenticationService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    this.authService.getSubscription(msisdn).subscribe((res: any) => {
      this.currentProfil = res.profil;
    });
  }

  getConso(day) {
    this.getConsoByDay.emit(day);
  }

  selectedButton(chargeType) {
    window.scroll(0, 0);
    this.selectedFilterButton.emit(chargeType);
  }

  formatPhoneNumber(formatPhoneNumber: string) {
    if (
      formatPhoneNumber.startsWith('221') ||
      formatPhoneNumber.startsWith('00221') ||
      formatPhoneNumber.startsWith('+221') ||
      (formatPhoneNumber.startsWith('07') || formatPhoneNumber.startsWith('03'))
    ) {
      return formatPhoneNumber.substring(formatPhoneNumber.length - 9);
    }
    return formatPhoneNumber;
  }
  getUserConsCategoryCall() {
    return USER_CONS_CATEGORY_CALL;
  }

  formatVolumeData(volume: string) {
    return volume.substring(0, volume.indexOf(',') + 3);
  }
}
