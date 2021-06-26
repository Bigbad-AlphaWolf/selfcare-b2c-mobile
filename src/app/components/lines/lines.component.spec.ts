import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { LinesComponent } from './lines.component';

describe('LinesComponent', () => {
  let component: LinesComponent;
  let fixture: ComponentFixture<LinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalController
        },
        {
          provide: DashboardService,
          useValue: {
            attachedNumbers: () => {
              return of()
            }
          }
        },
        {
          provide: AuthenticationService,
          useValue: {
            getSubscription: () => {
              return of()
            }
          }
        }
      ],
      declarations: [ LinesComponent, PhoneNumberDisplayPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
