import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-assistance-questions',
  templateUrl: './assistance-questions.component.html',
  styleUrls: ['./assistance-questions.component.scss'],
})
export class AssistanceQuestionsComponent implements OnInit {
  listQuestions: OffreService[];
  loadingFAQ: boolean;
  displaySearchIcon: boolean = true;
  @ViewChild('searchInput') searchRef;
  constructor(private navController: NavController, private followAnalyticsService: FollowAnalyticsService) {}

  ngOnInit() {
    this.listQuestions =  history.state && history.state.listFaqs ? history.state.listFaqs : [];
    this.followAnalyticsService.registerEventFollow(
      'Assistance_faq_affichage_success',
      'event'
    );
  }

  onInputChange($event) {
    const inputvalue = $event.detail.value;
    this.displaySearchIcon = true;
    if (inputvalue) {
      this.navController.navigateForward(['/assistance-hub/search'], {
        state: { listBesoinAides: this.listQuestions, search: inputvalue },
      });
      this.displaySearchIcon = false;
    }
  }

  onClear(searchInput) {
    const inputValue: string = searchInput.value;
    searchInput.value = inputValue.slice(0, inputValue.length - 1);
  }

  goBack() {
    this.navController.pop();
  }
}
