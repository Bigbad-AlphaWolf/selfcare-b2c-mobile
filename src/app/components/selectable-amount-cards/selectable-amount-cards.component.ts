import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'oem-selectable-amount-cards',
  templateUrl: './selectable-amount-cards.component.html',
  styleUrls: ['./selectable-amount-cards.component.scss'],
})
export class SelectableAmountCardsComponent implements OnInit {
  @Input('amounts') amounts :string []= ['1000','2000','3000','4000','5000','6000'];
  @Output('onAmountSelected') onAmountSelected:EventEmitter<string>=new EventEmitter();
  constructor() { }

  ngOnInit() {}

  onValueChange(amount:string){
    this.onAmountSelected.emit(amount);
  }

}
