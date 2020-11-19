import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionModel, CODE_KIRENE_Formule } from 'src/shared';

@Component({
  selector: 'app-item-pass-illimix',
  templateUrl: './item-pass-illimix.component.html',
  styleUrls: ['./item-pass-illimix.component.scss'],
})
export class ItemPassIllimixComponent implements OnInit {
  @Input() passIllimix: any;
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
