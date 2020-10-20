import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dalal-disable-popup',
  templateUrl: './dalal-disable-popup.component.html',
  styleUrls: ['./dalal-disable-popup.component.scss'],
})
export class DalalDisablePopupComponent implements OnInit {
  @Input() dalal: any;

  constructor() {}

  ngOnInit() {}

  disableDalal() {}
}
