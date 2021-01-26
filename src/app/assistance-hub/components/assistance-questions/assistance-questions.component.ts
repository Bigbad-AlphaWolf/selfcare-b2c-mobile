import { Component, OnInit } from '@angular/core';
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
  constructor(
    private assistanceService: AssistanceService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.listQuestions = history.state.listFaqs;
  }

  
  goBack() {
    this.navController.pop();
  }
}
