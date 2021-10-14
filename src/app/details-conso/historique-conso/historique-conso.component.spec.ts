import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HistoriqueConsoComponent} from './historique-conso.component';
import {MatMenuModule} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

describe('HistoriqueConsoComponent', () => {
  let component: HistoriqueConsoComponent;
  let fixture: ComponentFixture<HistoriqueConsoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HistoriqueConsoComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        imports: [MatMenuModule],
        providers: [
          {
            provide: HttpClient,
            useValue: {
              get() {
                return of({});
              }
            }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
