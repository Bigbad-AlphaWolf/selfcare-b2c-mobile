import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { getConsoByCategory } from 'src/app/dashboard';
import { USER_CONS_CATEGORY_CALL } from 'src/shared';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentProfil;

  constructor(
    private authServ: AuthenticationService,
    private router: Router,
    private dashboardService: DashboardService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userHasLogin = !!this.authServ.getToken();
    const currentPhoneNumber = this.dashboardService.getCurrentPhoneNumber();
    if (!userHasLogin) {
      if (
        state.url === '/login' ||
        state.url === '/home'
      ) {
        return true;
      }
      this.router.navigate(['/new-registration']);
      return false;
    } else {
      if (
        state.url === '/' ||
        state.url === '/login' ||
        state.url === '/home'

      ) {
        this.router.navigate(['/dashboard']);
        return false;
      }
      if (
        state.url === '/dashboard/all-my-conso/transfert-credit' ||
        state.url === '/transfer/credit-pass'
      ) {
        this.dashboardService
          .getUserConsoInfosByCode([1, 2, 6])
          .subscribe((res: any) => {
            const myconso = getConsoByCategory(res)[USER_CONS_CATEGORY_CALL];
            let solde = 0;
            let soldebonus = 0;
            if (myconso) {
              myconso.forEach(x => {
                if (x.code === 1) {
                  solde += Number(x.montant);
                } else if (x.code === 2 || x.code === 6) {
                  soldebonus += Number(x.montant);
                }
              });
              if (solde < 489 && !(solde > 20 && soldebonus > 1)) {
                this.router.navigate(['/dashboard']);
                return false;
              }
            }
          });
      }
      return true;
    }
  }
}
