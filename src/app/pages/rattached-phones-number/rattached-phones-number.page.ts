import { Component, OnInit } from '@angular/core';
import { getPageHeader } from 'src/app/utils/title.util';
import { OPERATION_SEE_RATTACHED_NUMBERS } from 'src/shared';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { take, tap } from 'rxjs/operators';
import { RattachedNumber } from 'src/app/models/rattached-number.model';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { NavController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account-service/account.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';

@Component({
  selector: 'app-rattached-phones-number',
  templateUrl: './rattached-phones-number.page.html',
  styleUrls: ['./rattached-phones-number.page.scss'],
})
export class RattachedPhonesNumberPage implements OnInit {
  public static readonly PATH = 'rattached-phones-number';
  title = getPageHeader(OPERATION_SEE_RATTACHED_NUMBERS).title;
  listRattachedNumbers: {
    current: RattachedNumber;
    others: RattachedNumber[];
  } = { current: null, others: [] };
  isLoading: boolean;
  editable: boolean;
  hasError: boolean;
  givenNumberToRegister: string;
  constructor(
    private dashbServ: DashboardService,
    private bsService: BottomSheetService,
    private navCon: NavController,
    private accountService: AccountService,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.fetchingNumbers();
    this.dashbServ.attachedNumbersChanged.subscribe(() => {
      this.fetchingNumbers();
    });
    console.log(history.state);

    this.givenNumberToRegister = history.state?.numberToRegister;
    if (this.givenNumberToRegister) {
      this.openModalRattachNumber(this.givenNumberToRegister);
    }
  }

  fetchingNumbers() {
    this.isLoading = true;
    this.hasError = false;
    const currentNumber = this.dashbServ.getCurrentPhoneNumber();
    this.dashbServ
      .getAllOemNumbers()
      .pipe(
        take(1),
        tap((list: RattachedNumber[]) => {
          this.listRattachedNumbers.current = list.find((val: RattachedNumber) => {
            return val.msisdn === currentNumber;
          });
          this.listRattachedNumbers.others = list.filter((val: RattachedNumber) => {
            return val.msisdn !== currentNumber;
          });
        })
      )
      .subscribe(
        () => {
          this.isLoading = false;
          this.hasError = false;
        },
        () => {
          this.isLoading = false;
          this.hasError = true;
        }
      );
  }

  openModalRattachNumber(phoneNumber?: string) {
    this.oemLoggingService.registerEvent('lines_new_click', []);
    this.bsService.openRattacheNumberModal(phoneNumber);
  }
  goBack() {
    this.navCon.pop();
  }

  deleteRattachment() {
    this.editable = !this.editable;
    this.oemLoggingService.registerEvent('lines_edit_click', []);
  }

  performAction(numero: string) {
    if (this.editable) {
      const line = [numero];
      this.accountService.deleteUserLinkedPhoneNumbers(line);
    } else {
      this.switchPhoneNumber(numero);
    }
  }

  switchPhoneNumber(msisdn) {
    if (this.listRattachedNumbers.current === msisdn) return;
    this.dashbServ.setCurrentPhoneNumber(msisdn);
    this.goBack();
  }
}
