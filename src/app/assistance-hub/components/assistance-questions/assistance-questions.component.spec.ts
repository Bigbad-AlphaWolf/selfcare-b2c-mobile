import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { AssistanceQuestionsComponent } from './assistance-questions.component';

describe('AssistanceQuestionsComponent', () => {
  let component: AssistanceQuestionsComponent;
  let fixture: ComponentFixture<AssistanceQuestionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AssistanceQuestionsComponent],
        providers: [
          {
            provide: Location,
          },
          {
            provide: UrlSerializer,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
