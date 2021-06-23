import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { RapidoService } from 'src/app/services/rapido/rapido.service';

import { RapidoSoldeComponent } from './rapido-solde.component';

describe('RapidoSoldeComponent', () => {
  let component: RapidoSoldeComponent;
  let fixture: ComponentFixture<RapidoSoldeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RapidoService,
          useValue: {
            getSolde: () => {
              return of()
            }
          }
        },
        {
          provide: NavController
        },
        {
          provide: ModalController
        }
      ],
      declarations: [ RapidoSoldeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapidoSoldeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
