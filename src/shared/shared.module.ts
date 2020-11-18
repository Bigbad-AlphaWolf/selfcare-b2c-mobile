import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivationOmComponent } from './activation-om/activation-om.component';
import { ChoosePaymentModComponent } from './choose-payment-mod/choose-payment-mod.component';
import { OperationValidationComponent } from './operation-validation/operation-validation.component';
import { PinPadComponent } from './pin-pad/pin-pad.component';
import { SelectRecipientComponent } from './select-recipient/select-recipient.component';
import {
  MatProgressSpinnerModule,
  MatInputModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatOptionModule,
  MatIconModule,
  MatDialogModule,
  MatCheckboxModule,
  MatRadioModule,
  MatMenuModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatButtonModule,
  MatCardModule,
  MatRippleModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material';
import { ModalSuccessComponent } from './modal-success/modal-success.component';
import { ChatMsgLineComponent } from './chat-msg-line/chat-msg-line.component';
import { FormatBillNumPipe } from './pipes/format-bill-num.pipe';
import { FormatBillDatePipe } from './pipes/format-bill-date.pipe';
import { FormatCurrencyPipe } from './pipes/format-currency.pipe';
import { NoOMAccountPopupComponent } from './no-omaccount-popup/no-omaccount-popup.component';
import { CancelOperationPopupComponent } from './cancel-operation-popup/cancel-operation-popup.component';
import { PhoneNumberDisplayPipe } from './pipes/phone-number-display.pipe';
import { Contacts } from '@ionic-native/contacts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetOperationAmountComponent } from './set-operation-amount/set-operation-amount.component';
import { HeaderComponent } from './header/header.component';
import { FormatSecondDatePipe } from './pipes/format-second-date.pipe';
import { SuccessFailPopupComponent } from './success-fail-popup/success-fail-popup.component';
import { PhonenumberItemComponent } from './phonenumber-item/phonenumber-item.component';
import { SelectNumberPopupComponent } from './select-number-popup/select-number-popup.component';
import { SelectOtherRecipientComponent } from './select-other-recipient/select-other-recipient.component';
import { GetLabelLigneBillBordereauPipe } from './pipes/get-label-ligne-bill-bordereau.pipe';
import { AvantagePopupComponent } from './avantage-popup/avantage-popup.component';
import { DeleteNumberPopupComponent } from 'src/app/my-account/delete-number-popup/delete-number-popup.component';
import { CguPopupComponent } from './cgu-popup/cgu-popup.component';
import { OperationSuccessOrFailComponent } from './operation-success-or-fail/operation-success-or-fail.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { WelcomePopupComponent } from './welcome-popup/welcome-popup.component';
import { SettingsPopupComponent } from './settings-popup/settings-popup.component';
import { HelpBannerComponent } from 'src/app/emergencies/help-banner/help-banner.component';
import { RouterModule } from '@angular/router';
import { PassVolumeDisplayPipe } from './pipes/pass-volume-display.pipe';
import { OmButtonComponent } from './om-button/om-button.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { FormatSuiviConsoCategoryTitlePipe } from './pipes/format-suivi-conso-category-title.pipe';
import { FormatCalledNumberPipe } from './pipes/format-called-number.pipe';
import { HeaderScrollEffectDirective } from './directives/header-scroll-effect.directive';
import { ItemPassIllimixComponent } from './item-pass-illimix/item-pass-illimix.component';
import { ItemPassInternetComponent } from './item-pass-internet/item-pass-internet.component';
import { CommonIssuesComponent } from './common-issues/common-issues.component';
import { MerchantPaymentCodeComponent } from './merchant-payment-code/merchant-payment-code.component';
import { NoOmAccountModalComponent } from './no-om-account-modal/no-om-account-modal.component';
import { ItemRechargeCreditComponent } from './item-recharge-credit/item-recharge-credit.component';
import { PhoneNumberProviderComponent } from 'src/app/components/phone-number-provider/phone-number-provider.component';
import { NumberSelectionComponent } from 'src/app/components/number-selection/number-selection.component';
import { AmountProviderComponent } from 'src/app/components/amount-provider/amount-provider.component';
import { OemIonHeaderParallaxDirective } from 'src/app/directives/oem-ion-header-parallax.directive';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import { FavoriteWoyofalComponent } from 'src/app/components/counter/favorite-woyofal/favorite-woyofal.component';
import { CodeFormatPipe } from 'src/app/pipes/code-format.pipe';
import { ItemOfferPlanComponent } from './item-offer-plan/item-offer-plan.component';
import { FavoriteMerchantComponent } from 'src/app/components/favorite-merchant/favorite-merchant.component';
import { AcronymPipe } from './pipes/acronym.pipe';
import { SelectBeneficiaryPopUpComponent } from 'src/app/transfert-hub-services/components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { OemOperationsComponent } from 'src/app/components/oem-operations/oem-operations.component';
import { NoIonSelectArrowDirective } from 'src/app/directives/no-ion-select-arrow/no-ion-select-arrow.directive';
import { InvoiceCardComponent } from 'src/app/components/invoice-card/invoice-card.component';
import { LinesComponent } from 'src/app/components/lines/lines.component';
import { IbouIonFabComponent } from './ibou-ion-fab/ibou-ion-fab.component';
import { RequestCardComponent } from 'src/app/components/request-card/request-card.component';
import { BanniereComponent } from 'src/app/components/banniere/banniere.component';
import { OffreServiceCardComponent } from 'src/app/components/offre-service-card/offre-service-card.component';
import { IonicImageLoader } from 'ionic-image-loader';
import { RapidoSelectionComponent } from 'src/app/components/counter/rapido-selection/rapido-selection.component';
import { FavoriteRapidoComponent } from 'src/app/components/counter/favorite-rapido/favorite-rapido.component';
import { DalalCardItemComponent } from './dalal-card-item/dalal-card-item.component';
import { RapidoSoldeComponent } from 'src/app/components/counter/rapido-solde/rapido-solde.component';
import { ItemIlliflexComponent } from './illiflex-item/item-illiflex/item-illiflex.component';
import { DataVolumePipe } from './pipes/data-volume.pipe';
import { IlliflexVoicePipe } from './pipes/illiflex-voice.pipe';

@NgModule({
  declarations: [
    LinesComponent,
    BanniereComponent,
    OffreServiceCardComponent,
    InvoiceCardComponent,
    RequestCardComponent,
    NoIonSelectArrowDirective,
    OemOperationsComponent,
    SelectBeneficiaryPopUpComponent,
    RapidoSelectionComponent,
    WoyofalSelectionComponent,
    FavoriteWoyofalComponent,
    FavoriteRapidoComponent,
    PhoneNumberProviderComponent,
    NumberSelectionComponent,
    AmountProviderComponent,
    ActivationOmComponent,
    ChoosePaymentModComponent,
    OperationValidationComponent,
    PinPadComponent,
    ModalSuccessComponent,
    SelectRecipientComponent,
    FormatBillNumPipe,
    FormatBillDatePipe,
    FormatCurrencyPipe,
    ChatMsgLineComponent,
    NoOMAccountPopupComponent,
    CancelOperationPopupComponent,
    PhoneNumberDisplayPipe,
    SetOperationAmountComponent,
    HeaderComponent,
    FormatSecondDatePipe,
    SuccessFailPopupComponent,
    PhonenumberItemComponent,
    SelectNumberPopupComponent,
    SelectOtherRecipientComponent,
    GetLabelLigneBillBordereauPipe,
    AvantagePopupComponent,
    CguPopupComponent,
    OperationSuccessOrFailComponent,
    DeleteNumberPopupComponent,
    WelcomePopupComponent,
    SettingsPopupComponent,
    HelpBannerComponent,
    PassVolumeDisplayPipe,
    OmButtonComponent,
    DashboardHeaderComponent,
    FormatSuiviConsoCategoryTitlePipe,
    FormatCalledNumberPipe,
    HeaderScrollEffectDirective,
    ItemPassIllimixComponent,
    ItemPassInternetComponent,
    CommonIssuesComponent,
    MerchantPaymentCodeComponent,
    NoOmAccountModalComponent,
    ItemRechargeCreditComponent,
    OemIonHeaderParallaxDirective,
    ItemOfferPlanComponent,
    CodeFormatPipe,
    FavoriteMerchantComponent,
    AcronymPipe,
    IbouIonFabComponent,
    DalalCardItemComponent,
    RapidoSoldeComponent,
    ItemIlliflexComponent,
    DataVolumePipe,
    IlliflexVoicePipe,
  ],
  imports: [
    CommonModule,
    IonicImageLoader,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatRadioModule,
    MatMenuModule,
    RouterModule,
  ],
  entryComponents: [
    LinesComponent,
    SelectBeneficiaryPopUpComponent,
    NumberSelectionComponent,
    FavoriteWoyofalComponent,
    FavoriteRapidoComponent,
    WoyofalSelectionComponent,
    RapidoSelectionComponent,
    ModalSuccessComponent,
    NoOMAccountPopupComponent,
    CancelOperationPopupComponent,
    SelectNumberPopupComponent,
    AvantagePopupComponent,
    DeleteNumberPopupComponent,
    CguPopupComponent,
    SuccessFailPopupComponent,
    WelcomePopupComponent,
    SettingsPopupComponent,
    CommonIssuesComponent,
    MerchantPaymentCodeComponent,
    NoOmAccountModalComponent,
    FavoriteMerchantComponent,
    RapidoSoldeComponent,
  ],
  exports: [
    BanniereComponent,
    OffreServiceCardComponent,
    InvoiceCardComponent,
    RequestCardComponent,
    LinesComponent,
    NoIonSelectArrowDirective,
    OemOperationsComponent,
    SelectBeneficiaryPopUpComponent,
    WoyofalSelectionComponent,
    RapidoSelectionComponent,
    FavoriteWoyofalComponent,
    FavoriteRapidoComponent,
    OemIonHeaderParallaxDirective,
    PhoneNumberProviderComponent,
    NumberSelectionComponent,
    AmountProviderComponent,
    MatInputModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatMenuModule,
    MatRippleModule,
    ReactiveFormsModule,
    ActivationOmComponent,
    ChoosePaymentModComponent,
    OperationValidationComponent,
    PinPadComponent,
    ModalSuccessComponent,
    SelectRecipientComponent,
    FormatBillNumPipe,
    FormatBillDatePipe,
    FormatCurrencyPipe,
    GetLabelLigneBillBordereauPipe,
    FormatSuiviConsoCategoryTitlePipe,
    ChatMsgLineComponent,
    CancelOperationPopupComponent,
    PhoneNumberDisplayPipe,
    SetOperationAmountComponent,
    HeaderComponent,
    FormatSecondDatePipe,
    SuccessFailPopupComponent,
    PhonenumberItemComponent,
    SelectNumberPopupComponent,
    SelectOtherRecipientComponent,
    AvantagePopupComponent,
    OperationSuccessOrFailComponent,
    WelcomePopupComponent,
    SettingsPopupComponent,
    HelpBannerComponent,
    PassVolumeDisplayPipe,
    CodeFormatPipe,
    OmButtonComponent,
    DashboardHeaderComponent,
    FormatCalledNumberPipe,
    HeaderScrollEffectDirective,
    ItemPassIllimixComponent,
    ItemPassInternetComponent,
    CommonIssuesComponent,
    MerchantPaymentCodeComponent,
    NoOmAccountModalComponent,
    ItemRechargeCreditComponent,
    ItemOfferPlanComponent,
    FavoriteMerchantComponent,
    IbouIonFabComponent,
    DalalCardItemComponent,
    RapidoSoldeComponent,
    ItemIlliflexComponent,
    DataVolumePipe,
    IlliflexVoicePipe,
  ],
  providers: [
    Contacts,
    SocialSharing,
    PassVolumeDisplayPipe,
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
