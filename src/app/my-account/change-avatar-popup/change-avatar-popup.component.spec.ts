import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ChangeAvatarPopupComponent} from './change-avatar-popup.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient} from '@angular/common/http';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialComponentsModule} from 'src/app/material-components/material-components.module';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

describe('ChangeAvatarPopupComponent', () => {
  let component: ChangeAvatarPopupComponent;
  let fixture: ComponentFixture<ChangeAvatarPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChangeAvatarPopupComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule, BrowserAnimationsModule, MaterialComponentsModule],
        providers: [
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
            provide: FileReader,
            useValue: {}
          },
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAvatarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
