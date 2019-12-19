import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-settings-popup',
  templateUrl: './settings-popup.component.html',
  styleUrls: ['./settings-popup.component.scss']
})
export class SettingsPopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SettingsPopupComponent>
  ) {}

  ngOnInit() {}

  goSettings() {
    this.dialogRef.close('SETTINGS');
  }

  close() {
    this.dialogRef.close();
  }
}
