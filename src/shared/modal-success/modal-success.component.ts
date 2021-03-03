import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { NavController } from '@ionic/angular';

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
    private navCont: NavController,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
  }

  closeDialog() {
    this.dialogRef.close(false);
    if (this.data.type === 'changePassword' || this.data.type === 'sargal-success' || this.data.type === 'sargal-failed' || this.data.type === 'survey') {
      this.router.navigate(['/dashboard']);
    } else if (this.data.type === 'noOMAccount' || this.data.type === 'rattachment-success' || this.data.type === 'rattachment-failed') {
      this.dialogRef.close();
    } else if (this.data.type !== 'facture' && this.data.type !== 'sargal-already-registered' && this.data.type !== 'rattachment-success' && this.data.type !== 'rattachment-failed') {
      this.navCont.pop();
    }
  }
}
