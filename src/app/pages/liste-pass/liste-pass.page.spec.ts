import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListePassPage } from './liste-pass.page';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListePassPage', () => {
  let component: ListePassPage;
  let fixture: ComponentFixture<ListePassPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ListePassPage],
        imports: [RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: ActivatedRoute },
          { provide: Location },
          { provide: UrlSerializer },
          {
            provide: HttpClient,
            useValue: {
              post: () => {
                return of();
              },
              get: () => {
                return of();
              },
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
