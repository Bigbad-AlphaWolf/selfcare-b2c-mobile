import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { CommonIssuesComponent } from './components/common-issues/common-issues.component';
import { MatBottomSheetModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatBottomSheetModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  entryComponents: [CommonIssuesComponent],
  declarations: [HomePage, OnBoardingComponent, CommonIssuesComponent]
})
export class HomePageModule {}
