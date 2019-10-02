import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-avatar-popup',
  templateUrl: './change-avatar-popup.component.html',
  styleUrls: ['./change-avatar-popup.component.scss']
})
export class ChangeAvatarPopupComponent implements OnInit {
  imgSrc: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangeAvatarPopupComponent>
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }
  ngOnInit() {
    const fileReader = new FileReader();
    if (this.data.selectedImg) {
      fileReader.readAsDataURL(this.data.selectedImg);
      fileReader.onload = () => {
        this.imgSrc = fileReader.result;
      };
    }
  }
}
