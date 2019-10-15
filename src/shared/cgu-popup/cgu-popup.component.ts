import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CGU } from 'src/app/register';

@Component({
  selector: 'app-cgu-popup',
  templateUrl: './cgu-popup.component.html',
  styleUrls: ['./cgu-popup.component.scss']
})
export class CguPopupComponent implements OnInit, OnDestroy {
  CGU_ARTICLES = CGU;
  acceptedCGU;
  constructor(
    public dialogRef: MatDialogRef<CguPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}

  acceptCgu() {
    this.acceptedCGU = true;
    this.dialogRef.close(true);
  }

  ngOnDestroy() {
    if (!this.acceptedCGU) {
      this.dialogRef.close();
    }
  }
}
