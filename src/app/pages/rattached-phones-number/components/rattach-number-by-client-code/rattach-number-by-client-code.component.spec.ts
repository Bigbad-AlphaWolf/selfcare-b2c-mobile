import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

import { RattachNumberByClientCodeComponent } from './rattach-number-by-client-code.component';

describe('RattachNumberByClientCodeComponent', () => {
  let component: RattachNumberByClientCodeComponent;
  let fixture: ComponentFixture<RattachNumberByClientCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RattachNumberByClientCodeComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        AngularDelegate,
        {
          provide: ModalController,
        },
        {
          provide: DashboardService,
          useValue: {
            registerNumberByIdClient: () => {
              return of();
            },
            getMainPhoneNumber: () => {
              return '';
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RattachNumberByClientCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
