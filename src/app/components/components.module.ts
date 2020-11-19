import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemRattachedNumberComponent } from './item-rattached-number/item-rattached-number.component';
import { SharedModule } from 'src/shared/shared.module';
import { RattachNumberModalComponent } from './rattach-number-modal/rattach-number-modal.component';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { IonicModule } from '@ionic/angular';
import { RattachNumberByIdCardComponent } from './rattach-number-by-id-card/rattach-number-by-id-card.component';
import { RattachNumberByClientCodeComponent } from './rattach-number-by-client-code/rattach-number-by-client-code.component';

@NgModule({
  declarations: [
    ItemRattachedNumberComponent,
    RattachNumberModalComponent,
    RattachNumberByIdCardComponent,
    RattachNumberByClientCodeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    IonicModule
  ],
  exports: [ItemRattachedNumberComponent,RattachNumberModalComponent,RattachNumberByIdCardComponent,RattachNumberByClientCodeComponent ],
  entryComponents: [RattachNumberModalComponent],
  schemas: []
})
export class ComponentsModule { }
