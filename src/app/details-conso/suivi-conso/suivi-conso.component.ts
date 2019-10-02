import { Component, OnInit, Input } from '@angular/core';
import { USER_CONS_CATEGORY_CALL, CREDIT_APPEL_CATEGORY } from 'src/shared';

@Component({
  selector: 'app-suivi-conso',
  templateUrl: './suivi-conso.component.html',
  styleUrls: ['./suivi-conso.component.scss']
})
export class SuiviConsoComponent implements OnInit {
  @Input() consoDetails;
  USER_CONS_CATEGORY_CALL = USER_CONS_CATEGORY_CALL;
  CREDIT_APPEL_CATEGORY = CREDIT_APPEL_CATEGORY;

  constructor() {}

  ngOnInit() {}
}
