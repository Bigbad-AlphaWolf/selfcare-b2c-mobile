import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { AuthUpdateGuard } from './services/auth-update-guard/auth-update.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'home-v2',
    loadChildren: './home-v2/home-v2.module#HomeV2PageModule',
    canActivate: [AuthUpdateGuard],
  },
  {
    path: 'new-registration',
    loadChildren:
      './new-registration/new-registration.module#NewRegistrationPageModule',
    canActivate: [AuthUpdateGuard],
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule',
    canActivate: [AuthGuard, AuthUpdateGuard],
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'suivi-conso',
    loadChildren: './dashboard/dashboard.module#DashboardPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'buy-pass-internet',
    loadChildren:
      './buy-pass-internet/buy-pass-internet.module#BuyPassInternetPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'buy-pass-internet-by-credit',
    loadChildren:
      './buy-pass-internet/buy-pass-internet.module#BuyPassInternetPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'buy-pass-internet-by-om',
    loadChildren:
      './buy-pass-internet/buy-pass-internet.module#BuyPassInternetPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'buy-pass-internet/:id',
    loadChildren:
      './buy-pass-internet/buy-pass-internet.module#BuyPassInternetPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'buy-credit',
    loadChildren: './buy-credit/buy-credit.module#BuyCreditPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'details-conso',
    loadChildren: './details-conso/details-conso.module#DetailsConsoPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'my-account',
    loadChildren: './my-account/my-account.module#MyAccountPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'buy-pass-illimix',
    loadChildren:
      './buy-pass-illimix/buy-pass-illimix.module#BuyPassIllimixPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'buy-pass-illimix/:id',
    loadChildren:
      './buy-pass-illimix/buy-pass-illimix.module#BuyPassIllimixPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'buy-sos',
    loadChildren: './buy-sos/buy-sos.module#BuySosPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'soscredit/:amount',
    loadChildren: './buy-sos/buy-sos.module#BuySosPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'sospass/:amount',
    loadChildren: './buy-sos/buy-sos.module#BuySosPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'transfer/:type',
    loadChildren:
      './transfer-credit-bonus-om/transfer-credit-bonus-om.module#TransferCreditBonusOmPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'control-center',
    loadChildren: './emergencies/emergencies.module#EmergenciesPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'change-main-phone-number',
    loadChildren:
      './change-main-phone-number/change-main-phone-number.module#ChangeMainPhoneNumberPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'my-formule',
    loadChildren: './my-formule/my-formule.module#MyFormulePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'sargal-dashboard',
    loadChildren: './sargal/sargal.module#SargalPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'sargal-catalogue',
    loadChildren:
      './sargal/components/sargal-catalogue/sargal-catalogue.module#SargalCataloguePageModule',
    canActivate: [AuthGuard],
  },
  // { path: 'bills', loadChildren: './bills/bills.module#BillsPageModule' },
  {
    path: 'forgotten-password',
    loadChildren:
      './forgotten-password/forgotten-password.module#ForgottenPasswordPageModule',
  },
  {
    path: 'sargal-registration',
    loadChildren:
      './sargal/components/sargal-registration/sargal-registration.module#SargalRegistrationPageModule',
      canActivate: [AuthGuard],
  },
  {
    path: 'apropos',
    loadChildren: './apropos/apropos.module#AproposPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'infolegales',
    loadChildren: './infolegales/infolegales.module#InfolegalesPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'parrainage',
    loadChildren: './parrainage/parrainage.module#ParrainagePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'sargal-status-card',
    loadChildren:
      './sargal-status-card/sargal-status-card.module#SargalStatusCardPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'new-number',
    loadChildren:
      './add-new-phone-number-v2/add-new-phone-number-v2.module#AddNewPhoneNumberV2PageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-home-prepaid',
    loadChildren:
      './dashboard-home-prepaid/dashboard-home-prepaid.module#DashboardHomePrepaidPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-postpaid',
    loadChildren:
      './dashboard-postpaid/dashboard-postpaid.module#DashboardPostpaidPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-kirene',
    loadChildren:
      './dashboard-kirene/dashboard-kirene.module#DashboardKirenePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-postpaid-fixe',
    loadChildren:
      './dashboard-postpaid-fixe/dashboard-postpaid-fixe.module#DashboardPostpaidFixePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-prepaid-hybrid',
    loadChildren:
      './dashboard-prepaid-hybrid/dashboard-prepaid-hybrid.module#DashboardPrepaidHybridPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'my-offer-plans',
    loadChildren:
      './pages/my-offer-plans/my-offer-plans.module#MyOfferPlansPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'operation-recap',
    loadChildren:
      './operation-recap/operation-recap.module#OperationRecapPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'pass-illimix/:ppi',
    loadChildren:
      './operation-recap/operation-recap.module#OperationRecapPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'pass-internet/:ppi',
    loadChildren:
      './operation-recap/operation-recap.module#OperationRecapPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'transfer-money/:msisdn/:amount',
    loadChildren:
      './operation-recap/operation-recap.module#OperationRecapPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'new-pinpad-modal',
    loadChildren:
      './new-pinpad-modal/new-pinpad-modal.module#NewPinpadModalPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'operation-success-fail-modal',
    loadChildren:
      './operation-success-fail-modal/operation-success-fail-modal.module#OperationSuccessFailModalPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'list-pass',
    loadChildren: './pages/liste-pass/liste-pass.module#ListePassPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'registration-success-modal',
    loadChildren:
      './registration-success-modal/registration-success-modal.module#RegistrationSuccessModalPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'transfert-hub-services',
    loadChildren:
      './transfert-hub-services/transfert-hub-services.module#TransfertHubServicesPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'purchase-set-amount',
    loadChildren:
      './purchase-set-amount/purchase-set-amount.module#PurchaseSetAmountPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'transfer-money/:msisdn',
    loadChildren:
      './purchase-set-amount/purchase-set-amount.module#PurchaseSetAmountPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'credit-pass-amount',
    loadChildren:
      './pages/credit-pass-amount/credit-pass-amount.module#CreditPassAmountPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'bills-hub',
    loadChildren: './pages/bills-hub/bills-hub.module#BillsHubPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'bill-amount',
    loadChildren: './pages/bill-amount/bill-amount.module#BillAmountPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'oem-services',
    loadChildren:
      './pages/oem-services/oem-services.module#OemServicesPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'app-update',
    loadChildren: './pages/app-update/app-update.module#AppUpdatePageModule',
  },
  {
    path: 'bills',
    loadChildren:
      './pages/orange-bills/orange-bills.module#OrangeBillsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'orange-bills',
    loadChildren:
      './pages/orange-bills/orange-bills.module#OrangeBillsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'follow-up-requests',
    loadChildren:
      './pages/follow-up-requests/follow-up-requests.module#FollowUpRequestsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'request-status',
    loadChildren:
      './pages/request-status/request-status.module#RequestStatusPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'list-pass-voyage',
    loadChildren:
      './pages/list-pass-voyage/list-pass-voyage.module#ListPassVoyagePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'offres-services',
    loadChildren:
      './pages/offres-services/offres-services.module#OffresServicesPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'dalal-tones',
    loadChildren: './dalal-tones/dalal-tones.module#DalalTonesPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'rapido-operation',
    loadChildren:
      './pages/rapido-operation/rapido-operation.module#RapidoOperationPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-prepaid-light',
    loadChildren:
      './dashboard-prepaid-light/dashboard-prepaid-light.module#DashboardPrepaidLightPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'rattached-phones-number',
    loadChildren:
      './pages/rattached-phones-number/rattached-phones-number.module#RattachedPhonesNumberPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'select-illiflex-type',
    loadChildren:
      './select-illiflex-type/select-illiflex-type.module#SelectIlliflexTypePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'illiflex-configuration',
    loadChildren:
      './illiflex-configuration/illiflex-configuration.module#IlliflexConfigurationPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'illiflex-budget-configuration',
    loadChildren:
      './illiflex-budget-configuration/illiflex-budget-configuration.module#IlliflexBudgetConfigurationPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'illiflex',
    loadChildren:
      './illiflex-budget-configuration/illiflex-budget-configuration.module#IlliflexBudgetConfigurationPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'assistance-hub',
    loadChildren:
      './assistance-hub/assistance-hub.module#AssistanceHubPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'contact-ibou-hub',
    loadChildren:
      './contact-ibou-hub/contact-ibou-hub.module#ContactIbouHubPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'satisfaction-form',
    loadChildren:
      './pages/satisfaction-form/satisfaction-form.module#SatisfactionFormPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'change-orange-money-pin',
    loadChildren:
      './change-orange-money-pin/change-orange-money-pin.module#ChangeOrangeMoneyPinPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'community',
    loadChildren: './community/community.module#CommunityPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'reclamation-om-transaction',
    loadChildren:
      './pages/reclamation-om-transaction/reclamation-om-transaction.module#ReclamationOmTransactionPageModule',
<<<<<<< HEAD
    canActivate: [AuthGuard],
=======
>>>>>>> af51eab00bf469f7619b689ac36821de0c33b94a
  },
  {
    path: 'new-deplafonnement-om',
    loadChildren:
      './new-deplafonnement-om/new-deplafonnement-om.module#NewDeplafonnementOmPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'list-pass-usage',
    loadChildren:
      './list-pass-usage/list-pass-usage.module#ListPassUsagePageModule',
      canActivate: [AuthGuard]
  },
  { path: 'cancel-transaction-om', loadChildren: './cancel-transaction-om/cancel-transaction-om.module#CancelTransactionOmPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
