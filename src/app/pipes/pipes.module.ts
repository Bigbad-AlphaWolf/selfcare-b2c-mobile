import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@NgModule({
  declarations: [ FormatCurrencyPipe,
    FormatBillNumPipe, 
    FormatBillDatePipe, 
    PhoneNumberDisplayPipe, 
    FormatSecondDatePipe, 
    GetLabelLigneBillBordereauPipe,
    PassVolumeDisplayPipe,
    FormatSuiviConsoCategoryTitlePipe,
    FormatCalledNumberPipe,
    CodeFormatPipe,
    AcronymPipe ],
  imports: [
    CommonModule
  ],
  exports: [ FormatCurrencyPipe, 
    FormatBillNumPipe, 
    FormatBillDatePipe, 
    PhoneNumberDisplayPipe, 
    FormatSecondDatePipe, 
    GetLabelLigneBillBordereauPipe,
    PassVolumeDisplayPipe,
    FormatSuiviConsoCategoryTitlePipe,
    FormatCalledNumberPipe,
    CodeFormatPipe,
    AcronymPipe ]
})
export class PipesModule { }
