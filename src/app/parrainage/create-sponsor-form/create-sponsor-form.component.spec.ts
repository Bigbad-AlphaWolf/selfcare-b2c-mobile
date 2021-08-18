import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateSponsorFormComponent } from './create-sponsor-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts';
import { MatDialog, MatDialogRef } from '@angular/material';

describe('CreateSponsorFormComponent', () => {
  let component: CreateSponsorFormComponent;
  let fixture: ComponentFixture<CreateSponsorFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CreateSponsorFormComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule],
        providers: [
          AngularDelegate,
          { provide: HttpClient },
          { provide: Router },
          { provide: ModalController },
          { provide: Contacts },
          { provide: MatDialog },
          { provide: MatDialogRef, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSponsorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
