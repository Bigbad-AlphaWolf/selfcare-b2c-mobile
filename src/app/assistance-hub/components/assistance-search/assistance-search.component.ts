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
  @ViewChild('searchInput') searchRef : IonInput;
  listBesoinAides: ItemBesoinAide[];

  constructor( private navController: NavController) { }

  ngOnInit() {
    this.listBesoinAides = history.state.listBesoinAides;
    
  }

  ngAfterViewInit() {
    const search = history.state.search;
    this.searchRef.value = search;
    console.log(this.searchRef);
    
    this.searchRef.setFocus();
 }

  onInputChange($event){
    const inputvalue = $event.detail.value;
    this.displaySearchIcon = true;
    if(inputvalue){
      console.log(inputvalue);
      this.displaySearchIcon = false;
    }
    
  }

  onClear(searchInput){
    const inputValue : string =  searchInput.value;
    searchInput.value = inputValue.slice(0,inputValue.length-1);
    
  }

  goBack() {
    this.navController.pop();
  }

}
