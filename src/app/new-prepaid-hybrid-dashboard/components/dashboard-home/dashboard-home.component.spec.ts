import {HttpClient} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';

import {DashboardHomeComponent} from './dashboard-home.component';

describe('DashboardHomeComponent', () => {
  let component: DashboardHomeComponent;
  let fixture: ComponentFixture<DashboardHomeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DashboardHomeComponent],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {
            provide: HttpClient,
            useValue: {
              get: () => {
                return of();
              }
            }
          },
          {
            provide: MatBottomSheet,
            useValue: {}
          },
          {
            provide: MatDialog,
            useValue: {}
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(DashboardHomeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
