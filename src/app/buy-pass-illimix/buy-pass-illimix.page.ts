import { PassIllimixService } from './../services/pass-illimix-service/pass-illimix.service';
import { Component, OnInit } from '@angular/core';
import {
  OPERATION_TYPE_PASS_ILLIMIX,
  PassIllimModel,
  PromoPassIllimModel,
  PAYMENT_MOD_CREDIT,
  CODE_KIRENE_Formule,
  PAYMENT_MOD_OM,
  PassIllimixModel
} from 'src/shared';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { BuyPassModel } from '../services/dashboard-service';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
declare var FollowAnalytics: any;

@Component({
  selector: 'app-buy-pass-illimix',
  templateUrl: './buy-pass-illimix.page.html',
  styleUrls: ['./buy-pass-illimix.page.scss']
})
export class BuyPassIllimixPage implements OnInit {
  OPERATION_TYPE_PASS_ILLIMIX = OPERATION_TYPE_PASS_ILLIMIX;
  PROFILE_TYPE_POSTPAID = PROFILE_TYPE_POSTPAID;
  step = 0;
  passIllimixChoosed: any;
  // For now we consider that the recepient is the connected user
  destNumber: string;
  passIllimixDetails: any;
  pinErrorMsg = '';
  pinPadHasError = false;
  errorMsg: string;
  failed: boolean;
  title = 'Achat de pass illimix';
  choosedPaymentMod: string;
  passIllimixChosen: PassIllimModel | PromoPassIllimModel;
  buyingPass: boolean;
  isKirene: boolean;
  currentUserNumber: string;
  currentProfil: string;
  recipientFirstName: string;
  recipientLastName: string;
  destCodeFormule: string;
  pageAccessUrl: string;

  idPassSelected: number;
  buyFromLink: boolean;
  currentFormule: string;

  constructor(
    private router: Router,
    private dashServ: DashboardService,
    public dialog: MatDialog,
    private authServ: AuthenticationService,
    private followAnalyticsService: FollowAnalyticsService,
    private route: ActivatedRoute,
    private passService: PassIllimixService
  ) {}

  /** les etapes
   * step 0 choix du mode de paiement
   * step 1 choix du destinataire
   * step 2 list des pass
   * step 3 confirmation ou validation puis achat par credit
   * step 4 effectuer la transaction par OM
   * step 5 message
   */

  ngOnInit() {}

  ionViewWillEnter() {
    this.currentUserNumber = this.dashServ.getCurrentPhoneNumber();
    this.step = 0;
    this.getCurrentSubscription();
    this.checkUserIsPostPaid();
    this.pageAccessUrl = this.router.url;
  }

  checkUserIsPostPaid() {
    this.authServ
      .getSubscription(this.currentUserNumber)
      .subscribe((souscription: any) => {
        this.currentProfil = souscription.profil;
        this.currentFormule = souscription.nomOffre;
        if (this.currentProfil === PROFILE_TYPE_POSTPAID) {
          this.step = 1;
          this.choosedPaymentMod = PAYMENT_MOD_OM;
        }
        this.idPassSelected = +this.route.snapshot.paramMap.get('id');
        if (this.idPassSelected) {
          this.destNumber = this.currentUserNumber;
          this.buyFromLink = true;
          this.passService
            .getPassById(this.idPassSelected)
            .subscribe((pass: any) => {
              this.passIllimixChosen = pass;
              this.passIllimixChoosed = {
                destinataire: this.destNumber,
                pass,
                paymentMod: this.choosedPaymentMod
              };
              this.step = 0;
            });
        }
      });
  }
  nextStepOfSelectDest(destNumberInfos: {
    destinataire: string;
    code: string;
  }) {
    this.goToNextStep();
    this.destNumber = destNumberInfos.destinataire;
    this.destCodeFormule = destNumberInfos.code;
    if (destNumberInfos.destinataire !== this.currentUserNumber) {
      this.followAnalyticsService.registerEventFollow(
        'Pass_Internet_ChoixDestinataire',
        'event',
        destNumberInfos.destinataire
      );
    } else {
      this.followAnalyticsService.registerEventFollow(
        'Pass_Internet_ChoixDestinataire',
        'event',
        destNumberInfos.destinataire
      );
    }
  }

