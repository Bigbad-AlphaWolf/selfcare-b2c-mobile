import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { FormatBillNumPipe } from 'src/shared/pipes/format-bill-num.pipe';
import { FormatBillDatePipe } from 'src/shared/pipes/format-bill-date.pipe';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { FormatSecondDatePipe } from 'src/shared/pipes/format-second-date.pipe';
import { GetLabelLigneBillBordereauPipe } from 'src/shared/pipes/get-label-ligne-bill-bordereau.pipe';
import { PassVolumeDisplayPipe } from 'src/shared/pipes/pass-volume-display.pipe';
import { FormatSuiviConsoCategoryTitlePipe } from 'src/shared/pipes/format-suivi-conso-category-title.pipe';
import { FormatCalledNumberPipe } from 'src/shared/pipes/format-called-number.pipe';
import { CodeFormatPipe } from './code-format/code-format.pipe';
import { AcronymPipe } from 'src/shared/pipes/acronym.pipe';
import { DataVolumePipe } from 'src/shared/pipes/data-volume.pipe';
import { IlliflexVoicePipe } from 'src/shared/pipes/illiflex-voice.pipe';
import { PublicationDateFormatPipe } from 'src/shared/pipes/publication-date-format.pipe';
import { SearchAssistancePipe } from './search-assistance/search-assistance.pipe';
import { DistanceFormatPipe } from 'src/shared/pipes/distance-format.pipe';
import { DisplayFileManagerImagePipe } from 'src/shared/pipes/display-file-manager-image.pipe';
import { GenerateIdForTAPipe } from 'src/shared/pipes/generate-id-for-ta.pipe';
import { StatusBillPaymentPipe } from 'src/shared/pipes/status-bill-payment.pipe';
import { GetBannerTitlePipe } from './get-banner-title/get-banner-title.pipe';
import { GetBannerDescriptionPipe } from './get-banner-description/get-banner-description.pipe';
import { DisplayFileManagerImageForImageLoaderPipe } from 'src/shared/pipes/display-file-manager-image-for-image-loader.pipe';
import { DisplayInfosContactPipe } from 'src/shared/pipes/display-infos-contact.pipe';

@NgModule({
  declarations: [
    FormatCurrencyPipe,
    FormatBillNumPipe,
    FormatBillDatePipe,
    PhoneNumberDisplayPipe,
    FormatSecondDatePipe,
    GetLabelLigneBillBordereauPipe,
    PassVolumeDisplayPipe,
    FormatSuiviConsoCategoryTitlePipe,
    FormatCalledNumberPipe,
    CodeFormatPipe,
    SearchAssistancePipe,
    AcronymPipe,
    DataVolumePipe,
    IlliflexVoicePipe,
    PublicationDateFormatPipe,
    SearchAssistancePipe,
    DistanceFormatPipe,
    DisplayFileManagerImagePipe,
    GenerateIdForTAPipe,
    StatusBillPaymentPipe,
    GetBannerTitlePipe,
    GetBannerDescriptionPipe,
		DisplayFileManagerImageForImageLoaderPipe,
		DisplayInfosContactPipe
  ],
  imports: [CommonModule],
  exports: [
    FormatCurrencyPipe,
    FormatBillNumPipe,
    FormatBillDatePipe,
    PhoneNumberDisplayPipe,
    FormatSecondDatePipe,
    GetLabelLigneBillBordereauPipe,
    PassVolumeDisplayPipe,
    FormatSuiviConsoCategoryTitlePipe,
    FormatCalledNumberPipe,
    CodeFormatPipe,
    SearchAssistancePipe,
    AcronymPipe,
    DataVolumePipe,
    IlliflexVoicePipe,
    PublicationDateFormatPipe,
    DistanceFormatPipe,
    DisplayFileManagerImagePipe,
    GenerateIdForTAPipe,
    StatusBillPaymentPipe,
    GetBannerTitlePipe,
    GetBannerDescriptionPipe,
		DisplayFileManagerImageForImageLoaderPipe,
		DisplayInfosContactPipe
  ],
  providers: [PassVolumeDisplayPipe, DatePipe],
})
export class PipesModule {}
