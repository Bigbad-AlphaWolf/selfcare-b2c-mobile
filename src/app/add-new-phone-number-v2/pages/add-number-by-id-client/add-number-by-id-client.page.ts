import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { Router, ActivatedRoute } from '@angular/router';
import { REGEX_FIX_NUMBER, REGEX_NUMBER } from 'src/shared';

@Component({
  selector: 'app-add-number-by-id-client',
  templateUrl: './add-number-by-id-client.page.html',
  styleUrls: ['./add-number-by-id-client.page.scss'],
})
export class AddNumberByIdClientPage implements OnInit {

  successDialog: MatDialogRef<ModalSuccessComponent>;
  isProcessing: boolean;
  payload: {login: string, numero: string, typeNumero: "FIXE", idClient: string} = {login: this.dashboardServ.getMainPhoneNumber(), numero : null, typeNumero: "FIXE", idClient: null};
  constructor(
    private dashboardServ: DashboardService,
    private dialog: MatDialog,
    private followAnalyticsService: FollowAnalyticsService,
    private activatedRoute:ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.activatedRoute.queryParams.subscribe((params: {login: string, numero: string, typeNumero: "FIXE"})=>{
      if(params && params.numero){
        this.payload.numero = params.numero;
        
      }else{
        this.router.navigate(['/new-number'])
      }
    })
  }
  saveRattachmentFixNumber(idClient: string) {
    this.isProcessing = true;
    this.payload.idClient = idClient;    
    this.dashboardServ.registerNumberByIdClient(this.payload).subscribe(
      (res: any) => {
        this.isProcessing = false;
        this.followAttachmentIssues(this.payload, 'event');
        this.dialog.open(ModalSuccessComponent, {
          data: { type: 'rattachment-success' },
          width: '95%',
          maxWidth: '375px'
        });
      },
      (err: any) => {
          this.isProcessing = false;
          this.dialog.open(ModalSuccessComponent, {
            data: { type: 'rattachment-failed' },
            width: '95%',
            maxWidth: '375px'
          });
        this.followAttachmentIssues(this.payload, 'error');
      }
    );
  }

  followAttachmentIssues(
    payload: { login: string; numero: string; typeNumero: string },
    eventType: 'error' | 'event'
  ) {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        login: payload.login
      };
      const eventName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_success`;
      this.followAnalyticsService.registerEventFollow(
        eventName,
        eventType,
        infosFollow
      );
    } else {
      const infosFollow = {
        number_to_attach: payload.numero,
        login: payload.login
      };
      const errorName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_failed`;
      this.followAnalyticsService.registerEventFollow(
        errorName,
        eventType,
        infosFollow
      );
    }
  }

}
