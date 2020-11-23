import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RattachedNumber } from 'src/app/models/rattached-number.model';

@Component({
  selector: 'app-item-rattached-number',
  templateUrl: './item-rattached-number.component.html',
  styleUrls: ['./item-rattached-number.component.scss'],
})
export class ItemRattachedNumberComponent implements OnInit {
  @Input() line: RattachedNumber;
  @Input() checked: boolean;
  @Output() selectedItem = new EventEmitter();
  @Input() disabled:boolean;
  @Input() operationType: string;
  constructor() { }

  ngOnInit() {}

  check() {
    
  }

}
