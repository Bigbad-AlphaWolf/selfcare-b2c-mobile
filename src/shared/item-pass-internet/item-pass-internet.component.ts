import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PassInternetModel, CODE_KIRENE_Formule } from 'src/shared';
import { SubscriptionModel } from 'src/app/dashboard';

@Component({
  selector: 'app-item-pass-internet',
  templateUrl: './item-pass-internet.component.html',
  styleUrls: ['./item-pass-internet.component.scss'],
})
export class ItemPassInternetComponent implements OnInit {
  @Input() passInternet: any;
  @Output() selectPass = new EventEmitter();
  @Input() subscription: SubscriptionModel;
  KIRENE_SUBSCRIPTION_CODE_FORMULE = CODE_KIRENE_Formule
  constructor() { }

  ngOnInit() {    
  }

  choosePass(pass: any){
    this.selectPass.emit(pass);
  }

}
