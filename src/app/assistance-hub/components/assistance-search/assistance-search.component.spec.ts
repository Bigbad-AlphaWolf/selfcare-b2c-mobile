import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { SearchAssistancePipe } from 'src/app/pipes/search-assistance/search-assistance.pipe';

import { AssistanceSearchComponent } from './assistance-search.component';

describe('AssistanceSearchComponent', () => {
  let component: AssistanceSearchComponent;
  let fixture: ComponentFixture<AssistanceSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistanceSearchComponent, SearchAssistancePipe ],
      providers: [
        {
          provide: Location
        },
        {
          provide: UrlSerializer
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
