import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContactOem} from 'src/app/models/contact-oem.model';

@Component({
  selector: 'app-recipient-item-contact',
  templateUrl: './recipient-item-contact.component.html',
  styleUrls: ['./recipient-item-contact.component.scss']
})
export class RecipientItemContactComponent implements OnInit {
  @Input() item: ContactOem;
  @Output() selected = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  choose() {
    this.selected.emit(this.item);
  }
}
