import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material';
import { PhonenumberItemComponent } from './phonenumber-item.component';

@NgModule({
	declarations: [PhonenumberItemComponent],
	imports: [CommonModule, MatCheckboxModule],
	exports: [MatCheckboxModule, PhonenumberItemComponent]
})
export class PhonenumberItemModule {}
