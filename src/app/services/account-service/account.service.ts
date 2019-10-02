import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { Subject, Subscription } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { AuthenticationService } from '../authentication-service/authentication.service';
import {
  DashboardService,
  downloadAvatarEndpoint
} from '../dashboard-service/dashboard.service';
import { DeleteNumberPopupComponent } from 'src/app/my-account/delete-number-popup/delete-number-popup.component';
import { ChangeAvatarPopupComponent } from 'src/app/my-account/change-avatar-popup/change-avatar-popup.component';
import { InProgressPopupComponent } from 'src/shared/in-progress-popup/in-progress-popup.component';
import { SuccessFailPopupComponent } from 'src/shared/success-fail-popup/success-fail-popup.component';
import { generateUUID } from 'src/shared';
const {
  FILE_SERVICE,
  ACCOUNT_MNGT_SERVICE,
  SERVER_API_URL,
  UAA_SERVICE
} = environment;
const uploadAvatarEndpoint = `${SERVER_API_URL}/${FILE_SERVICE}/api/upload`;
const accountManagementEndPoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/account-management/account-b-2-cs`;
const changePasswordEndpoint = `${SERVER_API_URL}/${UAA_SERVICE}/api/account/change-password`;
const deleteLinkedPhoneNumberEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/rattachement-lignes/delete-multiple`;
const ls = new SecureLS({ encodingType: 'aes' });

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  changePasswordSubject: Subject<any> = new Subject<any>();
  deleteLinkedPhoneNumberSubject: Subject<any> = new Subject<any>();
  userUrlAvatarSubject: Subject<any> = new Subject<any>();

  dialogRef: MatDialogRef<DeleteNumberPopupComponent, any>;
  dialogImgRef: MatDialogRef<ChangeAvatarPopupComponent, any>;
  dialogSub: Subscription;

  userImgName;
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private dashboardservice: DashboardService
  ) {}

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return this.http.post(changePasswordEndpoint, payload);
  }

  changeUserPassword(currentPassword: string, newPassword: string) {
    const changePasswordPayload = { currentPassword, newPassword };
    this.changePassword(changePasswordPayload).subscribe(
      res => {
        this.openSuccessDialog('changePassword');
      },
      err => {
        if (err.status === 400) {
          if (err.error.msg === 'invalidcurrentpassword') {
            // this.error = 'L actuel mot de passe saisi est incorrect';
            this.changePasswordSubject.next(
              'L actuel mot de passe saisi est incorrect'
            );
          } else {
            // this.error = 'Le nouveau mot de passe saisi n est pas autorisé';
            this.changePasswordSubject.next(
              'Le nouveau mot de passe saisi n\'est pas autorisé'
            );
          }
        } else {
          this.changePasswordSubject.next(
            'Une erreur est survenue. Veuillez réessayer plus tard'
          );
        }
      }
    );
  }

  changedPasswordEmit() {
    return this.changePasswordSubject.asObservable();
  }

  openSuccessDialog(type: string) {
    const dialogRef = this.dialog.open(SuccessFailPopupComponent, {
      width: '400px',
      data: { type }
    });
    dialogRef.afterClosed().subscribe(confirmresult => {});
  }

  deleteLinkedPhoneNumbers(listMsisdn: any[]) {
    const login = this.authService.getUserMainPhoneNumber();
    return this.http.post(deleteLinkedPhoneNumberEndpoint, {
      listMsisdn,
      login
    });
  }

  deleteUserLinkedPhoneNumbers(phoneNumbersToDelete: any[]) {
    this.dialogRef = this.dialog.open(DeleteNumberPopupComponent, {
      width: '300px',
      data: { phoneNumbers: phoneNumbersToDelete }
    });
    this.dialogSub = this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteLinkedPhoneNumbers(phoneNumbersToDelete).subscribe(() => {
          this.deleteLinkedPhoneNumberSubject.next();
        });
      }
    });
  }

  deletedPhoneNumbersEmit() {
    return this.deleteLinkedPhoneNumberSubject.asObservable();
  }

  openPrevizualisationDialog(fileInput: any, imgExtension: string) {
    this.dialogImgRef = this.dialog.open(ChangeAvatarPopupComponent, {
      width: '300px',
      data: { selectedImg: fileInput }
    });
    this.dialogSub = this.dialogImgRef.afterClosed().subscribe(res => {
      if (res) {
        // Uncomment upload method when endpoint will be merged
        // this.upload(file);
        const formData = new FormData();
        const imageId = generateUUID();
        this.userImgName = imageId + '.' + imgExtension;
        formData.append('file', fileInput, this.userImgName);
        this.uploadUserAvatar(formData);
      }
    });
  }

  uploadAvatar(formData: any) {
    return this.http.post(`${uploadAvatarEndpoint}`, formData, {
      responseType: 'text'
    });
  }

  uploadUserAvatar(formData: any) {
    this.uploadAvatar(formData).subscribe(() => {
      this.saveUserImgProfil(this.userImgName);
    });
  }

  saveImgProfil(userImageProfil) {
    const userInfos = ls.get('user');
    userInfos.imageProfil = userImageProfil;
    return this.http.put(`${accountManagementEndPoint}`, userInfos);
  }

  saveUserImgProfil(userImageProfil) {
    this.saveImgProfil(userImageProfil).subscribe((response: any) => {
      if (response && response.imageProfil) {
        ls.set('user', response);
        this.changeUserAvatarUrl(downloadAvatarEndpoint + response.imageProfil);
      }
    });
  }

  changeUserAvatarUrl(url) {
    const timeStamp = new Date().getTime();
    this.userUrlAvatarSubject.next(url + '?' + timeStamp);
  }

  userAvatarEmit() {
    return this.userUrlAvatarSubject.asObservable();
  }

  launchInProgressPage() {
    this.dialog.open(InProgressPopupComponent, {
      width: '330px',
      maxWidth: '100%'
    });
  }
}
