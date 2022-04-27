import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-recipient-item-contact',
  templateUrl: './recipient-item-contact.component.html',
  styleUrls: ['./recipient-item-contact.component.scss']
})
export class RecipientItemContactComponent implements OnInit {
  @Input() item: {contactName: string; tel: string};
  constructor() {}

  ngOnInit() {}
}
