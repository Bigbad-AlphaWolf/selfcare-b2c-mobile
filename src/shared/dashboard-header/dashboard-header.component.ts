import { Component, OnInit, Input } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { NO_AVATAR_ICON_URL } from '..';
import { downloadAvatarEndpoint } from 'src/app/services/dashboard-service/dashboard.service';
import { NavController } from '@ionic/angular';

const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {
  @Input() firstName;
  avatarUrl : string = NO_AVATAR_ICON_URL;

  constructor(private navCont: NavController) {}

  ngOnInit() {
    let user = ls.get('user');
    if (user.imageProfil) 
      this.avatarUrl = downloadAvatarEndpoint + user.imageProfil;
  }

  onErrorImgAvatar() {
    this.avatarUrl = NO_AVATAR_ICON_URL;
  }

  goToMyAccount(){
    this.navCont.navigateForward(['/my-account']);
  }
}
