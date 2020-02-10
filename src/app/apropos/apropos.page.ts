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
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.page.html',
  styleUrls: ['./apropos.page.scss']
})
export class AproposPage implements OnInit {
  constructor(
    private router: Router,
    private file: File,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private platform: Platform
  ) {}

  ngOnInit() {}

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
}
