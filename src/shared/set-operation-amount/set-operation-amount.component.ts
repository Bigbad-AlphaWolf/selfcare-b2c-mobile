import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-set-operation-amount',
  templateUrl: './set-operation-amount.component.html',
  styleUrls: ['./set-operation-amount.component.scss']
})
export class SetOperationAmountComponent implements OnInit {
  @Output() next = new EventEmitter<number>();
  @Output() showSolde = new EventEmitter<number>();
  @Input() amount;
  @Input() currentBalance;
  @Input() hideUserSolde = true;
  @Input() omBalance;

  constructor() {}

  ngOnInit() {}

  nextStep() {
    if (+this.amount > 0) {
      this.next.emit(+this.amount);
    } else {
      alert('Montant doit être supérieur à 0');
    }
  }

  showOmSolde() {
    this.showSolde.emit();
  }

  hideTheSolde() {
    this.hideUserSolde = true;
  }
}
