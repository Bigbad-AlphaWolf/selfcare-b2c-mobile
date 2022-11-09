import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HistoriqueAchatComponent } from './historique-achat.component';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

describe('HistoriqueAchatComponent', () => {
  let component: HistoriqueAchatComponent;
  let fixture: ComponentFixture<HistoriqueAchatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueAchatComponent],
      providers: [
        AngularDelegate,
        {
          provide: ModalController,
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            getOmMsisdn: () => {
              return of();
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatMenuModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