  contactGot(contact) {
    this.recipientFirstName = contact ? contact.name.givenName : '';
    this.recipientLastName = contact.name.familyName
      ? contact.name.familyName
      : '';
    this.recipientFirstName += contact.name.middleName
      ? ` ${contact.name.middleName}`
      : '';
  }

  nextStepOfPaymentMod(paymentMod: string) {
    this.choosedPaymentMod = paymentMod;
    console.log('from link? ' + this.buyFromLink);
    if (this.buyFromLink) {
      this.step = 3;
    } else {
      this.goToNextStep();
    }
  }

  goToNextStep() {
    this.step++;
  }

  passDataToStepValidation(passIllimix: any) {
    this.passIllimixChoosed = {
      destinataire: this.destNumber,
      pass: passIllimix,
      paymentMod: this.choosedPaymentMod
    };
    this.passIllimixChosen = passIllimix;
    this.goToNextStep();
  }

  goToPreviousStep() {
    const previousStep = this.step - 1;
    if (previousStep < 0) {
      this.goToDashboardPage();
    } else if (this.buyFromLink && this.step === 3) {
      this.step = 0;
    } else {
      this.step = previousStep;
    }
  }

  goToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  payWithOM(status) {
    if (status !== 'erreur') {
      this.goToNextStep();
    }
  }

  payWithCredit() {
    this.buyingPass = true;
    const codeIN = this.passIllimixChoosed.pass.price_plan_index;
    const amount = +this.passIllimixChoosed.pass.tarif;
    const msisdn = this.dashServ.getCurrentPhoneNumber();
    const receiver = this.destNumber;
    const payload: BuyPassModel = {
      type: 'illimix',
      codeIN,
      amount,
      msisdn,
      receiver
    };
    this.dashServ.buyPassByCredit(payload).subscribe(
      (res: any) => {
        this.buyingPass = false;
        if (res.code !== '0') {
          this.failed = true;
          this.errorMsg = res.message;
          const followDetails = { error_code: res.code };
          this.followAnalyticsService.registerEventFollow(
            'Credit_Buy_Pass_Illimix_Error',
            'error',
            followDetails
          );
        } else {
          this.failed = false;
          const followDetails = {
            option_name: this.passIllimixChoosed.pass.nom,
            amount: this.passIllimixChoosed.pass.tarif,
            plan: this.passIllimixChoosed.pass.price_plan_index
          };
          this.followAnalyticsService.registerEventFollow(
            'Credit_Buy_Pass_Illimix_Success',
            'event',
            followDetails
          );
        }
        this.goToSuccessStep();
      },
      (err: any) => {
        this.buyingPass = false;
        this.failed = true;
        if (err.message) {
          if (err.status === 500) {
            this.errorMsg = 'Erreur réseau. Veuillez réessayer ultérieurement';
          } else {
            this.errorMsg =
              'Service indisponible. Veuillez réessayer ultérieurement';
          }
        }
        this.followAnalyticsService.registerEventFollow(
          'Credit_Buy_Pass_Illimix_Error',
          'error',
          {
            msisdn1: this.currentUserNumber,
            msisdn2: this.destNumber,
            message: 'Service indisponible'
          }
        );
        this.goToSuccessStep();
      }
    );
  }

  goToSuccessStep() {
    this.step = 5;
  }

  passDataToSuccessPage(passBought: any) {
    this.passIllimixDetails = passBought;
    if (this.passIllimixDetails.paymentMod === PAYMENT_MOD_CREDIT) {
      this.payWithCredit();
    } else {
      this.goToNextStep();
    }
  }

  returnToTheBeginning() {
    this.step = 0;
  }

  getCurrentSubscription() {
    this.authServ
      .getSubscription(this.currentUserNumber)
      .subscribe((res: any) => {
        if (res.code === CODE_KIRENE_Formule) {
          this.title = 'Acheter un  Mixel';
          this.isKirene = true;
        }
      });
  }
}
