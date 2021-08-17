import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlSerializer } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';
import { DalalTonesService } from '../services/dalal-tones-service/dalal-tones.service';

import { DalalTonesPage } from './dalal-tones.page';

describe('DalalTonesPage', () => {
  let component: DalalTonesPage;
  let fixture: ComponentFixture<DalalTonesPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          {
            provide: HttpClient,
            useValue: {
              get: () => {
                return of();
              },
            },
          },
          {
            provide: Location,
          },
          {
            provide: UrlSerializer,
            useValue: {},
          },
          {
            provide: DalalTonesService,
            useValue: {
              getActiveDalal: () => {
                return of();
              },
              fetchDalalTones: () => {
                return of();
              },
              fetchDalalGenres: () => {
                return of();
              },
            },
          },
          {
            provide: ModalController,
            useValue: {},
          },
        ],
        declarations: [DalalTonesPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DalalTonesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
