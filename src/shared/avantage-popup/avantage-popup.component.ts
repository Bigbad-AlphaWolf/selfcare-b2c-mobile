import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'scb-avantage-popup',
    templateUrl: './avantage-popup.component.html',
    styleUrls: ['./avantage-popup.component.scss']
})
export class AvantagePopupComponent implements OnInit {
    @Output() close = new EventEmitter();
    @Input() type: string;
    @Input() details: any;
    constructor() {}

    ngOnInit() {
        console.log(this.details);

    }
    closeDialog() {
        this.close.emit(true);
    }
}
