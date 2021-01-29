import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AssistanceService } from 'src/app/services/assistance.service';
import { ItemBesoinAide } from 'src/shared';

@Component({
  selector: 'app-assistance-questions',
  templateUrl: './assistance-questions.component.html',
  styleUrls: ['./assistance-questions.component.scss'],
})
export class AssistanceQuestionsComponent implements OnInit {
  listQuestions: ItemBesoinAide[];
  loadingFAQ: boolean;
  displaySearchIcon: boolean = true;
  @ViewChild('searchInput') searchRef;
  constructor(
    private assistanceService: AssistanceService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.listQuestions = history.state.listFaqs;
  }

  onInputChange($event){
    const inputvalue = $event.detail.value;
    this.displaySearchIcon = true;
    if(inputvalue){
      this.navController.navigateForward(['/assistance-hub/search'],{state:{listBesoinAides:this.listQuestions, search:inputvalue}});
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
