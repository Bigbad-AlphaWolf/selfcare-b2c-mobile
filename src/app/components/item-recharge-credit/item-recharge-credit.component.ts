import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-recharge-credit',
  templateUrl: './item-recharge-credit.component.html',
  styleUrls: ['./item-recharge-credit.component.scss'],
})
export class ItemRechargeCreditComponent implements OnInit {
  @Input() amount;
  @Input() modifiable = true;
  @Input() showUnity: boolean = true;
  @Output() modify = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  modifier() {
    this.modify.emit();
  }
}
