import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectOtherRecipientComponent } from './select-other-recipient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { Contacts } from '@ionic-native/contacts';
import { MatDialog } from '@angular/material';

describe('SelectOtherRecipientComponent', () => {
  let component: SelectOtherRecipientComponent;
  let fixture: ComponentFixture<SelectOtherRecipientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule],
      declarations: [ SelectOtherRecipientComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            isPostpaid:() => {
              return of()
            },
            getSubscription:() => {
              return of()
            }
          }
        },
        {
          provide: Contacts,
          useValue: {}
        },
        {
          provide: MatDialog,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOtherRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
