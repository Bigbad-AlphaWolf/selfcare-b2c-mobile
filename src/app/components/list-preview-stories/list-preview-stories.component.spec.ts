import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { ListPreviewStoriesComponent } from './list-preview-stories.component';

describe('ListPreviewStoriesComponent', () => {
  let component: ListPreviewStoriesComponent;
  let fixture: ComponentFixture<ListPreviewStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListPreviewStoriesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController,
        },
        {
          provide: AngularDelegate,
        },
        {
          provide: HttpClient,
          useValue: {
            get: () => {
              return of();
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPreviewStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
