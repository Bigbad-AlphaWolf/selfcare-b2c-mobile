import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { NavController } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';
import { AnswerSurveyOem } from 'src/app/models/answer-survey-oem.model';
import { QuestionFormSatisfactionModel } from 'src/app/models/question-form-satisfaction.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FormulaireSatisfactionService } from 'src/app/services/formulaire-satisfaction-service/formulaire-satisfaction.service';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';

@Component({
  selector: 'app-satisfaction-form',
  templateUrl: './satisfaction-form.page.html',
  styleUrls: ['./satisfaction-form.page.scss'],
})
export class SatisfactionFormPage implements OnInit {
  isLoading: boolean;
  hasError: boolean;
  listQuestions: QuestionFormSatisfactionModel[] = [];
  listAnswer: any[];
  hasErrorSubmitting: boolean;
  errorMsg: string;
  currentumber: string;
  successDialog: MatDialogRef<ModalSuccessComponent>;
  isSubmitting: boolean;
  constructor(private navCtrl: NavController, private satisformServ: FormulaireSatisfactionService, private dashbServ: DashboardService, private dialog: MatDialog) { }

  ngOnInit() {
    this.fetchQuestions();
    this.currentumber = this.dashbServ.getCurrentPhoneNumber();
  }

  goBack() {
    this.navCtrl.pop();
  }

  fetchQuestions() {
    this.isLoading = true;
    this.hasError = false;
    this.listAnswer = [];
    this.satisformServ.queryQuestions().pipe(tap((res: QuestionFormSatisfactionModel[]) => {
      this.isLoading = false;
      this.hasError = false;
      this.listQuestions = res;
      this.listAnswer = new Array<AnswerSurveyOem>(res.length);
      this.listAnswer = this.listQuestions.map((item: QuestionFormSatisfactionModel ) => {
        let answer: AnswerSurveyOem = {feedback: null,comment: null, msisdn: this.currentumber, questions: null};
        const questions = [];
        questions.push(item);
        answer.questions = questions;
        return answer;
      })
    } ), catchError( (err: any) => {
      this.isLoading = false;
      this.hasError = true;
      throw err;
    })).subscribe();
  }

  isFormValid() {
    let isValid = false;
    const QUESTIONS_NOT_FILLED = this.listAnswer.filter((answer: { feedback: any, comment: any, questions: QuestionFormSatisfactionModel }) => {
      return !answer.feedback;
    });    

    isValid = !QUESTIONS_NOT_FILLED.length;
    return isValid;
  }
  submit() {
    this.hasErrorSubmitting = false;
    this.errorMsg = null;
    this.isSubmitting = true;
    if(this.isFormValid()) {      
      this.satisformServ.submitSurvey(this.listAnswer).subscribe(
        (res: any) => {
          console.log('res', res);
          this.subimissionSucceded();
          this.isSubmitting = false;
        }, (err: any) => {
          console.log('resErr', err);
          this.hasErrorSubmitting = true;
          this.errorMsg = "Une erreur est survenue lors de l'enregistrement de vos réponses. Veuillez réessayer"
          this.isSubmitting = false;
        }
      )
    } else {
      this.hasErrorSubmitting = true;
      this.errorMsg = "Veuillez remplir toutes les réponses du formulaire avant de continuer"
    }
    
  }

  subimissionSucceded() {
    this.successDialog = this.dialog.open(ModalSuccessComponent, {
      data: { type: 'survey' },
      width: '95%',
      maxWidth: '375px'
    });
  }

}
