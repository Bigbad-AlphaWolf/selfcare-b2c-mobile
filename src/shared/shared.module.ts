import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoosePaymentModComponent } from './choose-payment-mod/choose-payment-mod.component';
import { OperationValidationComponent } from './operation-validation/operation-validation.component';
import { PinPadComponent } from './pin-pad/pin-pad.component';
import { SelectRecipientComponent } from './select-recipient/select-recipient.component';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ModalSuccessComponent } from './modal-success/modal-success.component';
import { NoOMAccountPopupComponent } from './no-omaccount-popup/no-omaccount-popup.component';
import { CancelOperationPopupComponent } from './cancel-operation-popup/cancel-operation-popup.component';
import { Contacts } from '@ionic-native/contacts';
import { SetOperationAmountComponent } from './set-operation-amount/set-operation-amount.component';
import { HeaderComponent } from './header/header.component';
import { SuccessFailPopupComponent } from './success-fail-popup/success-fail-popup.component';
import { PhonenumberItemComponent } from './phonenumber-item/phonenumber-item.component';
import { SelectNumberPopupComponent } from './select-number-popup/select-number-popup.component';
import { SelectOtherRecipientComponent } from './select-other-recipient/select-other-recipient.component';
import { AvantagePopupComponent } from './avantage-popup/avantage-popup.component';
import { DeleteNumberPopupComponent } from 'src/app/my-account/delete-number-popup/delete-number-popup.component';
import { CguPopupComponent } from './cgu-popup/cgu-popup.component';
import { OperationSuccessOrFailComponent } from './operation-success-or-fail/operation-success-or-fail.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { WelcomePopupComponent } from './welcome-popup/welcome-popup.component';
import { SettingsPopupComponent } from './settings-popup/settings-popup.component';
import { HelpBannerComponent } from 'src/app/emergencies/help-banner/help-banner.component';
import { RouterModule } from '@angular/router';
import { OmButtonComponent } from './om-button/om-button.component';
import { HeaderScrollEffectDirective } from './directives/header-scroll-effect.directive';
import { CommonIssuesComponent } from './common-issues/common-issues.component';
import { MerchantPaymentCodeComponent } from './merchant-payment-code/merchant-payment-code.component';
import { NoOmAccountModalComponent } from './no-om-account-modal/no-om-account-modal.component';
import { PhoneNumberProviderComponent } from 'src/app/components/phone-number-provider/phone-number-provider.component';
import { NumberSelectionComponent } from 'src/app/components/number-selection/number-selection.component';
import { AmountProviderComponent } from 'src/app/components/amount-provider/amount-provider.component';
import { OemIonHeaderParallaxDirective } from 'src/app/directives/oem-ion-header-parallax.directive';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import { FavoriteWoyofalComponent } from 'src/app/components/counter/favorite-woyofal/favorite-woyofal.component';
import { FavoriteMerchantComponent } from 'src/app/components/favorite-merchant/favorite-merchant.component';
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
import { RapidoSoldeComponent } from 'src/app/components/counter/rapido-solde/rapido-solde.component';
import { RattachNumberModalComponent } from 'src/app/pages/rattached-phones-number/components/rattach-number-modal/rattach-number-modal.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { RattachNumberByIdCardComponent } from 'src/app/pages/rattached-phones-number/components/rattach-number-by-id-card/rattach-number-by-id-card.component';
import { RattachNumberByClientCodeComponent } from 'src/app/pages/rattached-phones-number/components/rattach-number-by-client-code/rattach-number-by-client-code.component';
import { MaterialComponentsModule } from 'src/app/material-components/material-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CardRapidoNameModalComponent } from 'src/app/components/card-rapido-name-modal/card-rapido-name-modal.component';
import { IdentifiedNumbersListComponent } from 'src/app/pages/rattached-phones-number/components/identified-numbers-list/identified-numbers-list.component';
import { ChooseRattachementTypeModalComponent } from 'src/app/pages/rattached-phones-number/components/choose-rattachement-type-modal/choose-rattachement-type-modal.component';
import { YesNoModalComponent } from './yes-no-modal/yes-no-modal.component';
import { SimpleOperationSuccessModalComponent } from './simple-operation-success-modal/simple-operation-success-modal.component';
import { BanniereDescriptionPage } from 'src/app/pages/banniere-description/banniere-description.page';
import { PassUsageItemComponent } from './pass-usage-item/pass-usage-item.component';
import { BlockTransferSuccessPopupComponent } from './block-transfer-success-popup/block-transfer-success-popup.component';
import { ItemConsoGaugeComponent } from './item-conso-gauge/item-conso-gauge.component';
import { ConsoNameDisplayPipe } from './pipes/conso-name-display.pipe';
import { ScrollVanishDirective } from 'src/app/directives/scroll-vanish/scroll-vanish.directive';
import { OffreServiceCardV2Component } from './offre-service-card-v2/offre-service-card-v2.component';
import { FaqItemComponent } from './faq-item/faq-item.component';
import { ActionItemComponent } from './action-item/action-item.component';
import { KioskLocatorPopupComponent } from 'src/app/components/kiosk-locator-popup/kiosk-locator-popup.component';
import { OmStatusVisualizationComponent } from './om-status-visualization/om-status-visualization.component';
import { ServicesSearchBarComponent } from './services-search-bar/services-search-bar.component';
import { FormatDataVolume2Pipe } from './pipes/format-data-volume-2.pipe';
import { FormatDuration2Pipe } from './pipes/format-duration-2.pipe';

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
    ChoosePaymentModComponent,
    OperationValidationComponent,
    PinPadComponent,
    ModalSuccessComponent,
    SelectRecipientComponent,
    NoOMAccountPopupComponent,
    CancelOperationPopupComponent,
    SetOperationAmountComponent,
    HeaderComponent,
    SuccessFailPopupComponent,
    PhonenumberItemComponent,
    SelectNumberPopupComponent,
    SelectOtherRecipientComponent,
    AvantagePopupComponent,
    CguPopupComponent,
    OperationSuccessOrFailComponent,
    DeleteNumberPopupComponent,
    WelcomePopupComponent,
    SettingsPopupComponent,
    HelpBannerComponent,
    OmButtonComponent,
    HeaderScrollEffectDirective,
    CommonIssuesComponent,
    MerchantPaymentCodeComponent,
    NoOmAccountModalComponent,
    OemIonHeaderParallaxDirective,
    FavoriteMerchantComponent,
    IbouIonFabComponent,
    RapidoSoldeComponent,
    YesNoModalComponent,
    SimpleOperationSuccessModalComponent,
    BanniereDescriptionPage,
    PassUsageItemComponent,
    BlockTransferSuccessPopupComponent,
    ItemConsoGaugeComponent,
    ConsoNameDisplayPipe,
    ScrollVanishDirective,
    OffreServiceCardV2Component,
    FaqItemComponent,
    ActionItemComponent,
    KioskLocatorPopupComponent,
    OmStatusVisualizationComponent,
    ServicesSearchBarComponent,
    FormatDataVolume2Pipe,
    FormatDuration2Pipe,
  ],
  imports: [
    CommonModule,
    IonicImageLoader,
    RouterModule,
    ComponentsModule,
    MaterialComponentsModule,
    PipesModule,
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
    RattachNumberModalComponent,
    RattachNumberByIdCardComponent,
    RattachNumberByClientCodeComponent,
    CardRapidoNameModalComponent,
    IdentifiedNumbersListComponent,
    ChooseRattachementTypeModalComponent,
    YesNoModalComponent,
    SimpleOperationSuccessModalComponent,
    BanniereDescriptionPage,
    BlockTransferSuccessPopupComponent,
    KioskLocatorPopupComponent,
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
    ChoosePaymentModComponent,
    OperationValidationComponent,
    PinPadComponent,
    ModalSuccessComponent,
    SelectRecipientComponent,
    CancelOperationPopupComponent,
    SetOperationAmountComponent,
    HeaderComponent,
    SuccessFailPopupComponent,
    PhonenumberItemComponent,
    SelectNumberPopupComponent,
    SelectOtherRecipientComponent,
    AvantagePopupComponent,
    OperationSuccessOrFailComponent,
    WelcomePopupComponent,
    SettingsPopupComponent,
    HelpBannerComponent,
    OmButtonComponent,
    HeaderScrollEffectDirective,
    CommonIssuesComponent,
    MerchantPaymentCodeComponent,
    NoOmAccountModalComponent,
    FavoriteMerchantComponent,
    IbouIonFabComponent,
    RapidoSoldeComponent,
    MaterialComponentsModule,
    PipesModule,
    YesNoModalComponent,
    SimpleOperationSuccessModalComponent,
    PassUsageItemComponent,
    BlockTransferSuccessPopupComponent,
    ItemConsoGaugeComponent,
    ConsoNameDisplayPipe,
    ScrollVanishDirective,
    OffreServiceCardV2Component,
    FaqItemComponent,
    ActionItemComponent,
    OmStatusVisualizationComponent,
    ServicesSearchBarComponent,
    FormatDataVolume2Pipe,
    FormatDuration2Pipe,
  ],
  providers: [
    Contacts,
    SocialSharing,
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
