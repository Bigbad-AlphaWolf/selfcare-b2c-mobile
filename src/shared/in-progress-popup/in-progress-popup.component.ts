import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-in-progress-popup',
  templateUrl: './in-progress-popup.component.html',
  styleUrls: ['./in-progress-popup.component.scss']
})
export class InProgressPopupComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<InProgressPopupComponent>) {}

  ngOnInit() {}

  cancelDialog() {
    this.dialogRef.close(false);
  }
}
