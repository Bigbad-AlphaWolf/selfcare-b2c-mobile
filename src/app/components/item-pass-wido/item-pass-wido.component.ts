import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-item-pass-wido',
  templateUrl: './item-pass-wido.component.html',
  styleUrls: ['./item-pass-wido.component.scss'],
})
export class ItemPassWidoComponent implements OnInit {
  @Input() passWido: any;
  @Output() selectPass = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  choosePass(pass: any) {
    this.selectPass.emit(pass);
  }
}
