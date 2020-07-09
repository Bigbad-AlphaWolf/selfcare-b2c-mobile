import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orange-bills',
  templateUrl: './orange-bills.page.html',
  styleUrls: ['./orange-bills.page.scss'],
 
})
export class OrangeBillsPage implements OnInit {
  months = [
    'Janvier 2020',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  constructor() { }
  onChangeLine(){}
  ngOnInit() {
  }

}
