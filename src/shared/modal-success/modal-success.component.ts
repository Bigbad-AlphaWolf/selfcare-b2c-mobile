import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.scss']
})
export class ModalSuccessComponent implements OnInit {
  currentNumber;

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<ModalSuccessComponent>,
    public dashboardService: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
  }

  closeDialog() {
    this.dialogRef.close(false);
    if (this.data.type === 'changePassword') {
      this.router.navigate(['/dashboard']);
    } else if (this.data.type === 'noOMAccount') {
      this.dialogRef.close();
    } else if (this.data.type !== 'facture') {
      this.router.navigate(['/dashboard/emergencies']);
    }
  }
}
