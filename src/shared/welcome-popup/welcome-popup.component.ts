import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WelcomeStatusModel } from '..';

@Component({
  selector: 'app-welcome-popup',
  templateUrl: './welcome-popup.component.html',
  styleUrls: ['./welcome-popup.component.scss']
})
export class WelcomePopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WelcomeStatusModel,
    private dialogRef: MatDialogRef<WelcomePopupComponent>
  ) {}

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
