import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-transfert-om',
  templateUrl: './item-transfert-om.component.html',
  styleUrls: ['./item-transfert-om.component.scss'],
})
export class ItemTransfertOmComponent implements OnInit {
  @Input() omTransfertInfos: any;
  @Input() isFromHistory: boolean;
  @Input() transferHistoryItem: any;
  @Input() isForWoyofal: boolean;
  MATH = Math;
  constructor() {}

  ngOnInit() {}
}
