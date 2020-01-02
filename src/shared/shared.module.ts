import { NgModule } from '@angular/core';
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
  MatMenuModule
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
import { ShareSocialNetworkComponent } from './share-social-network/share-social-network.component';
import { AvantagePopupComponent } from './avantage-popup/avantage-popup.component';
import { DeleteNumberPopupComponent } from 'src/app/my-account/delete-number-popup/delete-number-popup.component';
import { CguPopupComponent } from './cgu-popup/cgu-popup.component';
import { OperationSuccessOrFailComponent } from './operation-success-or-fail/operation-success-or-fail.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { WelcomePopupComponent } from './welcome-popup/welcome-popup.component';
import { SettingsPopupComponent } from './settings-popup/settings-popup.component';
import { HelpBannerComponent } from 'src/app/emergencies/help-banner/help-banner.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
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
    ShareSocialNetworkComponent,
    AvantagePopupComponent,
    CguPopupComponent,
    OperationSuccessOrFailComponent,
    DeleteNumberPopupComponent,
    WelcomePopupComponent,
    SettingsPopupComponent,
    HelpBannerComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
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
    RouterModule
  ],
  entryComponents: [
    ModalSuccessComponent,
    NoOMAccountPopupComponent,
    CancelOperationPopupComponent,
    SelectNumberPopupComponent,
    ShareSocialNetworkComponent,
    AvantagePopupComponent,
    DeleteNumberPopupComponent,
    CguPopupComponent,
    SuccessFailPopupComponent,
    WelcomePopupComponent,
    SettingsPopupComponent
  ],
  exports: [
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
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
    ShareSocialNetworkComponent,
    AvantagePopupComponent,
    OperationSuccessOrFailComponent,
    WelcomePopupComponent,
    SettingsPopupComponent,
    HelpBannerComponent
  ],
  providers: [Contacts, SocialSharing]
})
export class SharedModule {}
