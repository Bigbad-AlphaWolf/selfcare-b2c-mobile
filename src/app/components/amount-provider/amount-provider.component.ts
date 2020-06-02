import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'oem-amount-provider',
  templateUrl: './amount-provider.component.html',
  styleUrls: ['./amount-provider.component.scss'],
})
export class AmountProviderComponent implements OnInit {
  @Input('amounts') amounts :string []= ['1000','2000','3000','4000','5000','6000'];
  @Output('onAmountSelected') onAmountSelected:EventEmitter<string>=new EventEmitter();
  showInput:boolean = true;
  amountSelected: string;
  amountFromInput: string;
  constructor() { }

  ngOnInit() {}

  onValueChange(amount:string){
    this.showInput = amount === 'ENTER';
    amount = this.showInput ? this.amountFromInput : amount;
    this.amountSelected = amount;
    this.onAmountSelected.emit(amount);   
  }

  onAmountChanged(amount: string) {
    this.amountFromInput = amount;
    this.onAmountSelected.emit(amount);
    // this.phoneIsNotValid = false;
    // this.canNotRecieve = false;
  }

  onOptionChange(value: string) {
   
    
  }

}
