import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { of, Subject, Subscription } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService, downloadAvatarEndpoint } from '../dashboard-service/dashboard.service';
import { DeleteNumberPopupComponent } from 'src/app/my-account/delete-number-popup/delete-number-popup.component';
import { ChangeAvatarPopupComponent } from 'src/app/my-account/change-avatar-popup/change-avatar-popup.component';
import { InProgressPopupComponent } from 'src/shared/in-progress-popup/in-progress-popup.component';
import { SuccessFailPopupComponent } from 'src/shared/success-fail-popup/success-fail-popup.component';
import { generateUUID, OPERATION_CONFIRM_DELETE_RATTACH_NUMBER } from 'src/shared';
import { ACCOUNT_RATTACH_NUMBER_BY_ID_CARD_STATUS_ENDPOINT, ACCOUNT_IDENTIFIED_NUMBERS_ENDPOINT, CHECK_NUMBER_IS_CORPORATE_ENDPOINT } from '../utils/account.endpoints';
import { catchError, map, take, tap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/shared/yes-no-modal/yes-no-modal.component';
import { OemLoggingService } from '../oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
const { FILE_SERVICE, ACCOUNT_MNGT_SERVICE, SERVER_API_URL, UAA_SERVICE } = environment;
const uploadAvatarEndpoint = `${SERVER_API_URL}/${FILE_SERVICE}/api/upload`;
const accountManagementEndPoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/account-management/account-b-2-cs`;
const changePasswordEndpoint = `${SERVER_API_URL}/api/account/b2c/change-password`;
const deleteLinkedPhoneNumberEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/rattachement-lignes/delete-multiple`;
const ls = new SecureLS({ encodingType: 'aes' });

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  changePasswordSubject: Subject<any> = new Subject<any>();
  deleteLinkedPhoneNumberSubject: Subject<any> = new Subject<any>();
  userUrlAvatarSubject: Subject<any> = new Subject<any>();
  dialogRef: MatDialogRef<DeleteNumberPopupComponent, any>;
  dialogImgRef: MatDialogRef<ChangeAvatarPopupComponent, any>;
  dialogSub: Subscription;
  userImgName;
  updateAvatarSubject: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private oemLoggingService: OemLoggingService,
    private dashbServ: DashboardService,
    private modal: ModalController
  ) {}

  changePassword(payload: { login: string; newPassword: string }) {
    return this.http.post(changePasswordEndpoint, payload);
  }

  changeUserPassword(login: string, newPassword: string) {
    const changePasswordPayload = { login, newPassword };
    this.changePassword(changePasswordPayload).subscribe(
      res => {
        this.openSuccessDialog('changePassword');
      },
      err => {
        if (err.status === 400) {
          if (err.error.msg === 'invalidcurrentpassword') {
            // this.error = 'L actuel mot de passe saisi est incorrect';
            this.changePasswordSubject.next('L actuel mot de passe saisi est incorrect');
          } else {
            // this.error = 'Le nouveau mot de passe saisi n est pas autorisé';
            this.changePasswordSubject.next("Le nouveau mot de passe saisi n'est pas autorisé");
          }
        } else {
          this.changePasswordSubject.next('Une erreur est survenue. Veuillez réessayer plus tard');
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
      data: { type },
    });
    dialogRef.afterClosed().subscribe(confirmresult => {});
  }

  deleteLinkedPhoneNumbers(listMsisdn: any[]) {
    const login = this.authService.getUserMainPhoneNumber();
    return this.http.post(deleteLinkedPhoneNumberEndpoint, {
      listMsisdn,
      login,
    });
  }

  async deleteUserLinkedPhoneNumbers(phoneNumbersToDelete: string[]) {
    const modal = await this.modal.create({
      component: YesNoModalComponent,
      componentProps: {
        typeModal: OPERATION_CONFIRM_DELETE_RATTACH_NUMBER,
        numero: phoneNumbersToDelete[0],
      },
      cssClass: 'select-recipient-modal',
    });

    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res.continue) {
        this.deleteLinkedPhoneNumbers(phoneNumbersToDelete).subscribe(
          () => {
            this.deleteLinkedPhoneNumberSubject.next();
            this.dashbServ.attachedNumbersChangedSubject.next();
            this.oemLoggingService.registerEvent('delete_phoneNumber_success', convertObjectToLoggingPayload({ phoneNumbersToDelete }));
          },
          () => {
            this.oemLoggingService.registerEvent('delete_phoneNumber_error', convertObjectToLoggingPayload({ phoneNumbersToDelete }));
          }
        );
      }
    });
    return await modal.present();
  }

  deletedPhoneNumbersEmit() {
    return this.deleteLinkedPhoneNumberSubject.asObservable();
  }

  openPrevizualisationDialog(fileInput: any, imgExtension: string) {
    this.dialogImgRef = this.dialog.open(ChangeAvatarPopupComponent, {
      width: '300px',
      data: { selectedImg: fileInput },
    });
    this.dialogSub = this.dialogImgRef.afterClosed().subscribe(res => {
      if (res) {
        // Uncomment upload method when endpoint will be merged
        // this.upload(file);
        const formData = new FormData();
        const imageId = generateUUID();
        this.userImgName = imageId + '.' + imgExtension;
        formData.append('file', fileInput, this.userImgName);
        this.updateAvatarSubject.next({ status: false, error: false });
        this.uploadUserAvatar(formData);
      }
    });
  }

  uploadAvatar(formData: any) {
    return this.http.post(`${uploadAvatarEndpoint}`, formData, {
      responseType: 'text',
    });
  }

  uploadUserAvatar(formData: any) {
    this.uploadAvatar(formData).subscribe(
      () => {
        this.saveUserImgProfil(this.userImgName);
      },
      () => {
        this.updateAvatarSubject.next({ status: true, error: true });
      }
    );
  }

  getStatusAvatarLoaded() {
    return this.updateAvatarSubject.asObservable();
  }

  saveImgProfil(userImageProfil) {
    const userInfos = ls.get('user');
    userInfos.imageProfil = userImageProfil;
    return this.http.put(`${accountManagementEndPoint}`, userInfos);
  }

  saveUserImgProfil(userImageProfil) {
    this.saveImgProfil(userImageProfil).subscribe(
      (response: any) => {
        this.updateAvatarSubject.next({ status: true, error: false });
        if (response && response.imageProfil) {
          ls.set('user', response);
          this.changeUserAvatarUrl(downloadAvatarEndpoint + response.imageProfil);
        }
      },
      () => {
        this.updateAvatarSubject.next({ status: true, error: true });
      }
    );
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
      maxWidth: '100%',
      hasBackdrop: true,
    });
  }

  attachNumberByIdCard(data: { identificationId: string; login: string; numero: string }) {
    const payload = { identificationId: data.identificationId, login: data.login, numero: data.numero, typeNumero: 'MOBILE' };
    return this.http.post(ACCOUNT_RATTACH_NUMBER_BY_ID_CARD_STATUS_ENDPOINT, payload).pipe(
      tap(r => {
        DashboardService.rattachedNumbers = null;
        this.dashbServ.attachedNumbers().pipe(take(1)).subscribe();
        this.dashbServ.attachedNumbersChangedSubject.next();
      })
    );
  }

  fetchIdentifiedNumbers() {
    const mainNumber = this.dashbServ.getMainPhoneNumber();
    return this.http.get(`${ACCOUNT_IDENTIFIED_NUMBERS_ENDPOINT}/${mainNumber}`).pipe(
      map((list: string[]) => {
        return list.filter((val: string) => val !== mainNumber);
      })
    );
  }
  checkIsCoorporateNumber(msisdn: string) {
    return this.http.get(`${CHECK_NUMBER_IS_CORPORATE_ENDPOINT}/${msisdn}`).pipe(
      catchError(_ => {
        return of(false);
      })
    );
  }
}
