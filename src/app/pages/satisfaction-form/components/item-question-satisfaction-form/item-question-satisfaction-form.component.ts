import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnswerSurveyOem } from 'src/app/models/answer-survey-oem.model';
import { QuestionFormSatisfactionModel } from 'src/app/models/question-form-satisfaction.model';
import { TYPE_QUESTION_SATISFACTION_FORM } from 'src/shared';

@Component({
  selector: 'app-item-question-satisfaction-form',
  templateUrl: './item-question-satisfaction-form.component.html',
  styleUrls: ['./item-question-satisfaction-form.component.scss'],
})
export class ItemQuestionSatisfactionFormComponent implements OnInit {
  @Input() itemQuestion: QuestionFormSatisfactionModel;
  @Input() answer : AnswerSurveyOem;
  @Output() answerChange = new EventEmitter();
  BASE_NOTATIONS_RATING = [1,2,3,4,5];
  BASE_NOTATIONS_RECOMENDATION_RATING = [1,2,3,4,5,6,7,8,9,10];
  currentRatingNote:number;
  currentRecommendationNote:number;
  TYPE_QUESTION_SATISFACTION_FORM = TYPE_QUESTION_SATISFACTION_FORM;
  customPopoverOptions: any = {
    translucent: true,
    cssClass: 'my-custom-class'
  };
  constructor() { }

  ngOnInit() {
    this.initializeAllNotes();
  }

  rate(note: number) {
    this.answer.feedback = note;
    this.currentRatingNote = note;
    this.answerChange.emit(this.answer)

  }
  rateRecommendation(note: number) {
    this.answer.feedback = note;
    this.currentRecommendationNote = note;
    this.answerChange.emit(this.answer)

  }

  coloreStar(index: number) {
    return index <= this.currentRatingNote ? 'star' : 'star-outline';
  }
  colorRecommendationIndex(index: number) {
    return index <= this.currentRecommendationNote;
  }

  isType(question: QuestionFormSatisfactionModel, typeQuestion: string) {
    return question.typeQuestion === typeQuestion;
  }

  onCommentEntered(input: any) {
    let text: string;
    if(input.detail.value) {
      text = input.detail.value;
    }
    this.answer.comment = text;
    this.answerChange.emit(this.answer);
  }

  onAnswerSelected(input: any) {
    let text: string;
    if(input.detail.value) {
      text = input.detail.value;
    }
    this.answer.feedback = text;
    this.answerChange.emit(this.answer);
  }

  onAnswerSelectedFromSelection(input: any) {
    let text: string;

    if(input.detail.value) {
      if(this.itemQuestion.libelle === 'multi') {
        const response: [] = input.detail.value;
        text = response.join('|');
      } else {
        text = input.detail.value;
      }
    }
    this.answer.feedback = text;
    this.answerChange.emit(this.answer);
  }

  isMultiSelection(): boolean {
    return this.itemQuestion.libelle === 'multi'
  }

  initializeAllNotes(){
    if(this.itemQuestion.libelle && !isNaN(+this.itemQuestion.libelle)) {
      if(this.isType(this.itemQuestion, TYPE_QUESTION_SATISFACTION_FORM.RECOMMENDATION)){
        this.BASE_NOTATIONS_RECOMENDATION_RATING = this.initializeNote()
      } else if(this.isType(this.itemQuestion, TYPE_QUESTION_SATISFACTION_FORM.NOTE)) {
        this.BASE_NOTATIONS_RATING = this.initializeNote();
      }
    }
  }

  initializeNote(){
    if(this.itemQuestion.libelle && !isNaN(+this.itemQuestion.libelle)) {
      const max_note = +this.itemQuestion.libelle;
      const notes = [...Array(max_note).keys()].map(x => x += 1);
      return notes;
    }
  }
}
