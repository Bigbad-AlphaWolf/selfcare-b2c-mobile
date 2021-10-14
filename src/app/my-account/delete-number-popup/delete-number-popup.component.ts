import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-number-popup',
  templateUrl: './delete-number-popup.component.html',
  styleUrls: ['./delete-number-popup.component.scss']
})
export class DeleteNumberPopupComponent implements OnInit {
  phoneNumbersToDelete = [];
  constructor(public dialogRef: MatDialogRef<DeleteNumberPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.phoneNumbersToDelete = this.data.phoneNumbers;
  }
  accept() {
    this.dialogRef.close(true);
  }
  refused() {
    this.dialogRef.close(false);
  }
}
