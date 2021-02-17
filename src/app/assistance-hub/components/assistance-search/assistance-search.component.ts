import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonInput, NavController } from '@ionic/angular';
import { ItemBesoinAide } from 'src/shared';

@Component({
  selector: 'app-assistance-search',
  templateUrl: './assistance-search.component.html',
  styleUrls: ['./assistance-search.component.scss'],
})
export class AssistanceSearchComponent implements OnInit {
  displaySearchIcon: boolean = true;
  @ViewChild('searchInput') searchRef: IonInput;
  terms = '';
  listBesoinAides: ItemBesoinAide[];
  listBesoinAidesAltered: ItemBesoinAide[];

  constructor(private navController: NavController) {}

  ngOnInit() {
    this.listBesoinAidesAltered = this.listBesoinAides =
      history.state.listBesoinAides;
  }

  ngAfterViewInit() {
    const search = history.state.search;
    this.searchRef.value = search;
    this.displaySearchIcon = false;
    this.terms = search;
    setTimeout(() => {
      this.searchRef.setFocus();
    }, 400);
  }

  onInputChange($event) {
    const inputvalue = $event.detail.value;
    this.displaySearchIcon = true;
    if (inputvalue) {
      this.displaySearchIcon = false;
    }
    this.terms = inputvalue;
  }

  onClear(searchInput) {
    const inputValue: string = searchInput.value;
    searchInput.value = inputValue.slice(0, inputValue.length - 1);
  }

  goBack() {
    this.navController.pop();
  }
}