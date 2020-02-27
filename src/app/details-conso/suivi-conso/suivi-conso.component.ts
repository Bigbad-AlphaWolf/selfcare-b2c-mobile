import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { USER_CONS_CATEGORY_CALL, CREDIT_APPEL_CATEGORY } from 'src/shared';

@Component({
  selector: 'app-suivi-conso',
  templateUrl: './suivi-conso.component.html',
  styleUrls: ['./suivi-conso.component.scss']
})
export class SuiviConsoComponent implements OnInit, OnChanges {
  @Input() consoDetails;
  @Input() isLoading: boolean;
  @Output() reloadConso = new EventEmitter();
  hasError: boolean;
  USER_CONS_CATEGORY_CALL = USER_CONS_CATEGORY_CALL;
  CREDIT_APPEL_CATEGORY = CREDIT_APPEL_CATEGORY;

  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.consoDetails && changes.consoDetails.currentValue){
      this.consoDetails = changes.consoDetails.currentValue;
      this.hasItError();
    }
  }

  hasItError() {
    if (this.consoDetails.length === 0) {
        this.hasError = true;
    } else {
        this.hasError = false;
    }
}

  getConso(){
    this.reloadConso.emit();
    this.hasItError();
    this.changeRef.detectChanges();
  }
}
