import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency-service/emergency.service';
import { DashboardService, downloadEndpoint } from 'src/app/services/dashboard-service/dashboard.service';
import {
  REGEX_EMAIL,
  MAX_USER_FILE_UPLOAD_SIZE,
  getOperationCodeActionOM,
  FILENAME_OPEN_OM_ACCOUNT,
  FILENAME_DEPLAFONNEMENT_OM_ACCOUNT,
  FILENAME_ERROR_TRANSACTION_OM,
} from 'src/shared';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { CancelOperationPopupComponent } from 'src/shared/cancel-operation-popup/cancel-operation-popup.component';
import { environment } from 'src/environments/environment';
const { SERVER_API_URL } = environment;
import * as SecureLS from 'secure-ls';

import { FileOemService } from 'src/app/services/oem-file/file-oem.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
const ls = new SecureLS({ encodingType: 'aes' });
const logEndpoint = `${SERVER_API_URL}/management/selfcare-logs-file`;

@Component({
  selector: 'app-orange-money',
  templateUrl: './orange-money.component.html',
  styleUrls: ['./orange-money.component.scss'],
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
    private fileService: FileOemService,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.userInfos = ls.get('user');
    this.form = this.fb.group({
      mail: [this.userInfos.email && !this.invalideEmail(this.userInfos.email) ? this.userInfos.email : null, [Validators.required, Validators.pattern(REGEX_EMAIL)]],
      form: [null, [Validators.required]],
      recto: [null, [Validators.required]],
      verso: [null],
    });
    this.userNumber = this.dashb.getCurrentPhoneNumber();
    if (this.route.snapshot) this.type = this.route.snapshot.paramMap.get('type');
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
    const regExtension = /(png|jpg|jpeg|pdf)$/;
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
          this.followUploadFile('cni');
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
          this.followUploadFile('cni');
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
          this.followUploadFile('form');
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
    this.error = this.cniBackSizeError || this.cniFrontSizeError || this.formSizeError || this.cniBackExtError || this.cniFrontExtError || this.formExtError;
  }

  followUploadFile(cniOrForm: 'cni' | 'form') {
    let eventName = '';
    switch (this.type) {
      case 'deplafonnement':
        eventName = cniOrForm === 'cni' ? 'upload_cni_deplafonnement' : 'upload_formulaire_deplafonnement';
        break;
      case 'creation-compte':
        eventName = cniOrForm === 'cni' ? 'upload_cni_creation' : 'upload_formulaire_creation';
        break;
      case 'reclamation':
        eventName = cniOrForm === 'cni' ? 'upload_cni_reclamation' : 'upload_formulaire_reclamation';
        break;
      default:
        break;
    }
    this.oemLoggingService.registerEvent(eventName);
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
        this.oemLoggingService.registerEvent('Download_formulaire_creation');
        break;
      case 'deplafonnement':
        filename = FILENAME_DEPLAFONNEMENT_OM_ACCOUNT;
        srcFile += FILENAME_DEPLAFONNEMENT_OM_ACCOUNT;
        logMsg = 'Telechargement formulaire deplafonnement compte OM';
        this.oemLoggingService.registerEvent('Download_formulaire_deplafonnement');
        break;
      default:
        filename = FILENAME_ERROR_TRANSACTION_OM;
        srcFile += FILENAME_ERROR_TRANSACTION_OM;
        logMsg = 'Telechargement formulaire declaration erreur transaction OM';
        this.oemLoggingService.registerEvent('declaration_erreur_transaction_om');
        break;
    }
    this.download(filename);
  }

  download(fileName: string) {
    this.fileService.openSecureFile(fileName);
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
      email: this.form.get('mail').value,
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
            this.oemLoggingService.registerEvent('Demande_Ouverture_Compte_OM');
            break;
          case 'deplafonnement':
            this.oemLoggingService.registerEvent('Demande_Deplafonnement_OM');
            break;
          default:
            this.oemLoggingService.registerEvent('Declaration_Erreur_Success');
            break;
        }
        this.openSuccessDialog(this.type);
      },
      (err: any) => {
        this.loader = false;
        this.openErrorDialog('failed-action', `Une erreur est survenue lors de l'envoi du mail`);
        switch (this.type) {
          case 'creation-compte':
            this.oemLoggingService.registerEvent('Demande_Ouverture_Compte_OM_error', convertObjectToLoggingPayload({ error: 'error while sending mail' }));
            break;
          case 'deplafonnement':
            this.oemLoggingService.registerEvent('Demande_Deplafonnement_OM_error', convertObjectToLoggingPayload({ error: 'error while sending mail' }));
            break;
          default:
            this.oemLoggingService.registerEvent('Declaration_Erreur_error', convertObjectToLoggingPayload({ error: 'error while sending mail' }));
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
      data: { confirmationOperationDepannage: true },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.sendMail();
      }
    });
  }

  openSuccessDialog(type: string) {
    const dialogRef = this.dialog.open(ModalSuccessComponent, {
      data: { type },
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
      data: { type, title, text },
    });
    dialogRef.afterClosed().subscribe(confirmresult => {});
  }

  manageUploadError() {
    this.loader = false;
    this.openErrorDialog('failed-action', 'Désolé, une erreur est survenue');
    this.oemLoggingService.registerEvent('Upload_File_Error', convertObjectToLoggingPayload({ error: 'error on uploading files' }));
  }

  openErrorDialog(type: string, msg: string) {
    this.dialog.open(ModalSuccessComponent, {
      data: { type, text: msg },
    });
    // alert(msg);
  }
}
