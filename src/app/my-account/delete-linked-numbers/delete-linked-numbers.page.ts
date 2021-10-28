import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {AccountService} from 'src/app/services/account-service/account.service';
import {MatDialog} from '@angular/material/dialog';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-delete-linked-numbers',
  templateUrl: './delete-linked-numbers.page.html',
  styleUrls: ['./delete-linked-numbers.page.scss']
})
export class DeleteLinkedNumbersPage implements OnInit, OnDestroy {
  dialogSub: Subscription;
  phoneNumbersToDelete: string[] = [];
  phoneNumbers = [];
  cpt = 0;
  constructor(
    private accountService: AccountService,
    public dialog: MatDialog,
    private dashboardservice: DashboardService,
    private authService: AuthenticationService,
    private navCtr: NavController
  ) {}

  ngOnInit() {
    this.getUserAttachedPhoneNumber();
    this.accountService.deletedPhoneNumbersEmit().subscribe(res => {
      this.cpt = 0;
      this.getUserAttachedPhoneNumber();
      this.changeCurrentPhoneNumber();
    });
  }

  deletePhoneNumbers() {
    this.accountService.deleteUserLinkedPhoneNumbers(this.phoneNumbersToDelete);
  }

  onSelectItemsUpdated(phoneNumbers: string[]) {
    this.phoneNumbersToDelete = phoneNumbers;
    this.cpt = this.phoneNumbersToDelete.length;
  }

  changeCurrentPhoneNumber() {
    const result = this.phoneNumbersToDelete.find(x => x === this.dashboardservice.getCurrentPhoneNumber());
    if (result) {
      this.dashboardservice.setCurrentPhoneNumber(this.authService.getUserMainPhoneNumber());
    }
  }
  getUserAttachedPhoneNumber() {
    return this.dashboardservice.getAttachedNumbers().subscribe((res: any) => {
      this.phoneNumbers = res;
      this.phoneNumbers.forEach((element, index) => {
        element.profile = index;
      });
    });
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }

  goBack() {
    this.navCtr.pop();
  }
}
