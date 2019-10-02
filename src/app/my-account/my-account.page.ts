import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ChangeAvatarPopupComponent } from './change-avatar-popup/change-avatar-popup.component';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { AccountService } from '../services/account-service/account.service';
import { downloadAvatarEndpoint } from '../services/dashboard-service/dashboard.service';
import {
  NO_AVATAR_ICON_URL,
  isExtensionImageValid,
  isSizeAvatarValid,
  MAX_USER_AVATAR_UPLOAD_SIZE,
  getNOAvatartUrlImage
} from 'src/shared';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss']
})
export class MyAccountPage implements OnInit {
  userInfos: any = {};
  errorMsg: string;
  userImg: any = null;
  userImgName: string;
  imgExtension: string;
  imgSizeinKO: number;
  errorImageFormat = false;
  dialogRef: MatDialogRef<ChangeAvatarPopupComponent, any>;
  dialogSub: Subscription;
  userAvatarUrl: string;
  emailState: number;
  emailTitle: string;

  constructor(
    private authServ: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.userInfos = ls.get('user');
    if (this.userInfos.imageProfil) {
      this.userAvatarUrl = downloadAvatarEndpoint + this.userInfos.imageProfil;
    } else {
      this.userAvatarUrl = NO_AVATAR_ICON_URL;
    }
    this.accountService.userAvatarEmit().subscribe(url => {
      this.userAvatarUrl = url;
    });
  }

  logOut() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  changeAvatar(userImg) {
    this.accountService.openPrevizualisationDialog(userImg, this.imgExtension);
  }

  onAvatarSelected(valueChange: any) {
    this.errorImageFormat = false;
    if (valueChange.target.files.length) {
      this.userImg = valueChange.target.files[0];
      this.imgExtension = this.userImg.type.split('/')[1];
      this.imgSizeinKO = this.userImg.size / 1024;

      if (!isExtensionImageValid(this.imgExtension)) {
        this.errorImageFormat = true;
        this.errorMsg =
          'Les extensions de fichiers acceptés sont: JPG, PNG, JPEG';
      } else if (!isSizeAvatarValid(this.imgSizeinKO)) {
        this.errorImageFormat = true;
        this.errorMsg = `La taille de l'/'image doit être inférieur à ${MAX_USER_AVATAR_UPLOAD_SIZE}Ko`;
      } else {
        this.changeAvatar(this.userImg);
      }
    }
  }

  launchInProgressPage() {
    this.accountService.launchInProgressPage();
  }
  setImgAvatarToDefault() {
    this.userAvatarUrl = getNOAvatartUrlImage();
  }
  goToRattachmentPage() {
    this.router.navigate(['/new-number']);
  }
}
