import { Component, OnInit } from '@angular/core';
import { previousMonths } from 'src/app/utils/utils';
import { MonthOem } from 'src/app/models/month.model';

@Component({
  selector: 'app-orange-bills',
  templateUrl: './orange-bills.page.html',
  styleUrls: ['./orange-bills.page.scss'],
 
})
export class OrangeBillsPage implements OnInit {
  months : MonthOem[] = [];
  constructor() { }
  onChangeLine(){
  }
  ngOnInit() {
    this.months = previousMonths(8);
  }

}
