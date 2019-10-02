import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-numero-serie-popup',
  templateUrl: './numero-serie-popup.component.html',
  styleUrls: ['./numero-serie-popup.component.scss']
})
export class NumeroSeriePopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<NumeroSeriePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close(false);
  }
}
