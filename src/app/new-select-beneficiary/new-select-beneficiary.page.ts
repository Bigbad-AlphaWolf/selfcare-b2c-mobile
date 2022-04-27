import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-new-select-beneficiary',
  templateUrl: './new-select-beneficiary.page.html',
  styleUrls: ['./new-select-beneficiary.page.scss']
})
export class NewSelectBeneficiaryPage implements OnInit {
  listContact: {contactName: string; tel: string}[] = [
    {
      contactName: 'Petite Soeur',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Moyenne Soeur',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Soeur',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Petite Soeur',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Moyenne Soeur',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Frère',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Soeur Soeur',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Moyenne Soeur',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Soeur',
      tel: '78 212 21 21'
    },
    {
      contactName: 'Grande Soeur',
      tel: '78 212 21 21'
    }
  ];
  constructor(private navCtl: NavController) {}

  ngOnInit() {}

  goBack() {
    this.navCtl.pop();
  }
}
