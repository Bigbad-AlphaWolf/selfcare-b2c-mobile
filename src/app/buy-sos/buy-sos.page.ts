import {Component, OnInit} from '@angular/core';
import {SoSModel} from '../services/sos-service';
import {OPERATION_TYPE_SOS, PAY_WITH_CREDIT, PAYMENT_MOD_NEXT_RECHARGE} from 'src/shared';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardService} from '../services/dashboard-service/dashboard.service';
import {SosService} from '../services/sos-service/sos.service';

@Component({
  selector: 'app-buy-sos',
  templateUrl: './buy-sos.page.html',
  styleUrls: ['./buy-sos.page.scss']
})
export class BuySosPage implements OnInit {
  title = 'Sos Crédit et Pass';
  step = 0;
  selectedSos: SoSModel;
  OPERATION_TYPE_SOS = OPERATION_TYPE_SOS;
  PAY_WITH_CREDIT = PAY_WITH_CREDIT;
  loading;
  failed;
  errorMsg;
  currentNumber: string;
  PAYMENT_MOD_NEXT_RECHARGE = PAYMENT_MOD_NEXT_RECHARGE;

  constructor(
    private router: Router,
    private dashServ: DashboardService,
    public dialog: MatDialog,
    private sosService: SosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.currentNumber = this.dashServ.getCurrentPhoneNumber();
    const isDeeplinkSos = await this.checkDeeplinkSos();
    if (isDeeplinkSos) return;
    this.step = 0;
  }

  async checkDeeplinkSos() {
    const amount = +this.route.snapshot.paramMap.get('amount');
    console.log(amount);
    if (!amount) return 0;
    const route = this.router.url;
    if (!route.match('soscredit') && !route.match('sospass')) return;
    const typeSos = route.match('soscredit') ? 'SOS CREDIT' : 'SOS Pass Internet';
    const allSos = await this.sosService.getListSosByFormule().toPromise();
    const currentSos = allSos.find(sos => sos.montant === amount && sos.typeSOS.nom === typeSos);
    console.log(currentSos);
    if (currentSos) {
      this.step = 1;
      this.selectedSos = currentSos;
    }
    return currentSos;
  }

  goToNextStep() {
    this.step++;
  }

  goToPreviousStep() {
    const previousStep = this.step - 1;
    if (previousStep < 0) {
      this.goToDashboardPage();
    } else {
      this.step = previousStep;
    }
  }

  goToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  nextStepOfChooseSOS(sos: SoSModel) {
    this.selectedSos = sos;
    this.goToNextStep();
  }

  subscribeSos() {
    this.loading = true;
    const msisdn = this.currentNumber;
    const typeCredit: 'data' | 'credit' = this.selectedSos.typeSOS.nom === 'SOS CREDIT' ? 'credit' : 'data';
    const amount = this.selectedSos.montant;
    const sosPayload = {msisdn, typeCredit, amount};
    this.sosService.subscribeToSos(sosPayload).subscribe(
      (res: {message: string; code: string}) => {
        this.loading = false;
        const response_msg = res.message;
        const response_code = res.code;
        if (response_code === '0') {
          const followDetails = {
            amount: `${amount} FCFA`,
            fees: `${this.selectedSos.frais} FCFA`
          };
          // FollowAnalytics.logEvent('EmergencyCredit_Success', followDetails);
          this.step = 2;
        } else {
          const followDetails = {error_code: response_msg};
          // FollowAnalytics.logError('EmergencyCredit_Error', followDetails);
          this.failed = true;
          this.errorMsg = response_msg;
          this.step = 2;
        }
      },
      (err: any) => {
        this.loading = false;
        const followDetails = {error_code: err.message};
        // FollowAnalytics.logError('EmergencyCredit_Error', followDetails);
        this.failed = true;
        this.step = 2;
        this.errorMsg = err.message ? err.message : 'Une erreur est survenue';
      }
    );
  }

  goToFirstStep() {
    this.router.navigate(['/buy-credit']);
  }
}
