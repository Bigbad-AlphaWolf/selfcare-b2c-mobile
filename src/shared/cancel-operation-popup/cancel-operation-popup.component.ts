import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Market} from '@ionic-native/market/ngx';
@Component({
  selector: 'app-cancel-operation-popup',
  templateUrl: './cancel-operation-popup.component.html',
  styleUrls: ['./cancel-operation-popup.component.scss']
})
export class CancelOperationPopupComponent implements OnInit {
  updateMessage = `Votre application n'est pas à jour.
                    Pour profiter des dernières fonctionnalités, Mettez la à jour.`;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CancelOperationPopupComponent>,
    private router: Router,
    private market: Market
  ) {}

  ngOnInit() {}

  accept() {
    this.dialogRef.close(true);
    if (!this.data) {
      this.router.navigate(['/dashboard']);
    }
    if (this.data.updateApp) {
      this.market.open(this.data.updateApp);
    }
  }
  refused() {
    this.dialogRef.close(false);
  }
}
