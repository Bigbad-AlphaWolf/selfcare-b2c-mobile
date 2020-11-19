import { Component, OnInit } from '@angular/core';
import { getPageHeader } from 'src/app/utils/title.util';
import { OPERATION_SEE_RATTACHED_NUMBERS, SubscriptionModel, OPERATION_RATTACH_NUMBER } from 'src/shared';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { take, tap, switchMap } from 'rxjs/operators';
import { RattachedNumber } from 'src/app/models/rattached-number.model';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { RattachNumberModalComponent } from 'src/app/components/rattach-number-modal/rattach-number-modal.component';
import { NavController } from '@ionic/angular';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
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
  constructor(private authServ: AuthenticationService, private dashbServ: DashboardService, private bsService: BottomSheetService, private navCon: NavController, private router: Router) { }

  ngOnInit() {
    this.fetchingNumbers();
  }

  fetchingNumbers(){
    this.isLoading = true;
    this.hasError = false;
    const currentNumber = this.dashbServ.getCurrentPhoneNumber();
    DashboardService.rattachedNumbers = null;
    this.authServ.getSubscription(currentNumber).pipe(
      switchMap((res: SubscriptionModel) => {
        return this.dashbServ.attachedNumbers().pipe(take(1),
        tap((list: RattachedNumber[]) => {
          this.listRattachedNumbers.current = {msisdn: currentNumber, formule: res.nomOffre, profil: res.profil };
          this.listRattachedNumbers.others = list;
        }))
    })).subscribe( () => { 
      this.isLoading = false;
      this.hasError = false; },
     (err: any) => { 
       this.isLoading = false;
       this.hasError = true;
       })
  }

  openModalRattachNumber() {
    this.bsService
    .openRattacheNumberModal();
  }
  goBack() {
    this.navCon.pop();
  }

  deleteRattachment() {
    this.router.navigate(['/my-account/delete-number']);
  }
}
