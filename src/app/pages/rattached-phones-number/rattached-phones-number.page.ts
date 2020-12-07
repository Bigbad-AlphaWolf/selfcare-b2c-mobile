import { Component, OnInit } from '@angular/core';
import { getPageHeader } from 'src/app/utils/title.util';
import { OPERATION_SEE_RATTACHED_NUMBERS } from 'src/shared';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { take, tap } from 'rxjs/operators';
import { RattachedNumber } from 'src/app/models/rattached-number.model';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rattached-phones-number',
  templateUrl: './rattached-phones-number.page.html',
  styleUrls: ['./rattached-phones-number.page.scss'],
})
export class RattachedPhonesNumberPage implements OnInit {
  public static readonly PATH = "rattached-phones-number";
  title = getPageHeader(OPERATION_SEE_RATTACHED_NUMBERS).title;
  listRattachedNumbers: { current: RattachedNumber, others: RattachedNumber[] } = { current: null, others: [] };
  isLoading: boolean;
  editable: boolean;
  hasError: boolean;
  constructor(private dashbServ: DashboardService, private bsService: BottomSheetService, private navCon: NavController, private router: Router) { }

  ngOnInit() {
    this.fetchingNumbers();
    this.dashbServ.attachedNumbersChanged.subscribe(() => {
      this.fetchingNumbers();
    });
  }

  fetchingNumbers(){
    this.isLoading = true;
    this.hasError = false;
    const currentNumber = this.dashbServ.getCurrentPhoneNumber();
    this.dashbServ.getAllOemNumbers().pipe(take(1),
        tap((list: RattachedNumber[]) => {
          this.listRattachedNumbers.current = list.find((val: RattachedNumber) => { return  val.msisdn === currentNumber });
          this.listRattachedNumbers.others = list.filter((val: RattachedNumber) => { return  val.msisdn !== currentNumber });

        })).subscribe( () => { 
          this.isLoading = false;
          this.hasError = false; },
         () => { 
           this.isLoading = false;
           this.hasError = true;
      })
  }

  openModalRattachNumber() {
    this.bsService.openRattacheNumberModal();
  }
  goBack() {
    this.navCon.pop();
  }

  deleteRattachment() {
    this.router.navigate(['/my-account/delete-number']);
  }

  
}
