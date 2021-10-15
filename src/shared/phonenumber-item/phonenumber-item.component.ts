import {Component, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges, OnChanges} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-phonenumber-item',
  templateUrl: './phonenumber-item.component.html',
  styleUrls: ['./phonenumber-item.component.scss']
})
export class PhonenumberItemComponent implements OnInit, OnChanges {
  @ViewChild('checkbox') checkbox: MatCheckbox;
  @Output() select = new EventEmitter();
  @Input() phoneNumber = '';
  @Input() selected = false;
  number = '';
  profile: {name: string; icon: string};
  @Input() selectable = false;
  @Input() simple = true;
  iconBaseUrl = '/assets/images/';
  profiles = [
    {
      name: 'Jamono New Scool',
      icon: `${this.iconBaseUrl}jamono-new-scool.svg`
    },
    {
      name: 'Jamono Allo',
      icon: `${this.iconBaseUrl}illustration-home-suiviconso-1.svg`
    },
    {
      name: 'Jamono Max',
      icon: `${this.iconBaseUrl}illustration-home-suiviconso-1.svg`
    },
    {
      name: 'Ligne fixe',
      icon: `${this.iconBaseUrl}illustration-home-suiviconso-1.svg`
    },
    {
      name: 'New Kirene Avec Orange',
      icon: `${this.iconBaseUrl}kirene-avec-orange.svg`
    }
  ];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.phoneNumber) {
      const thePhoneNumber = changes.phoneNumber.currentValue;
      this.number = thePhoneNumber.msisdn;
      if (thePhoneNumber.profil === 'HYBRID' || thePhoneNumber.profil === 'ND') {
        this.profile = {
          name: thePhoneNumber.formule,
          icon: `${this.iconBaseUrl}jamono-initial.svg`
        };
      } else if (thePhoneNumber.profil === 'POSTPAID') {
        this.profile = {
          name: thePhoneNumber.formule,
          icon: `${this.iconBaseUrl}jamono-premium.svg`
        };
      } else {
        this.profile = this.profiles.find(element => {
          return element.name === thePhoneNumber.formule;
        });
      }
      if (!this.profile) {
        this.profile = {
          name: thePhoneNumber.formule,
          icon: `${this.iconBaseUrl}illustration-home-suiviconso-1.svg`
        };
      }
    }
  }

  toggleSelection() {
    // on simple item the checkbox is not present so toggle the state when user click on the item
    if (this.simple) {
      if (this.selected !== true) {
        this.selected = !this.selected;
        this.select.emit(this.selected);
      }
    }
    /*
Angular do not emit the new checkbox status when dynamically called the toggle() function
 https://github.com/angular/material2/issues/12369
 uncomment the following line when the update is made
*/
  }
  syncWithSelectionState(s) {
    this.selected = s.checked;
    this.select.emit(this.selected);
  }
}
