import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Contacts, Contact } from '@ionic-native/contacts';
import { SelectRecipientComponent } from './select-recipient.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { of } from 'rxjs';

describe('SelectRecipientComponent', () => {
  let component: SelectRecipientComponent;
  let fixture: ComponentFixture<SelectRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRecipientComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule
    ],
      providers: [
        {
          provide: Router
        },
        {
          provide: HttpClient
        },
        {
          provide: ActivatedRoute
        },
        {
          provide: DashboardService,
          useValue: {
            buyPassByCredit: () => {},
            getCurrentPhoneNumber: () => {}
          }
        },
        {
          provide: AuthenticationService,
          useValue: {
            getSubscription: () => {
              return of();
            }
          }
        },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: Contacts
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
