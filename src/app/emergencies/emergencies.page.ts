import { Component, OnInit } from '@angular/core';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
declare var FollowAnalytics: any;
@Component({
  selector: 'app-emergencies',
  templateUrl: './emergencies.page.html',
  styleUrls: ['./emergencies.page.scss']
})
export class EmergenciesPage implements OnInit {
  userProfile;
  profilePostpaid = PROFILE_TYPE_POSTPAID;
  constructor(
    private router: Router,
    private dashbordServ: DashboardService,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {
    this.getCurrentProfile();
  }

  goPuk() {
    this.router.navigate(['/control-center/puk']);
    if (typeof FollowAnalytics !== 'undefined') {
    FollowAnalytics.logEvent('Find_PUK', 'clicked');
    }
  }

  goChangeSeddo() {
    this.router.navigate(['/control-center/change-seddo-code']);
    if (typeof FollowAnalytics !== 'undefined') {
    FollowAnalytics.logEvent('Seddo_PIN', 'clicked');
    }
  }

  goInternet() {
    this.router.navigate(['/control-center/internet-mobile']);
    if (typeof FollowAnalytics !== 'undefined') {
    FollowAnalytics.logEvent('Parametrage_Internet_Mobile', 'clicked');
    }
  }

  goCarteRecharge() {
    this.router.navigate(['/control-center/carte-recharge']);
    if (typeof FollowAnalytics !== 'undefined') {
    FollowAnalytics.logEvent('Carte_Recharge', 'clicked');
    }
  }

  goCreateOMAccount() {
    this.router.navigate(['/control-center/operation-om/creation-compte']);
    if (typeof FollowAnalytics !== 'undefined') {
    FollowAnalytics.logEvent('Creation_Compte_OM', 'clicked');
    }
  }

  goDeplafonnement() {
    this.router.navigate(['/control-center/operation-om/deplafonnement']);
    if (typeof FollowAnalytics !== 'undefined') {
    FollowAnalytics.logEvent('Deplafonnement_OM', 'clicked');
    }
  }

  goReclamation() {
    this.router.navigate(['/control-center/operation-om/reclamation']);
    if (typeof FollowAnalytics !== 'undefined') {
    FollowAnalytics.logEvent('Reclamation_OM', 'clicked');
    }
  }

  getCurrentProfile() {
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(currentNumber).subscribe((res: any) => {
      this.userProfile = res.profil;
    });
  }
}
