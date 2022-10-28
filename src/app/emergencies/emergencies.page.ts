import { Component, OnInit } from '@angular/core';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FIND_AGENCE_EXTERNAL_URL } from 'src/shared';
import { NavController } from '@ionic/angular';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
@Component({
  selector: 'app-emergencies',
  templateUrl: './emergencies.page.html',
  styleUrls: ['./emergencies.page.scss'],
})
export class EmergenciesPage implements OnInit {
  userProfile;
  profilePostpaid = PROFILE_TYPE_POSTPAID;
  constructor(
    private router: Router,
    private dashbordServ: DashboardService,
    private authServ: AuthenticationService,
    private oemLoggingService: OemLoggingService,
    private inAppBrowser: InAppBrowser,
    private navControler: NavController
  ) {}

  ngOnInit() {
    this.getCurrentProfile();
  }

  goPuk() {
    this.router.navigate(['/control-center/puk']);
    this.oemLoggingService.registerEvent('Find_PUK');
  }

  goChangeSeddo() {
    this.router.navigate(['/control-center/change-seddo-code']);
    this.oemLoggingService.registerEvent('Seddo_PIN');
  }

  goInternet() {
    this.router.navigate(['/control-center/internet-mobile']);
    this.oemLoggingService.registerEvent('Parametrage_Internet_Mobile');
  }

  goCarteRecharge() {
    this.router.navigate(['/control-center/carte-recharge']);
    this.oemLoggingService.registerEvent('Carte_Recharge');
  }

  goCreateOMAccount() {
    this.router.navigate(['/control-center/operation-om/creation-compte']);
    this.oemLoggingService.registerEvent('Creation_Compte_OM');
  }

  goDeplafonnement() {
    this.router.navigate(['/control-center/operation-om/deplafonnement']);
    this.oemLoggingService.registerEvent('Deplafonnement_OM');
  }

  goReclamation() {
    this.router.navigate(['/control-center/operation-om/reclamation']);
    this.oemLoggingService.registerEvent('Reclamation_OM');
  }

  onFollowUpRequests() {
    this.router.navigate(['follow-up-requests']);
    this.oemLoggingService.registerEvent('suivi_demande-fixe');
  }

  goFindToAgenceWebSite() {
    this.inAppBrowser.create(FIND_AGENCE_EXTERNAL_URL, '_self');
    this.oemLoggingService.registerEvent('Trouver_agence_orange');
  }

  getCurrentProfile() {
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(currentNumber).subscribe((res: any) => {
      this.userProfile = res.profil;
    });
  }

  goBack() {
    this.navControler.pop();
  }
}
