import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {
  FileTransferObject,
  FileTransfer
} from '@ionic-native/file-transfer/ngx';
import { downloadEndpoint } from '../services/dashboard-service/dashboard.service';
import { CGU_FILE_NAME } from 'src/shared';
import * as SecureLS from 'secure-ls';
import { Platform } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.page.html',
  styleUrls: ['./apropos.page.scss']
})
export class AproposPage implements OnInit {
  AppVersionNumber: string;
  constructor(
    private router: Router,
    private file: File,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private platform: Platform,
    private appVersion: AppVersion
  ) {
    this.appVersion.getVersionNumber().then(value => {
      this.AppVersionNumber = value;
    }).catch(error => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  presentAlert() {
    this.router.navigate(['/infolegales']);
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  downloadCGU() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = downloadEndpoint + CGU_FILE_NAME;
    const token = ls.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    const options = { headers };
    let path = this.file.dataDirectory;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    }
    fileTransfer.download(url, path + CGU_FILE_NAME, true, options).then(
      entry => {
        const fileurl = entry.toURL();
        this.fileOpener
          .open(fileurl, 'application/pdf')
          .then(() => {})
          .catch(e => {});
      },
      error => {
        console.log(error);
      }
    );
  }
}
