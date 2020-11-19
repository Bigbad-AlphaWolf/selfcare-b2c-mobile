import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatFormFieldModule, MatBottomSheetModule, MatButtonModule, MatCardModule, MatRippleModule, MatButtonToggleModule, MatInputModule, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatIconModule, MatRadioModule, MatMenuModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
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
    MatFormFieldModule
  ]
})
export class MaterialComponentsModule { }
