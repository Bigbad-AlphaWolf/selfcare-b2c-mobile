import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone-numbers-list',
  templateUrl: './phone-numbers-list.component.html',
  styleUrls: ['./phone-numbers-list.component.scss'],
})
export class PhoneNumbersListComponent implements OnInit, OnDestroy {
  @Output() phoneNumberChanged = new EventEmitter();
  @Input() phoneNumbers = [];
  lastSelectedNumber: any;
  currentPhoneNumberChangeSub: Subscription;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.lastSelectedNumber = this.dashboardService.getCurrentPhoneNumber();
    this.currentPhoneNumberChangeSub = this.dashboardService.currentPhoneNumberChange.subscribe(
      () => {
        this.router.navigate(['dashboard']);
      }
    );
  }

  updateSelectedPhoneNumbers(phoneNumber: string, selected: boolean) {
    this.lastSelectedNumber = phoneNumber;
    this.phoneNumberChanged.emit(this.lastSelectedNumber);
    this.dashboardService.setCurrentPhoneNumber(phoneNumber);
  }

  ngOnDestroy() {}
}
