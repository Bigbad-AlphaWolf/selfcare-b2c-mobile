import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Contacts} from '@ionic-native/contacts';
import {SelectRecipientComponent} from './select-recipient.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';
import {of} from 'rxjs';
import {MaterialComponentsModule} from 'src/app/material-components/material-components.module';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

describe('SelectRecipientComponent', () => {
  let component: SelectRecipientComponent;
  let fixture: ComponentFixture<SelectRecipientComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectRecipientComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [BrowserAnimationsModule, MaterialComponentsModule],
        providers: [
          {provide: ActivatedRoute, useValue: {}},
          {
            provide: Router
          },
          {
            provide: HttpClient
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
            provide: MatDialog,
            useValue: {}
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          },
          {
            provide: Contacts
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
