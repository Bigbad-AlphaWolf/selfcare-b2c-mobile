import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-numbers-to-delete-list',
  templateUrl: './numbers-to-delete-list.component.html',
  styleUrls: ['./numbers-to-delete-list.component.scss']
})
export class NumbersToDeleteListComponent implements OnInit {
  @Output() updated = new EventEmitter();

  selectedPhoneNumbers = [];
  @Input() phoneNumbers = [];
  constructor() {}

  ngOnInit() {}

  updateSelectedPhoneNumbers(phoneNumber: string, selected: boolean) {
    // add the phone number to the array of selected phone numbers if the phone number is selected
    if (selected) {
      this.selectedPhoneNumbers = [...this.selectedPhoneNumbers, phoneNumber];
    } else {
      // remove the phone number from the array of selected phone numbers if the phone number is unselected

      this.selectedPhoneNumbers = this.selectedPhoneNumbers.filter(
        x => x !== phoneNumber
      );
    }
    this.updated.emit(this.selectedPhoneNumbers);
  }
}
