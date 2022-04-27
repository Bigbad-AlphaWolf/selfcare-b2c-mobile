import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {FORGOT_PWD_PAGE_URL} from 'src/shared';
import {AuthGuard} from './services/auth-guard/auth.guard';
import {AuthUpdateGuard} from './services/auth-update-guard/auth-update.guard';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: 'new-registration',
    loadChildren: () => import('./new-registration/new-registration.module').then(m => m.NewRegistrationPageModule),
    canActivate: [AuthUpdateGuard]
  },
  {
    path: FORGOT_PWD_PAGE_URL,
    loadChildren: () => import('./new-registration/new-registration.module').then(m => m.NewRegistrationPageModule),
    canActivate: [AuthUpdateGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuard, AuthUpdateGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'suivi-conso',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-credit',
    loadChildren: () => import('./buy-credit/buy-credit.module').then(m => m.BuyCreditPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'details-conso',
    loadChildren: () => import('./details-conso/details-conso.module').then(m => m.DetailsConsoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-account',
    loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-sos',
    loadChildren: () => import('./buy-sos/buy-sos.module').then(m => m.BuySosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'soscredit/:amount',
    loadChildren: () => import('./buy-sos/buy-sos.module').then(m => m.BuySosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sospass/:amount',
    loadChildren: () => import('./buy-sos/buy-sos.module').then(m => m.BuySosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transfer/:type',
    loadChildren: () => import('./transfer-credit-bonus-om/transfer-credit-bonus-om.module').then(m => m.TransferCreditBonusOmPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'control-center',
    loadChildren: () => import('./emergencies/emergencies.module').then(m => m.EmergenciesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'change-main-phone-number',
    loadChildren: () => import('./change-main-phone-number/change-main-phone-number.module').then(m => m.ChangeMainPhoneNumberPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-formule',
    loadChildren: () => import('./my-formule/my-formule.module').then(m => m.MyFormulePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'changement-formule',
    loadChildren: () => import('./my-formule/my-formule.module').then(m => m.MyFormulePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'changement-formule/:codeFormule',
    loadChildren: () => import('./my-formule/my-formule.module').then(m => m.MyFormulePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sargal-dashboard',
    loadChildren: () => import('./sargal/sargal.module').then(m => m.SargalPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sargal-catalogue',
    loadChildren: () => import('./sargal/components/sargal-catalogue/sargal-catalogue.module').then(m => m.SargalCataloguePageModule),
    canActivate: [AuthGuard]
  },
  // { path: 'bills', loadChildren: './bills/bills.module#BillsPageModule' },
  {
    path: 'forgotten-password',
    loadChildren: () => import('./forgotten-password/forgotten-password.module').then(m => m.ForgottenPasswordPageModule)
  },
  {
    path: 'sargal-registration',
    loadChildren: () =>
      import('./sargal/components/sargal-registration/sargal-registration.module').then(m => m.SargalRegistrationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'apropos',
    loadChildren: () => import('./apropos/apropos.module').then(m => m.AproposPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'infolegales',
    loadChildren: () => import('./infolegales/infolegales.module').then(m => m.InfolegalesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'parrainage',
    loadChildren: () => import('./parrainage/parrainage.module').then(m => m.ParrainagePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bonplan',
    loadChildren: () => import('./pages/my-offer-plans/my-offer-plans.module').then(m => m.MyOfferPlansPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sargal-status-card',
    loadChildren: () => import('./sargal-status-card/sargal-status-card.module').then(m => m.SargalStatusCardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'new-number',
    loadChildren: () => import('./add-new-phone-number-v2/add-new-phone-number-v2.module').then(m => m.AddNewPhoneNumberV2PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-home-prepaid',
    loadChildren: () => import('./dashboard-home-prepaid/dashboard-home-prepaid.module').then(m => m.DashboardHomePrepaidPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-postpaid',
    loadChildren: () => import('./dashboard-postpaid/dashboard-postpaid.module').then(m => m.DashboardPostpaidPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-kirene',
    loadChildren: () => import('./dashboard-kirene/dashboard-kirene.module').then(m => m.DashboardKirenePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-postpaid-fixe',
    loadChildren: () => import('./dashboard-postpaid-fixe/dashboard-postpaid-fixe.module').then(m => m.DashboardPostpaidFixePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-prepaid-hybrid',
    loadChildren: () => import('./dashboard-prepaid-hybrid/dashboard-prepaid-hybrid.module').then(m => m.DashboardPrepaidHybridPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-offer-plans',
    loadChildren: () => import('./pages/my-offer-plans/my-offer-plans.module').then(m => m.MyOfferPlansPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'operation-recap',
    loadChildren: () => import('./operation-recap/operation-recap.module').then(m => m.OperationRecapPageModule)
  },
  {
    path: 'pass-illimix/:ppi',
    loadChildren: () => import('./operation-recap/operation-recap.module').then(m => m.OperationRecapPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pass-internet/:ppi',
    loadChildren: () => import('./operation-recap/operation-recap.module').then(m => m.OperationRecapPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transfer-money/:msisdn/:amount',
    loadChildren: () => import('./operation-recap/operation-recap.module').then(m => m.OperationRecapPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'new-pinpad-modal',
    loadChildren: () => import('./new-pinpad-modal/new-pinpad-modal.module').then(m => m.NewPinpadModalPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'operation-success-fail-modal',
    loadChildren: () =>
      import('./operation-success-fail-modal/operation-success-fail-modal.module').then(m => m.OperationSuccessFailModalPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-pass',
    loadChildren: () => import('./pages/liste-pass/liste-pass.module').then(m => m.ListePassPageModule)
  },
  {
    path: 'registration-success-modal',
    loadChildren: () =>
      import('./registration-success-modal/registration-success-modal.module').then(m => m.RegistrationSuccessModalPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transfert-hub-services',
    loadChildren: () => import('./transfert-hub-services/transfert-hub-services.module').then(m => m.TransfertHubServicesPageModule)
  },
  {
    path: 'operation-set-amount',
    loadChildren: () => import('./purchase-set-amount/purchase-set-amount.module').then(m => m.PurchaseSetAmountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transfer-money/:msisdn',
    loadChildren: () => import('./purchase-set-amount/purchase-set-amount.module').then(m => m.PurchaseSetAmountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'credit-pass-amount',
    loadChildren: () => import('./pages/credit-pass-amount/credit-pass-amount.module').then(m => m.CreditPassAmountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bills-hub',
    loadChildren: () => import('./pages/bills-hub/bills-hub.module').then(m => m.BillsHubPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bill-amount',
    loadChildren: () => import('./pages/bill-amount/bill-amount.module').then(m => m.BillAmountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'oem-services',
    loadChildren: () => import('./pages/oem-services/oem-services.module').then(m => m.OemServicesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'app-update',
    loadChildren: () => import('./pages/app-update/app-update.module').then(m => m.AppUpdatePageModule)
  },
  {
    path: 'bills',
    loadChildren: () => import('./pages/orange-bills/orange-bills.module').then(m => m.OrangeBillsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'orange-bills',
    loadChildren: () => import('./pages/orange-bills/orange-bills.module').then(m => m.OrangeBillsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'follow-up-requests',
    loadChildren: () => import('./pages/follow-up-requests/follow-up-requests.module').then(m => m.FollowUpRequestsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'request-status',
    loadChildren: () => import('./pages/request-status/request-status.module').then(m => m.RequestStatusPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-pass-voyage',
    loadChildren: () => import('./pages/list-pass-voyage/list-pass-voyage.module').then(m => m.ListPassVoyagePageModule)
  },
  {
    path: 'offres-services',
    loadChildren: () => import('./pages/offres-services/offres-services.module').then(m => m.OffresServicesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dalal-tones',
    loadChildren: () => import('./dalal-tones/dalal-tones.module').then(m => m.DalalTonesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rapido-operation',
    loadChildren: () => import('./pages/rapido-operation/rapido-operation.module').then(m => m.RapidoOperationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'xeweul-operation',
    loadChildren: () => import('./pages/xeweul-operation/xeweul-operation.module').then(m => m.XeweulOperationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-prepaid-light',
    loadChildren: () => import('./dashboard-prepaid-light/dashboard-prepaid-light.module').then(m => m.DashboardPrepaidLightPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rattached-phones-number',
    loadChildren: () =>
      import('./pages/rattached-phones-number/rattached-phones-number.module').then(m => m.RattachedPhonesNumberPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'illiflex-budget-configuration',
    loadChildren: () =>
      import('./illiflex-budget-configuration/illiflex-budget-configuration.module').then(m => m.IlliflexBudgetConfigurationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'illiflex',
    loadChildren: () =>
      import('./illiflex-budget-configuration/illiflex-budget-configuration.module').then(m => m.IlliflexBudgetConfigurationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'assistance-hub',
    loadChildren: () => import('./assistance-hub/assistance-hub.module').then(m => m.AssistanceHubPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contact-ibou-hub',
    loadChildren: () => import('./contact-ibou-hub/contact-ibou-hub.module').then(m => m.ContactIbouHubPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'satisfaction-form',
    loadChildren: () => import('./pages/satisfaction-form/satisfaction-form.module').then(m => m.SatisfactionFormPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'change-orange-money-pin',
    loadChildren: () => import('./change-orange-money-pin/change-orange-money-pin.module').then(m => m.ChangeOrangeMoneyPinPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'community',
    loadChildren: () => import('./community/community.module').then(m => m.CommunityPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-pass-usage',
    loadChildren: () => import('./list-pass-usage/list-pass-usage.module').then(m => m.ListPassUsagePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'om-self-operation',
    loadChildren: () =>
      import('./orange-money-self-operation/orange-money-self-operation.module').then(m => m.OrangeMoneySelfOperationModule)
  },
  {
    path: 'purchase-set-amount',
    loadChildren: () => import('./transfer-set-amount/transfer-set-amount.module').then(m => m.TransferSetAmountPageModule)
  },
  {
    path: 'kiosk-locator',
    loadChildren: () => import('./kiosk-locator/kiosk-locator.module').then(m => m.KioskLocatorPageModule)
  },
  {
    path: 'new-prepaid-hybrid-dashboard',
    loadChildren: () =>
      import('./new-prepaid-hybrid-dashboard/new-prepaid-hybrid-dashboard.module').then(m => m.NewPrepaidHybridDashboardPageModule)
  },
  {
    path: 'new-suivi-conso',
    loadChildren: () => import('./new-suivi-conso/new-suivi-conso.module').then(m => m.NewSuiviConsoPageModule)
  },
  {
    path: 'new-services',
    loadChildren: () => import('./new-services/new-services.module').then(m => m.NewServicesPageModule)
  },
  {
    path: 'new-assistance-hub-v2',
    loadChildren: () => import('./new-assistance-hub-v2/new-assistance-hub-v2.module').then(m => m.NewAssistanceHubV2PageModule)
  },
  {
    path: 'list-pass-international',
    loadChildren: () =>
      import('./pages/list-pass-international/list-pass-international.module').then(m => m.ListPassInternationalPageModule)
  },
  {
    path: 'new-select-beneficiary',
    loadChildren: () => import('./new-select-beneficiary/new-select-beneficiary.module').then( m => m.NewSelectBeneficiaryPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
