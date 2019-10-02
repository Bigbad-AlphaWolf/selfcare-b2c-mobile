import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-operation-popup',
  templateUrl: './cancel-operation-popup.component.html',
  styleUrls: ['./cancel-operation-popup.component.scss']
})
export class CancelOperationPopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CancelOperationPopupComponent>,
    private router: Router
  ) {}

  ngOnInit() {}

  accept() {
    this.dialogRef.close(true);
    if (!this.data && this.data.canceldialogPageFormule) {
      this.router.navigate(['/dashboard']);
    }
  }
  refused() {
    this.dialogRef.close(false);
  }
}
