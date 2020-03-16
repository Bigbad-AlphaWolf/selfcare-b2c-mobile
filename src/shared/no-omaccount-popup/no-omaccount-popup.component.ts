import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-omaccount-popup',
  templateUrl: './no-omaccount-popup.component.html',
  styleUrls: ['./no-omaccount-popup.component.scss']
})
export class NoOMAccountPopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NoOMAccountPopupComponent, any>,
    private router: Router
  ) {}

  ngOnInit() {}

  close(accepted?: boolean) {
    if (this.data && this.data.otherDestinataire) {
      this.dialogRef.close(accepted);
    } else {
      this.dialogRef.close();
      this.router.navigate(['/dashboard']);
    }
  }

  goToPageOpenAccount() {
    if (this.data.pageDesktop) {
      this.close();
      this.router.navigate(['/dashboard/orange-money-desktop/creation-compte']);
    } else {
      this.close();
      this.router.navigate(['/control-center/operation-om/creation-compte']);
    }
  }
}
