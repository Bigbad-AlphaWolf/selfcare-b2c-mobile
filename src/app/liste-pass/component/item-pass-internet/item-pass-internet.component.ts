import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PassInternetModel } from 'src/shared';

@Component({
  selector: 'app-item-pass-internet',
  templateUrl: './item-pass-internet.component.html',
  styleUrls: ['./item-pass-internet.component.scss'],
})
export class ItemPassInternetComponent implements OnInit {
  @Input() passInternet: any;
  @Output() selectPass = new EventEmitter();
  constructor() { }

  ngOnInit() {    
  }

  choosePass(pass: any){
    this.selectPass.emit(pass);
  }

}
