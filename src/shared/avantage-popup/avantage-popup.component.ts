import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'scb-avantage-popup',
    templateUrl: './avantage-popup.component.html',
    styleUrls: ['./avantage-popup.component.scss']
})
export class AvantagePopupComponent implements OnInit {
    @Output() close = new EventEmitter();
    constructor() {}

    ngOnInit() {}
    closeDialog() {
        this.close.emit(true);
    }
}
