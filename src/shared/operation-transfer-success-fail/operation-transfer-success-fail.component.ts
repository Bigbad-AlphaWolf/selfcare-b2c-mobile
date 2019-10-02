import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operation-transfer-success-fail',
  templateUrl: './operation-transfer-success-fail.component.html',
  styleUrls: ['./operation-transfer-success-fail.component.scss'],
})
export class OperationTransferSuccessFailComponent implements OnInit {

  @Input() type;
    @Input() amount;
    @Input() destinataire;
    @Input() failed;
    @Input() errorMessage;
    @Output() redirectTo = new EventEmitter();

    constructor(private router: Router) {}

    ngOnInit() {}

    goBackHome() {
        this.router.navigate(['/dashboard']);
    }

    newTransfer() {
        let route;
        if (this.type === 'om') {
            route = '/transfer/orange-money';
        } else {
            route = '/transfer/credit-bonus';
        }
        this.redirectTo.emit(route);
    }

}
