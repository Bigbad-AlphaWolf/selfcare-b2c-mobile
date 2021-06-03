import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-transfert-om',
  templateUrl: './item-transfert-om.component.html',
  styleUrls: ['./item-transfert-om.component.scss'],
})
export class ItemTransfertOmComponent implements OnInit {
  @Input() omTransfertInfos: any;
  constructor() { }

  ngOnInit() {
  }

}
