import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {OperationValidationComponent} from './operation-validation.component';
import {PhoneNumberDisplayPipe} from '../pipes/phone-number-display.pipe';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';
import {of} from 'rxjs';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {Contacts} from '@ionic-native/contacts';

describe('OperationValidationComponent', () => {
  let component: OperationValidationComponent;
  let fixture: ComponentFixture<OperationValidationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule],
        declarations: [OperationValidationComponent, PhoneNumberDisplayPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: OrangeMoneyService,
            useValue: {
              getTransferFees: () => {
                return of();
              }
            }
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {
                return '';
              }
            }
          },
          {
            provide: MatDialog,
            useValue: {}
          },
          {
            provide: Contacts,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
