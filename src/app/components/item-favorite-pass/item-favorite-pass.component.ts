import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-item-favorite-pass',
  templateUrl: './item-favorite-pass.component.html',
  styleUrls: ['./item-favorite-pass.component.scss'],
})
export class ItemFavoritePassComponent implements OnInit {
  @Input() pass: any;
  @Input() type: 'internet' | 'illimix' = 'internet';
  @Output() selectPass = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  choosePass(pass: any) {
    this.selectPass.emit(pass);
  }
}
