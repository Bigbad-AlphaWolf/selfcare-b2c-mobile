import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { HelpModalDefaultContent } from '..';
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
    subOptions?: { title: string; subtitle: string }[];
  }[];
  showSousOption: boolean;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<CommonIssuesComponent>,
    private ngZone: NgZone
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
    }
  }

  goBack() {
    this.showSousOption = false;
    this.options = HelpModalDefaultContent.options;
    this.popupTitle = HelpModalDefaultContent.popupTitle;
  }
}
