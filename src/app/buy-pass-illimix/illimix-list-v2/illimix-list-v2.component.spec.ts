import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllimixListV2Component } from './illimix-list-v2.component';
import { PassIllimixService } from 'src/app/services/pass-illimix-service/pass-illimix.service';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';

describe('IllimixListV2Component', () => {
  let component: IllimixListV2Component;
  let fixture: ComponentFixture<IllimixListV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IllimixListV2Component],
      providers: [
        {
          provide: PassIllimixService,
          useValue: {
            setPhoneNumber: () => {},
            setPaymentMod: () => {},
            setListPassIllimix: () => {},
            getStatusLoadingPass: () => {
              return of();
            },
            getListPassIllimix: () => {},
            getListPassIllimixShown: () => {},
            getCategoryListPassIllimix: () => {}
          }
        },
        {
          provide: DashboardService,
          useValue: {
            getCurrentPhoneNumber: () => {}
          }
        },
        {
          provide: Router
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllimixListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
