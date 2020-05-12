import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';

@Component({
  selector: 'app-transfert-om-recapitulatif',
  templateUrl: './transfert-om-recapitulatif.page.html',
  styleUrls: ['./transfert-om-recapitulatif.page.scss'],
})
export class TransfertOmRecapitulatifPage implements OnInit {
  transfertOMType = 'TRANSFERT_OM_WITHOUT_CODE';
  recipientMsisdn: string;
  recipientFirstname: string;
  recipientLastname: string;
  transfertOMAmount: number = 0;
  constructor(private route: ActivatedRoute, private router: Router, private appRouting: ApplicationRoutingService) { }

  ngOnInit() {
    /* this.route.queryParams.subscribe((params) => {
      if (
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.transfertOMType &&
        this.router.getCurrentNavigation().extras.state.recipientMsisdn
      ) {
        this.transfertOMType = this.router.getCurrentNavigation().extras.state.transfertOMType;
        this.recipientMsisdn = this.router.getCurrentNavigation().extras.state.recipientMsisdn;
        this.recipientFirstname = this.router.getCurrentNavigation().extras.state.recipientFirstname;
        this.recipientLastname = this.router.getCurrentNavigation().extras.state.recipientLastname;

      }else{
        this.appRouting.goToTransfertMoneyPage();
      }
    }); */
  }

}
