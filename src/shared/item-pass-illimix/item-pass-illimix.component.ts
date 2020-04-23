import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-pass-illimix',
  templateUrl: './item-pass-illimix.component.html',
  styleUrls: ['./item-pass-illimix.component.scss'],
})
export class ItemPassIllimixComponent implements OnInit {
  @Input() passIllimix: any;
  @Output() selectPass = new EventEmitter();
  constructor() { }

  ngOnInit() {    
  }

  choosePass(pass: any){
    this.selectPass.emit(pass);
  }

}
