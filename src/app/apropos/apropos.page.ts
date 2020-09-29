import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CGU_FILE_NAME } from 'src/shared';
import * as SecureLS from 'secure-ls';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FileOemService } from '../services/oem-file/file-oem.service';
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
    private fileService: FileOemService,
    private appVersion: AppVersion
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.appVersion.getVersionNumber().then(value => {
      this.AppVersionNumber = value;
    }).catch(error => {
      console.log(error);
    });
  }

  presentAlert() {
    this.router.navigate(['/infolegales']);
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  downloadCGU(){
    this.fileService.openSecureFile(CGU_FILE_NAME);
  }
 
}
