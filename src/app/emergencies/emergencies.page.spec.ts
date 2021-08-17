import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmergenciesPage } from './emergencies.page';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmergenciesPage', () => {
  let component: EmergenciesPage;
  let fixture: ComponentFixture<EmergenciesPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [EmergenciesPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: HttpClient,
            useValue: {
              get: () => {
                return of();
              },
            },
          },
          { provide: MatDialog },
          { provide: InAppBrowser },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergenciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
