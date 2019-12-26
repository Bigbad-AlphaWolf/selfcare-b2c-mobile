import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency-service/emergency.service';
import { DashboardService, downloadEndpoint } from 'src/app/services/dashboard-service/dashboard.service';
import {
  REGEX_EMAIL,
  MAX_USER_FILE_UPLOAD_SIZE,
  getOperationCodeActionOM,
  FILENAME_OPEN_OM_ACCOUNT,
  FILENAME_DEPLAFONNEMENT_OM_ACCOUNT,
  FILENAME_ERROR_TRANSACTION_OM
} from 'src/shared';
import { LogModel } from 'src/app/services/orange-money-service';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { CancelOperationPopupComponent } from 'src/shared/cancel-operation-popup/cancel-operation-popup.component';
import { environment } from 'src/environments/environment';
const { SERVER_API_URL } = environment;
import * as SecureLS from 'secure-ls';

import { HttpClient } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
const ls = new SecureLS({ encodingType: 'aes' });
const logEndpoint = `${SERVER_API_URL}/management/selfcare-logs-file`;

@Component({
  selector: 'app-orange-money',
  templateUrl: './orange-money.component.html',
  styleUrls: ['./orange-money.component.scss']
})
export class OrangeMoneyComponent implements OnInit {
  form: FormGroup;
  uploadedCNIFrontName;
  uploadedCNIBackName;
  uploadedFormName;
  formSizeError = false;
  cniFrontSizeError = false;
  cniBackSizeError = false;
  cniFrontExtError = false;
  cniBackExtError = false;
  formExtError = false;
  userNumber;
  error;
  type;
  formulaireToUpload: any; // File;
  cn1ToUpload: any; // File;
  cn2ToUpload: any; // File;
  userInfos: any;
  loader: boolean;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private emerg: EmergencyService,
    private dashb: DashboardService,
    private httpClient: HttpClient,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.userInfos = ls.get('user');
    this.form = this.fb.group({
      mail: [
        this.userInfos.email && !this.invalideEmail(this.userInfos.email) ? this.userInfos.email : null,
        [Validators.required, Validators.pattern(REGEX_EMAIL)]
      ],
      form: [null, [Validators.required]],
      recto: [null, [Validators.required]],
      verso: [null]
    });
    this.userNumber = this.dashb.getCurrentPhoneNumber();
    this.type = this.route.snapshot.paramMap.get('type');
  }

  // Verify if user mail is the default one
  invalideEmail(email: string) {
    return email.match('@selfcare.com');
  }

  checkExtension(filename: string, step: string) {
    const regExtension = /(png|jpg|jpeg|pdf|doc|docx)$/;
    if (filename.toLowerCase().match(regExtension)) {
      switch (step) {
        case 'cni1':
          this.cniFrontExtError = false;
          break;
        case 'cni2':
          this.cniBackExtError = false;
          break;
        case 'form':
          this.formExtError = false;
          break;
      }
      return true;
    } else {
      switch (step) {
        case 'cni1':
          this.cniFrontExtError = true;
          break;
        case 'cni2':
          this.cniBackExtError = true;
          break;
        case 'form':
          this.formExtError = true;
          break;
      }
    }
  }
  checkExtension2(filename: string, step: string) {
    const regExtension = /(png|jpg|jpeg)$/;
    if (filename.toLowerCase().match(regExtension)) {
      switch (step) {
        case 'cni1':
          this.cniFrontExtError = false;
          break;
        case 'cni2':
          this.cniBackExtError = false;
          break;
        case 'form':
          this.formExtError = false;
          break;
      }
      return true;
    } else {
      switch (step) {
        case 'cni1':
          this.cniFrontExtError = true;
          break;
        case 'cni2':
          this.cniBackExtError = true;
          break;
        case 'form':
          this.formExtError = true;
          break;
      }
    }
  }

  checkFile(file: any, step: string) {
    if (file[0]) {
      const fileSize = file[0].size / 1024;
      const fileName = file[0].name;
      switch (step) {
        case 'cni1':
          if (this.checkExtension2(fileName, 'cni1')) {
            this.cniFrontSizeError = false;
            this.uploadedCNIFrontName = fileName;
            this.cn1ToUpload = file[0];
            if (fileSize > MAX_USER_FILE_UPLOAD_SIZE) {
              this.cniFrontSizeError = true;
            }
          }
          break;
        case 'cni2':
          if (this.checkExtension2(fileName, 'cni2')) {
            this.cniBackSizeError = false;
            this.uploadedCNIBackName = fileName;
            this.cn2ToUpload = file[0];
            if (fileSize > MAX_USER_FILE_UPLOAD_SIZE) {
              this.cniBackSizeError = true;
            }
          }
          break;
        case 'form':
          if (this.checkExtension(fileName, 'form')) {
            this.formSizeError = false;
            this.uploadedFormName = fileName;
            this.formulaireToUpload = file[0];
            if (fileSize > MAX_USER_FILE_UPLOAD_SIZE) {
              this.formSizeError = true;
            }
          }
          break;
      }
    } else {
      switch (step) {
        case 'cni1':
          this.uploadedCNIFrontName = null;
          break;
        case 'cni2':
          this.uploadedCNIBackName = null;
          break;
        case 'form':
          this.uploadedFormName = null;
          break;
      }
    }
    this.error =
      this.cniBackSizeError ||
      this.cniFrontSizeError ||
      this.formSizeError ||
      this.cniBackExtError ||
      this.cniFrontExtError ||
      this.formExtError;
  }

  downloadFile() {
    let srcFile = downloadEndpoint;
    let logMsg = '';
    let filename = '';
    switch (this.type) {
      case 'creation-compte':
        filename = FILENAME_OPEN_OM_ACCOUNT;
        srcFile += FILENAME_OPEN_OM_ACCOUNT;
        logMsg = 'Telechargement formulaire Ouverture compte OM';
        break;
      case 'deplafonnement':
        filename = FILENAME_DEPLAFONNEMENT_OM_ACCOUNT;
        srcFile += FILENAME_DEPLAFONNEMENT_OM_ACCOUNT;
        logMsg = 'Telechargement formulaire deplafonnement compte OM';
        break;
      default:
        filename = FILENAME_ERROR_TRANSACTION_OM;
        srcFile += FILENAME_ERROR_TRANSACTION_OM;
        logMsg = 'Telechargement formulaire declaration erreur transaction OM';
        break;
    }
    this.download(filename);
  }

  download(fileName: string) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = downloadEndpoint + fileName;
    const token = ls.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    const options = { headers };
    let path = this.file.dataDirectory;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    }
    fileTransfer.download(url, path + fileName, true, options).then(
      entry => {
        const fileurl = entry.toURL();
        this.fileOpener
          .open(fileurl, 'application/pdf')
          .then(() => {
            // log file opened successfully
          })
          .catch(e => {
            // log file opened successfully console.log('Error opening file', e)
          });
      },
      error => {
        console.log(error);
      }
    );
  }

  sendMail() {
    // Uncomment when endpoint sendingMail is avalaible
    this.loader = true;
    const emailFormDataModel = new FormData();
    const operation = {
      operationCode: getOperationCodeActionOM(this.type),
      firstName: this.userInfos.firstName,
      lastName: this.userInfos.lastName,
      numero: this.userNumber,
      email: this.form.get('mail').value
    };
    emailFormDataModel.append('operationDTO', JSON.stringify(operation));
    emailFormDataModel.append('formulaire', this.formulaireToUpload);
    emailFormDataModel.append('rectoID', this.cn1ToUpload);
    emailFormDataModel.append('verso', this.cn2ToUpload);
    this.emerg.sendMailCustomerService(emailFormDataModel).subscribe(
      (res: any) => {
        this.loader = false;
        switch (this.type) {
          case 'creation-compte':
            break;
          case 'deplafonnement':
            break;
          default:
            break;
        }
        this.openSuccessDialog(this.type);
      },
      (err: any) => {
        this.loader = false;
        this.openErrorDialog('errorUpload', `Une erreur est survenue lors de l'envoi du mail`);
        switch (this.type) {
          case 'creation-compte':
            break;
          case 'deplafonnement':
            break;
          default:
            break;
        }
      }
    );
  }

  send() {
    if (this.cn2ToUpload) {
      this.sendMail();
    } else {
      this.openConfirmDialog();
    }
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(CancelOperationPopupComponent, {
      data: { type: 'confirmationOperationDepannage' }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.sendMail();
      }
    });
  }

  openSuccessDialog(type: string) {
    const dialogRef = this.dialog.open(ModalSuccessComponent, {
      data: { type }
    });
    dialogRef.afterClosed().subscribe(confirmresult => {});
  }

  formValid() {
    if (this.formulaireToUpload && this.cn1ToUpload && this.checkValidMail()) {
      return true;
    } else {
      return false;
    }
  }
  checkValidMail() {
    const mail = this.form.get('mail').value;
    return REGEX_EMAIL.test(mail) && !this.invalideEmail(mail);
  }

  openNotAvailableDialog(title: string, text: string) {
    const type = 'file';
    const dialogRef = this.dialog.open(ModalSuccessComponent, {
      data: { type, title, text }
    });
    dialogRef.afterClosed().subscribe(confirmresult => {});
  }

  manageUploadError() {
    this.loader = false;
    this.openErrorDialog('errorUpload', 'Désolé, une erreur est survenue');
  }

  openErrorDialog(type: string, msg: string) {
    // this.dialog.open(UnauthorizedSosModalComponent, {
    //   data: { type, message: msg }
    // });
    alert(msg);
  }
}
