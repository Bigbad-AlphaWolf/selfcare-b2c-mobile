import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-pass-internet-v3',
  templateUrl: './list-pass-internet-v3.page.html',
  styleUrls: ['./list-pass-internet-v3.page.scss'],
})
export class ListPassInternetV3Page implements OnInit {
  slideSelected = 1;

  list = ['Jour', 'Semaine', 'Mois', '3 Jours']
  constructor() { }

  ngOnInit() {
  }

}
