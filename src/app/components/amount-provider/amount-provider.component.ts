import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { REGEX_IS_DIGIT } from 'src/shared';

@Component({
  selector: 'oem-amount-provider',
  templateUrl: './amount-provider.component.html',
  styleUrls: ['./amount-provider.component.scss'],
})
export class AmountProviderComponent implements OnInit {
  @Input('value') initValue:number;
  @Input('amounts') amounts :string []= ['500','1000','2000','2500','5000','10000'];
  @Output('onAmountSelected') onAmountSelected:EventEmitter<string>=new EventEmitter();
  @Output('onInputAmount') inputAmountEvent:EventEmitter<string>=new EventEmitter();

  amountSelected: string;
  amountFromInput: string;
  constructor() { }

  ngOnInit() {}

  onValueChange(amount:string){
    this.amountSelected = amount;
    this.onAmountSelected.emit(amount);   
  }

  onInputAmount(event: any) {
    const amount = event.target.value;
    this.updateInput(event);
    this.amountFromInput = amount;
    this.inputAmountEvent.emit(amount);
  }

  updateInput(eventInput: any) {        
    if(!REGEX_IS_DIGIT.test(eventInput.data)){
      const value = eventInput.target.value;
      eventInput.target.value = 0;
      eventInput.target.value = value;
    }
  }

  onOptionChange(value: string) {
   
    
  }

}
