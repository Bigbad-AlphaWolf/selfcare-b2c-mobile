import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnswerSurveyOem } from 'src/app/models/answer-survey-oem.model';
import { QUESTIONS_FORM_PATH, SUBMIT_FORM_ANSWERS_PATH } from '../utils/satisfaction-form.endpoints';

@Injectable({
  providedIn: 'root'
})
export class FormulaireSatisfactionService {

  constructor(private http: HttpClient) { }

  queryQuestions() {
    return this.http.get(`${QUESTIONS_FORM_PATH}`);
  }

  submitSurvey(data: AnswerSurveyOem[]) {
    return this.http.post(`${SUBMIT_FORM_ANSWERS_PATH}`,data)
  }
}
