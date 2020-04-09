import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard-service/dashboard.service';

@Component({
  selector: 'app-select-beneficiary-v2',
  templateUrl: './select-beneficiary-v2.page.html',
  styleUrls: ['./select-beneficiary-v2.page.scss'],
})
export class SelectBeneficiaryV2Page implements OnInit {
  currentUserNumber: string;
  recipientNumber: string;
  isUserRecipient = true;
  customAlertOptions: any = {
    header: 'Selectionner un numéro',
    translucent: true
  };
  listUserNumber: {msisdn: string, profil: string, formule: string}[] = [];
  hasError: boolean;
  isLoaded: boolean;
  mainPhoneNumber: string;
  constructor(private dashbbServ: DashboardService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.currentUserNumber = this.dashbbServ.getCurrentPhoneNumber();
    this.mainPhoneNumber = this.dashbbServ.getMainPhoneNumber();

    this.getListeRattachedNumber();
  }

  getListeRattachedNumber(){
    this.isLoaded = false;
    this.listUserNumber = [];
    this.dashbbServ.getAttachedNumbers().subscribe((res: any[])=>{
      this.isLoaded = true;
      this.hasError = false;
      if(res.length){        
        this.listUserNumber.push(...res);
      }
    },(err: any)=>{
      this.isLoaded = true;
      this.hasError = true;
    });
  }

}
