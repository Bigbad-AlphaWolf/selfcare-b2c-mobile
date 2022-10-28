import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';

@Component({
  selector: 'app-assistance-questions',
  templateUrl: './assistance-questions.component.html',
  styleUrls: ['./assistance-questions.component.scss'],
})
export class AssistanceQuestionsComponent implements OnInit {
  listQuestions: OffreService[];
  loadingFAQ: boolean;
  displaySearchIcon: boolean = true;
  @ViewChild('searchInput', { static: true }) searchRef;
  constructor(private navController: NavController, private oemLoggingService: OemLoggingService) {}

  ngOnInit() {
    this.listQuestions = history.state && history.state.listFaqs ? history.state.listFaqs : [];
    this.oemLoggingService.registerEvent('Assistance_faq_affichage_success');
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

  logFaQClick(question: OffreService) {
    this.oemLoggingService.registerEvent('help_faq_click', [{ dataName: 'question', dataValue: question?.question }]);
  }

  goBack() {
    this.navController.pop();
  }
}
