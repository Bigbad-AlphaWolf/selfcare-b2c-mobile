import { Component, OnInit, OnDestroy } from '@angular/core';
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
  getNOAvatartUrlImage,
} from 'src/shared';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { InProgressPopupComponent } from 'src/shared/in-progress-popup/in-progress-popup.component';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
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
  dialogRefInProgress: MatDialogRef<InProgressPopupComponent, any>;
  dialogSub: Subscription;
  userAvatarUrl: string;
  emailState: number;
  emailTitle: string;
  hasLoadedAvatar = true;
  hasErrorLoadingAvatar: boolean;
  constructor(
    private authServ: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private accountService: AccountService,
    private followAnalyticsService: FollowAnalyticsService,
    private bsService: BottomSheetService
  ) {}

  ngOnInit() {
    this.userInfos = ls.get('user');
    if (this.userInfos.imageProfil) {
      this.userAvatarUrl = downloadAvatarEndpoint + this.userInfos.imageProfil;
    } else {
      this.userAvatarUrl = NO_AVATAR_ICON_URL;
    }
    this.accountService.userAvatarEmit().subscribe((url) => {
      this.userAvatarUrl = url;
    });
  }

  logOut() {
    this.followAnalyticsService.registerEventFollow(
      'Deconnexion',
      'event',
      'clicked'
    );
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  changeAvatar(userImg) {
    this.accountService.openPrevizualisationDialog(userImg, this.imgExtension);
    this.accountService.getStatusAvatarLoaded().subscribe((res:{status: boolean, error: boolean})=>{
      this.hasLoadedAvatar = res.status;
      this.hasErrorLoadingAvatar = res.error;
    })
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
    this.dialog.open(InProgressPopupComponent, {
      width: '330px',
      maxWidth: '100%',
      hasBackdrop: true,
    });
  }
  setImgAvatarToDefault() {
    this.userAvatarUrl = getNOAvatartUrlImage();
  }
  goToRattachmentPage() {
    this.bsService.openRattacheNumberModal();
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_rattacher_une_ligne',
      'event',
      'clicked'
    );
  }
}
