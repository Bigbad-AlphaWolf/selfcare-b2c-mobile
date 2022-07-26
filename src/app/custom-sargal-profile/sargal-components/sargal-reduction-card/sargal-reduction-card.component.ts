import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sargal-reduction-card',
  templateUrl: './sargal-reduction-card.component.html',
  styleUrls: ['./sargal-reduction-card.component.scss'],
})
export class SargalReductionCardComponent implements OnInit {

  @Input() displayVersion: 'v1' | 'v2' = 'v1';

  constructor() { }

  ngOnInit() {}

}
