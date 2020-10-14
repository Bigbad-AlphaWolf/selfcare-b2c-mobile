import { Component, OnInit, Input } from '@angular/core';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { FILE_PATH } from 'src/app/services/utils/services.paths';
import { NavController } from '@ionic/angular';
import { BanniereDescriptionPage } from 'src/app/pages/banniere-description/banniere-description.page';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';

@Component({
  selector: 'oem-banniere',
  templateUrl: './banniere.component.html',
  styleUrls: ['./banniere.component.scss'],
})
export class BanniereComponent implements OnInit {
  @Input('banniere') banniere : BannierePubModel;
  imageUrl : string;
  displays : string[] = [];
  constructor(private navCtrl : NavController) { }

  ngOnInit() {
    if(this.banniere.description){
      this.displays = this.banniere.description.split(';');
    }
    
    this.imageUrl = FILE_DOWNLOAD_ENDPOINT+'/'+this.banniere.image;
  }

  get title(){
    return this.displays.length > 0 ? this.displays[0] : null;
  }
  get details(){
    return this.displays.length > 1 ? this.displays[1] : null;
  }
  get autre(){
    return this.displays.length > 2 ? this.displays[2] : null;
  }

  onBannerClicked(){
    if(!this.banniere.callToAction) return;
    if(this.banniere.action.description){//open description page
      this.navCtrl.navigateForward(BanniereDescriptionPage.ROUTE_PATH,{state:this.banniere});
      return;
    }

    window.open(this.banniere.action.url);

  }

  onErrorImg(){
    this.imageUrl = 'assets/images/default_ban.PNG';
  }

}
