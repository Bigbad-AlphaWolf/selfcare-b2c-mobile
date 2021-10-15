import {Component, OnInit, Inject, NgZone} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';

@Component({
  selector: 'app-settings-popup',
  templateUrl: './settings-popup.component.html',
  styleUrls: ['./settings-popup.component.scss']
})
export class SettingsPopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SettingsPopupComponent>,
    private openNativeSettings: OpenNativeSettings,
    private ngZone: NgZone
  ) {}

  ngOnInit() {}

  goSettings() {
    this.ngZone.run(() => {
      this.dialogRef.close(true);
      this.openNativeSettings.open('settings').then(res => {}).catch(err => {});
    });
  }

  close() {
    this.ngZone.run(() => {
      this.dialogRef.close(false);
    });
  }
}
