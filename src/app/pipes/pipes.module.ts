import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';

@NgModule({
  declarations: [ FormatCurrencyPipe ],
  imports: [
    CommonModule
  ],
  exports: [ FormatCurrencyPipe ]
})
export class PipesModule { }
