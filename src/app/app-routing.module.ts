import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-pass-internet',
    loadChildren:
      './buy-pass-internet/buy-pass-internet.module#BuyPassInternetPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-pass-internet-by-credit',
    loadChildren:
      './buy-pass-internet/buy-pass-internet.module#BuyPassInternetPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-pass-internet-by-om',
    loadChildren:
      './buy-pass-internet/buy-pass-internet.module#BuyPassInternetPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-pass-internet/:id',
    loadChildren:
      './buy-pass-internet/buy-pass-internet.module#BuyPassInternetPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-credit',
    loadChildren: './buy-credit/buy-credit.module#BuyCreditPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'details-conso',
    loadChildren: './details-conso/details-conso.module#DetailsConsoPageModule'
  },
  {
    path: 'my-account',
    loadChildren: './my-account/my-account.module#MyAccountPageModule'
  },
  {
    path: 'buy-pass-illimix',
    loadChildren:
      './buy-pass-illimix/buy-pass-illimix.module#BuyPassIllimixPageModule'
  },
  {
    path: 'buy-sos',
    loadChildren: './buy-sos/buy-sos.module#BuySosPageModule'
  },
  {
    path: 'transfer/:type',
    loadChildren:
      './transfer-credit-bonus-om/transfer-credit-bonus-om.module#TransferCreditBonusOmPageModule'
  },
  {
    path: 'control-center',
    loadChildren: './emergencies/emergencies.module#EmergenciesPageModule'
  },
  {
    path: 'see-solde-om',
    loadChildren: './see-solde-om/see-solde-om.module#SeeSoldeOmPageModule'
  },
  {
    path: 'change-main-phone-number',
    loadChildren:
      './change-main-phone-number/change-main-phone-number.module#ChangeMainPhoneNumberPageModule'
  },
  {
    path: 'my-formule',
    loadChildren: './my-formule/my-formule.module#MyFormulePageModule'
  },
  {
    path: 'sargal-dashboard',
    loadChildren: './sargal/sargal.module#SargalPageModule'
  },
  {
    path: 'sargal-catalogue',
    loadChildren:
      './sargal/components/sargal-catalogue/sargal-catalogue.module#SargalCataloguePageModule'
  },
  { path: 'bills', loadChildren: './bills/bills.module#BillsPageModule' },
  {
    path: 'assistance',
    loadChildren: './assistance/assistance.module#AssistancePageModule'
  },
  {
    path: 'forgotten-password',
    loadChildren:
      './forgotten-password/forgotten-password.module#ForgottenPasswordPageModule'
  },
  {
    path: 'sargal-registration',
    loadChildren:
      './sargal/components/sargal-registration/sargal-registration.module#SargalRegistrationPageModule'
  },
  {
    path: 'contact-us',
    loadChildren:
      './assistance/containers/contact-us/contact-us.module#ContactUsPageModule'
  },
  {
    path: 'apropos',
    loadChildren: './apropos/apropos.module#AproposPageModule'
  },
  {
    path: 'infolegales',
    loadChildren: './infolegales/infolegales.module#InfolegalesPageModule'
  },
  {
    path: 'parrainage',
    loadChildren: './parrainage/parrainage.module#ParrainagePageModule'
  },
  {
    path: 'sargal-status-card',
    loadChildren:
      './sargal-status-card/sargal-status-card.module#SargalStatusCardPageModule'
  },
  {
    path: 'new-registration',
    loadChildren:
      './new-registration/new-registration.module#NewRegistrationPageModule'
  },
  {
    path: 'new-number',
    loadChildren:
      './add-new-phone-number-v2/add-new-phone-number-v2.module#AddNewPhoneNumberV2PageModule'
  },
  {
    path: 'dashboard-home-prepaid',
    loadChildren:
      './dashboard-home-prepaid/dashboard-home-prepaid.module#DashboardHomePrepaidPageModule'
  },
  {
    path: 'dashboard-postpaid',
    loadChildren:
      './dashboard-postpaid/dashboard-postpaid.module#DashboardPostpaidPageModule'
  },
  {
    path: 'dashboard-kirene',
    loadChildren:
      './dashboard-kirene/dashboard-kirene.module#DashboardKirenePageModule'
  },
  {
    path: 'dashboard-postpaid-fixe',
    loadChildren:
      './dashboard-postpaid-fixe/dashboard-postpaid-fixe.module#DashboardPostpaidFixePageModule'
  },
  {
    path: 'dashboard-prepaid-hybrid',
    loadChildren:
      './dashboard-prepaid-hybrid/dashboard-prepaid-hybrid.module#DashboardPrepaidHybridPageModule'
  },
  {
    path: 'my-offer-plans',
    loadChildren:
      './my-offer-plans/my-offer-plans.module#MyOfferPlansPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
