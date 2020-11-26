import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account-service/account.service';
import { tap, catchError } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { RattachedNumber } from 'src/app/models/rattached-number.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-identified-numbers-list',
  templateUrl: './identified-numbers-list.component.html',
  styleUrls: ['./identified-numbers-list.component.scss'],
})
export class IdentifiedNumbersListComponent implements OnInit {
  @Input() rattachedNumbers: RattachedNumber[];
  listIdentifiedNumeros: string[] = [];
  isLoading: boolean;
  hasError: boolean;
  constructor(private accServ: AccountService, private modCtrl: ModalController, private dashServ: DashboardService) { }

  ngOnInit() {    
    if(!this.rattachedNumbers){
      this.dashServ.getAllOemNumbers().pipe((tap((res: RattachedNumber[]) => {
        this.rattachedNumbers = res;
      })),catchError((err: any) => {
        this.rattachedNumbers = [];
        return of(err)
      })).subscribe();
    }
    this.fetchIdentifiedNumbersList();
  }

  fetchIdentifiedNumbersList() {
    this.isLoading = true;
    this.hasError = false;
    this.accServ.fetchIdentifiedNumbers().pipe(tap((res: string[]) => {
      this.listIdentifiedNumeros = res;
    })).subscribe((_) => {
      this.isLoading = false;
      this.hasError = false;
    }, (_) =>{
      this.isLoading = false;
      this.hasError = true;
    });
  }

  dismissModal(numeroToAttach?: string) {
    this.modCtrl.dismiss({
      numeroToAttach: numeroToAttach
    })
  }

  isAlreadyRattached(numero: string) {
    return !!this.rattachedNumbers.find((val: RattachedNumber) => val.msisdn === numero);
  }

}
