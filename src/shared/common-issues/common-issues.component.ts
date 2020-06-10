import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { HelpModalDefaultContent } from '..';
import { Router } from '@angular/router';
@Component({
  selector: 'app-common-issues',
  templateUrl: './common-issues.component.html',
  styleUrls: ['./common-issues.component.scss'],
})
export class CommonIssuesComponent implements OnInit {
  popupTitle: string;
  options: {
    title: string;
    subtitle: string;
    type?: string;
    url?: string;
    action?: string;
    icon?: string;
    subOptions?: { title: string; subtitle: string; icon?: string }[];
  }[];
  showSousOption: boolean;
  type: string;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<CommonIssuesComponent>,
    private ngZone: NgZone,
    private router: Router
  ) {
    if (data) {
      this.options = data.options;
      this.popupTitle = data.popupTitle;
    }
  }
  ngOnInit() {}

  close(message?: string) {
    this.ngZone.run(() => {
      this.bottomSheetRef.dismiss(message);
    });
  }

  goSuboption(option: {
    title: string;
    subtitle: string;
    type: string;
    url?: string;
    action?: string;
    subOptions: { title: string; subtitle: string }[];
  }) {
    if (!this.showSousOption) {
      this.options = option.subOptions;
      this.showSousOption = true;
      this.popupTitle = option.title;
      this.type = option.type;
    }
  }

  goBack() {
    this.showSousOption = false;
    this.options = HelpModalDefaultContent.options;
    this.popupTitle = HelpModalDefaultContent.popupTitle;
    this.type = null;
  }

  continue() {
    this.bottomSheetRef.dismiss();
    switch (this.type) {
      case 'ERROR_AUTH_IMP':
        this.router.navigate(['/new-registration']);
        break;
      case 'FORGOT_PWD':
        this.router.navigate(['/forgotten-password']);
        break;
      case 'LOGIN':
        this.router.navigate(['/login']);
        break;
      case 'APN':
        break;
      default:
        break;
    }
  }
}
