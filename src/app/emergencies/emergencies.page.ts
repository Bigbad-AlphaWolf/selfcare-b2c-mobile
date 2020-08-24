import { Component, OnInit } from '@angular/core';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
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
    private authServ: AuthenticationService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.getCurrentProfile();
  }

  goPuk() {
    this.router.navigate(['/control-center/puk']);
    this.followAnalyticsService.registerEventFollow(
      'Find_PUK',
      'event',
      'clicked'
    );
  }

  goChangeSeddo() {
    this.router.navigate(['/control-center/change-seddo-code']);
    this.followAnalyticsService.registerEventFollow(
      'Seddo_PIN',
      'event',
      'clicked'
    );
  }

  goInternet() {
    this.router.navigate(['/control-center/internet-mobile']);
    this.followAnalyticsService.registerEventFollow(
      'Parametrage_Internet_Mobile',
      'event',
      'clicked'
    );
  }

  goCarteRecharge() {
    this.router.navigate(['/control-center/carte-recharge']);
    this.followAnalyticsService.registerEventFollow(
      'Carte_Recharge',
      'event',
      'clicked'
    );
  }

  goCreateOMAccount() {
    this.router.navigate(['/control-center/operation-om/creation-compte']);
    this.followAnalyticsService.registerEventFollow(
      'Creation_Compte_OM',
      'event',
      'clicked'
    );
  }

  goDeplafonnement() {
    this.router.navigate(['/control-center/operation-om/deplafonnement']);
    this.followAnalyticsService.registerEventFollow(
      'Deplafonnement_OM',
      'event',
      'clicked'
    );
  }

  goReclamation() {
    this.router.navigate(['/control-center/operation-om/reclamation']);
    this.followAnalyticsService.registerEventFollow(
      'Reclamation_OM',
      'event',
      'clicked'
    );
  }

  onFollowUpRequests() {
    this.router.navigate(['follow-up-requests']);
    this.followAnalyticsService.registerEventFollow(
      'Suivi_Reclamation_OM',
      'event',
      'clicked'
    );
  }

  getCurrentProfile() {
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(currentNumber).subscribe((res: any) => {
      this.userProfile = res.profil;
    });
  }
}
